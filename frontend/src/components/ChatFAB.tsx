'use client'

import { useAuth } from '@/context/AuthContext'
import { useChat } from '@/hooks/useChat'
import type { components } from '@/types/api'
import { apiClient } from '@/utils/apiClient'
import { Client } from '@stomp/stompjs'
import { useEffect, useRef, useState } from 'react'
import SockJS from 'sockjs-client'

type View = 'closed' | 'list' | 'chat' | 'new'

type ChatRoomDto = components['schemas']['ChatRoomResponseDto']
type TrainerDto = components['schemas']['TrainerSummaryDto']
type ChatMessageDto = components['schemas']['ChatResponseDto']

const AVATAR_FALLBACK =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23bfc3d4'%3E%3Ccircle cx='12' cy='8' r='4'/%3E%3Cpath d='M4 20c0-4 3.6-7 8-7s8 3 8 7'/%3E%3C/svg%3E"

function Avatar({ src, alt, className }: { src?: string; alt: string; className?: string }) {
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={src || AVATAR_FALLBACK}
            alt={alt}
            className={className}
            onError={(e) => {
                e.currentTarget.src = AVATAR_FALLBACK
            }}
        />
    )
}

interface ChatEntry {
    roomId: number
    name: string
    src: string
    lastMsg: string
    time: string
    unread: number
}

function formatTime(dateStr?: string | null): string {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const now = new Date()
    const isToday =
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate()
    if (isToday) {
        return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    }
    const yesterday = new Date(now)
    yesterday.setDate(now.getDate() - 1)
    const isYesterday =
        date.getFullYear() === yesterday.getFullYear() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getDate() === yesterday.getDate()
    return isYesterday
        ? '어제'
        : date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
}

function toEntry(dto: ChatRoomDto, myId: number): ChatEntry {
    return {
        roomId: dto.chatRoomId ?? 0,
        name: dto.userId === myId ? (dto.trainerName ?? '') : (dto.userName ?? ''),
        src: dto.trainerProfile ?? '',
        lastMsg: dto.lastMessage ?? '',
        time: formatTime(dto.lastMessageAt),
        unread: dto.unreadCount ?? 0,
    }
}

export default function ChatFAB() {
    const { user } = useAuth()

    const [view, setView] = useState<View>('closed')
    const [selectedChat, setSelectedChat] = useState<ChatEntry | null>(null)
    const [inputText, setInputText] = useState('')
    const [chatList, setChatList] = useState<ChatEntry[]>([])
    const [history, setHistory] = useState<ChatMessageDto[]>([])
    const [trainers, setTrainers] = useState<TrainerDto[]>([])
    const [trainerSearch, setTrainerSearch] = useState('')
    const [unread, setUnread] = useState(0)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const authHeaders = (): Record<string, string> =>
        user ? { Authorization: `Bearer ${user.token}` } : {}

    const { messages, sendMessage, connected } = useChat({
        roomId: selectedChat?.roomId ?? 0,
        myId: user?.memberId ?? 0,
    })

    const allMessages = [
        ...history,
        ...messages.filter(
            (m) => !history.some((h) => h.sentAt === m.sentAt && h.message === m.message)
        ),
    ]

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [allMessages.length])

    // 로그인 시 초기 배지 + WebSocket 실시간 구독
    useEffect(() => {
        if (!user) return
        apiClient
            .GET('/api/chat', { params: { query: { memberId: user.memberId } }, headers: { Authorization: `Bearer ${user.token}` } })
            .then(({ data }) => {
                if (data) setUnread(data.reduce((s, d) => s + (d.unreadCount ?? 0), 0))
            })
            .catch(() => {})
        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            onConnect: () => {
                client.subscribe(`/sub/notify/${user.memberId}`, (frame) => {
                    setUnread(JSON.parse(frame.body) as number)
                    // chatList도 갱신해야 entry.unread가 정확해짐
                    apiClient
                        .GET('/api/chat', { params: { query: { memberId: user.memberId } }, headers: { Authorization: `Bearer ${user.token}` } })
                        .then(({ data }) => { if (data) setChatList(data.map((dto) => toEntry(dto, user.memberId))) })
                        .catch(() => {})
                })
            },
        })
        client.activate()
        return () => { client.deactivate() }
    }, [user])

    // 채팅 목록 조회
    useEffect(() => {
        if (view !== 'list' || !user) return
        apiClient
            .GET('/api/chat', {
                params: { query: { memberId: user.memberId } },
                headers: authHeaders(),
            })
            .then(({ data }) => {
                if (data) setChatList(data.map((dto) => toEntry(dto, user.memberId)))
            })
            .catch(() => setChatList([]))
    }, [view, user])

    // 채팅방 선택 시 히스토리 조회 + 읽음 처리
    const openChat = async (entry: ChatEntry) => {
        setUnread((prev) => Math.max(0, prev - entry.unread))
        setChatList((prev) => prev.map((c) => c.roomId === entry.roomId ? { ...c, unread: 0 } : c))
        setSelectedChat(entry)
        setHistory([])
        setView('chat')

        await Promise.all([
            apiClient
                .GET('/api/chat/{roomId}/messages', {
                    params: { path: { roomId: entry.roomId } },
                    headers: authHeaders(),
                })
                .then(({ data }) => { if (data) setHistory(data) })
                .catch(() => {}),

            apiClient
                .PUT('/api/chat/{roomId}/read', {
                    params: {
                        path: { roomId: entry.roomId },
                        query: { memberId: user!.memberId },
                    },
                    headers: authHeaders(),
                })
                .catch(() => {}),
        ])
    }

    // 트레이너 목록 조회
    useEffect(() => {
        if (view !== 'new' || !user) return
        apiClient
            .GET('/api/members/trainers', { headers: authHeaders() })
            .then(({ data }) => { if (data) setTrainers(data) })
            .catch(() => setTrainers([]))
    }, [view, user])

    // 트레이너 선택 → 채팅방 생성 or 기존 방 오픈
    const startChat = async (trainer: TrainerDto) => {
        if (!user || !trainer.id) return
        const { data: room } = await apiClient.POST('/api/chat', {
            body: { trainerId: trainer.id, userId: user.memberId },
            headers: authHeaders(),
        })
        if (!room) return
        await openChat({
            roomId: room.chatRoomId ?? 0,
            name: trainer.userName ?? '',
            src: trainer.profileImage ?? '',
            lastMsg: '',
            time: '',
            unread: 0,
        })
    }

    const handleSend = () => {
        const trimmed = inputText.trim()
        if (!trimmed || !connected) return
        sendMessage(trimmed)
        setInputText('')
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSend()
    }

    if (!user) return null

    const filteredTrainers = trainers.filter((t) =>
        (t.userName ?? '').includes(trainerSearch)
    )

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
            {/* 채팅 목록 패널 */}
            {view === 'list' && (
                <div className="w-[360px] bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant overflow-hidden flex flex-col">
                    <div className="bg-primary p-4 text-on-primary flex items-center justify-between">
                        <h3 className="font-headline-sm text-headline-sm">채팅</h3>
                        <button
                            className="material-symbols-outlined hover:bg-white/10 rounded-full p-1"
                            onClick={() => setView('closed')}
                        >
                            close
                        </button>
                    </div>

                    <div className="h-80 overflow-y-auto bg-surface-container-low">
                        {chatList.length === 0 && (
                            <p className="text-center text-body-sm text-on-surface-variant p-8">
                                채팅방이 없습니다.
                            </p>
                        )}
                        {chatList.map((entry, i) => (
                            <div
                                key={entry.roomId}
                                className={`flex items-center gap-3 p-4 hover:bg-surface-container transition-colors cursor-pointer ${
                                    i < chatList.length - 1 ? 'border-b border-outline-variant/30' : ''
                                }`}
                                onClick={() => openChat(entry)}
                            >
                                <div className="relative">
                                    <Avatar
                                        className="w-12 h-12 rounded-full object-cover bg-surface-container-high"
                                        src={entry.src}
                                        alt={entry.name}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <p className="font-label-bold text-label-bold truncate">{entry.name}</p>
                                        <span className="text-[10px] text-secondary shrink-0 ml-1">{entry.time}</span>
                                    </div>
                                    <div className="flex justify-between items-center gap-1">
                                        <p className="text-body-sm text-on-surface-variant truncate">{entry.lastMsg}</p>
                                        {entry.unread > 0 && (
                                            <span className="bg-primary text-on-primary text-[10px] font-bold min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full shrink-0">
                                                {entry.unread}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-3 border-t border-outline-variant bg-surface-container-lowest">
                        <button
                            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-primary text-on-primary text-label-bold font-label-bold hover:opacity-90 transition-opacity"
                            onClick={() => setView('new')}
                        >
                            <span className="material-symbols-outlined text-base">add</span>
                            새 채팅 시작
                        </button>
                    </div>
                </div>
            )}

            {/* 새 채팅 (트레이너 선택) */}
            {view === 'new' && (
                <div className="w-[360px] bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant overflow-hidden flex flex-col">
                    <div className="bg-primary p-4 text-on-primary space-y-3">
                        <div className="flex items-center gap-2">
                            <button
                                className="material-symbols-outlined hover:bg-white/10 rounded-full p-1"
                                onClick={() => setView('list')}
                            >
                                arrow_back
                            </button>
                            <h3 className="font-headline-sm text-headline-sm">트레이너 선택</h3>
                        </div>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/80 text-sm">
                                search
                            </span>
                            <input
                                className="w-full bg-white/20 border-none rounded-xl py-2 pl-10 pr-4 text-body-sm placeholder:text-white/60 focus:ring-2 focus:ring-white/40"
                                placeholder="트레이너 이름 검색"
                                value={trainerSearch}
                                onChange={(e) => setTrainerSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="h-80 overflow-y-auto bg-surface-container-low">
                        {filteredTrainers.length === 0 && (
                            <p className="text-center text-body-sm text-on-surface-variant p-8">
                                트레이너가 없습니다.
                            </p>
                        )}
                        {filteredTrainers.map((trainer, i) => (
                            <div
                                key={trainer.id}
                                className={`flex items-center gap-3 p-4 hover:bg-surface-container transition-colors cursor-pointer ${
                                    i < filteredTrainers.length - 1 ? 'border-b border-outline-variant/30' : ''
                                }`}
                                onClick={() => startChat(trainer)}
                            >
                                <Avatar
                                    className="w-12 h-12 rounded-full object-cover bg-surface-container-high"
                                    src={trainer.profileImage ?? ''}
                                    alt={trainer.userName ?? ''}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="font-label-bold text-label-bold">{trainer.userName}</p>
                                    <p className="text-body-sm text-on-surface-variant">트레이너</p>
                                </div>
                                <span className="material-symbols-outlined text-primary">chat</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 개별 채팅창 */}
            {view === 'chat' && selectedChat && (
                <div className="w-[360px] bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant overflow-hidden flex flex-col">
                    <div className="bg-primary p-4 flex items-center justify-between text-on-primary">
                        <div className="flex items-center gap-3">
                            <button
                                className="material-symbols-outlined hover:bg-white/10 rounded-full p-1"
                                onClick={() => setView('list')}
                            >
                                arrow_back
                            </button>
                            <Avatar
                                alt={selectedChat.name}
                                className="w-10 h-10 rounded-full object-cover border-2 border-white/20 bg-white/10"
                                src={selectedChat.src}
                            />
                            <div>
                                <p className="font-label-bold text-label-bold">{selectedChat.name}</p>
                                <p className="text-xs opacity-80">{connected ? '온라인' : '연결 중...'}</p>
                            </div>
                        </div>
                        <button
                            className="material-symbols-outlined hover:bg-white/10 rounded-full p-1"
                            onClick={() => setView('closed')}
                        >
                            close
                        </button>
                    </div>

                    <div className="h-80 overflow-y-auto p-4 space-y-4 bg-surface-container-low">
                        {allMessages.length === 0 && (
                            <p className="text-center text-body-sm text-on-surface-variant mt-8">
                                아직 메시지가 없습니다.
                            </p>
                        )}
                        {allMessages.map((msg, i) => {
                            const isMine = msg.senderId === user.memberId
                            return (
                                <div
                                    key={i}
                                    className={`flex flex-col gap-1 max-w-[85%] ${isMine ? 'items-end ml-auto' : 'items-start'}`}
                                >
                                    <div
                                        className={`p-3 text-body-sm ${
                                            isMine
                                                ? 'bg-primary text-on-primary rounded-2xl rounded-tr-none'
                                                : 'bg-surface-container-highest text-on-surface rounded-2xl rounded-tl-none'
                                        }`}
                                    >
                                        {msg.message}
                                    </div>
                                    <span className={`text-[10px] text-secondary ${isMine ? 'mr-1' : 'ml-1'}`}>
                                        {msg.sentAt
                                            ? new Date(msg.sentAt).toLocaleTimeString('ko-KR', {
                                                  hour: '2-digit',
                                                  minute: '2-digit',
                                              })
                                            : ''}
                                    </span>
                                </div>
                            )
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 bg-surface-container-lowest border-t border-outline-variant flex items-center gap-2">
                        <input
                            className="flex-1 bg-surface-container border-none rounded-full px-4 py-2 text-body-sm focus:ring-2 focus:ring-primary"
                            placeholder={connected ? '메시지를 입력하세요' : '연결 중...'}
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={!connected}
                        />
                        <button
                            className="material-symbols-outlined text-primary hover:scale-110 transition-transform disabled:opacity-40"
                            onClick={handleSend}
                            disabled={!connected || !inputText.trim()}
                        >
                            send
                        </button>
                    </div>
                </div>
            )}

            {/* FAB 버튼 - 패널 닫혀있을 때만 표시 */}
            {view === 'closed' && (
                <button
                    className="relative w-14 h-14 bg-primary text-on-primary rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                    onClick={() => setView('list')}
                >
                    <span className="material-symbols-outlined text-3xl">chat</span>
                    {unread > 0 && (
                        <span className="absolute top-0 right-0 bg-error text-on-primary text-[10px] font-bold min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full">
                            {unread > 99 ? '99+' : unread}
                        </span>
                    )}
                </button>
            )}
        </div>
    )
}

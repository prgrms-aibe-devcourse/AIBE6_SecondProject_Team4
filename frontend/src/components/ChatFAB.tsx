'use client'

import { useAuth } from '@/context/AuthContext'
import { useChat } from '@/hooks/useChat'
import type { components } from '@/types/api'
import { apiClient, getImageUrl } from '@/utils/apiClient'
import { Client } from '@stomp/stompjs'
import { useEffect, useRef, useState } from 'react'
import SockJS from 'sockjs-client'

type View = 'closed' | 'list' | 'chat' | 'new'

type ChatRoomDto = components['schemas']['ChatRoomResponseDto']
type TrainerDto = components['schemas']['TrainerSummaryDto']
type ChatMessageDto = components['schemas']['ChatResponseDto']

function Avatar({ src, alt, className }: { src?: string; alt: string; className?: string }) {
    const [failed, setFailed] = useState(false)

    if (!src || failed) {
        return (
            <div className={`bg-primary-fixed text-primary flex items-center justify-center ${className}`}>
                <span className="material-symbols-outlined text-2xl">person</span>
            </div>
        )
    }

    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={src}
            alt={alt}
            className={className}
            onError={() => setFailed(true)}
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
    lastMessageAt: string
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
        src: dto.userId === myId ? getImageUrl(dto.trainerProfile) : getImageUrl(dto.userProfile),
        lastMsg: dto.lastMessage ?? '',
        time: formatTime(dto.lastMessageAt),
        unread: dto.unreadCount ?? 0,
        lastMessageAt: dto.lastMessageAt ?? '',
    }
}

function formatDateLabel(dateStr: string): string {
    const date = new Date(dateStr)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
    const yesterday = new Date(now)
    yesterday.setDate(now.getDate() - 1)
    if (isToday) return '오늘'
    if (date.toDateString() === yesterday.toDateString()) return '어제'
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}

function sortByRecent(entries: ChatEntry[]): ChatEntry[] {
    return [...entries].sort((a, b) => {
        const ta = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0
        const tb = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0
        return tb - ta
    })
}

export default function ChatFAB() {
    const { user } = useAuth()

    const [view, setView] = useState<View>('closed')
    const [selectedChat, setSelectedChat] = useState<ChatEntry | null>(null)
    const [inputText, setInputText] = useState('')
    const [chatList, setChatList] = useState<ChatEntry[]>([])
    const [history, setHistory] = useState<ChatMessageDto[]>([])
    const [hasMore, setHasMore] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false)
    const shouldScrollRef = useRef(false)
    const selectedChatRef = useRef<ChatEntry | null>(null)
    const [trainers, setTrainers] = useState<TrainerDto[]>([])
    const [trainerSearch, setTrainerSearch] = useState('')
    const [unread, setUnread] = useState(0)
    const [sendError, setSendError] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const messagesTopRef = useRef<HTMLDivElement>(null)
    const scrollBoxRef = useRef<HTMLDivElement>(null)

    const authHeaders = (): Record<string, string> =>
        user ? { Authorization: `Bearer ${user.token}` } : {}

    useEffect(() => { selectedChatRef.current = selectedChat }, [selectedChat])

    const { messages, sendMessage, connected, clearMessages, markAllRead } = useChat({
        roomId: selectedChat?.roomId ?? 0,
        myId: user?.memberId ?? 0,
    })

    // id 기반 중복 제거
    const allMessages = [
        ...history,
        ...messages.filter((m) => !history.some((h) => h.id === m.id)),
    ]

    // 새 WebSocket 메시지 수신 시 스크롤 + 읽음 처리
    useEffect(() => {
        if (messages.length === 0 || !selectedChat || !user) return
        shouldScrollRef.current = true
        apiClient
            .PUT('/api/chat/{roomId}/read', {
                params: { path: { roomId: selectedChat.roomId }, query: { memberId: user.memberId } },
                headers: authHeaders(),
            })
            .catch(() => {})
    }, [messages.length])

    useEffect(() => {
        if (shouldScrollRef.current) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
            shouldScrollRef.current = false
        }
    }, [allMessages.length])

    // 알림에서 채팅방 열기 이벤트 수신
    useEffect(() => {
        const handler = async (e: Event) => {
            const { roomId } = (e as CustomEvent).detail
            if (!user || !roomId) return
            const { data: rooms } = await apiClient.GET('/api/chat', {
                params: { query: { memberId: user.memberId } },
                headers: { Authorization: `Bearer ${user.token}` },
            })
            const room = rooms?.find(r => r.chatRoomId === roomId)
            if (room) {
                await openChat(toEntry(room, user.memberId))
            }
        }
        window.addEventListener('open-chat-room', handler)
        return () => window.removeEventListener('open-chat-room', handler)
    }, [user])

    // 트레이너 상세 페이지 상담하기 버튼에서 채팅 열기
    useEffect(() => {
        const handler = async (e: Event) => {
            const { trainerId, name, profileImage } = (e as CustomEvent<{ trainerId: number; name: string; profileImage: string }>).detail
            if (!user || !trainerId) return
            const { data: room } = await apiClient.POST('/api/chat', {
                body: { trainerId, userId: user.memberId },
                headers: { Authorization: `Bearer ${user.token}` },
            })
            if (!room) return
            await openChat({
                roomId: room.chatRoomId ?? 0,
                name,
                src: getImageUrl(profileImage),
                lastMsg: '',
                time: '',
                unread: 0,
                lastMessageAt: '',
            })
        }
        window.addEventListener('open-chat-with-trainer', handler)
        return () => window.removeEventListener('open-chat-with-trainer', handler)
    }, [user])

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
                client.subscribe(`/sub/notify/${user.memberId}`, () => {
                    apiClient
                        .GET('/api/chat', { params: { query: { memberId: user.memberId } }, headers: { Authorization: `Bearer ${user.token}` } })
                        .then(({ data }) => {
                            if (!data) return
                            const currentRoomId = selectedChatRef.current?.roomId
                            // 현재 보고 있는 채팅방은 이미 읽는 중이므로 unread=0으로 처리
                            const list = sortByRecent(data.map((dto) => {
                                const entry = toEntry(dto, user.memberId)
                                return entry.roomId === currentRoomId ? { ...entry, unread: 0 } : entry
                            }))
                            setChatList(list)
                            setUnread(list.reduce((s, c) => s + c.unread, 0))
                        })
                        .catch(() => {})
                })
            },
        })
        client.activate()
        return () => { client.deactivate() }
    }, [user])

    // 채팅방 열릴 때 /sub/read/{roomId} 구독 — 상대방이 읽으면 내 메시지 isRead 갱신
    useEffect(() => {
        if (!selectedChat || !user) return
        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            onConnect: () => {
                client.subscribe(`/sub/read/${selectedChat.roomId}`, () => {
                    setHistory((prev) => prev.map((m) =>
                        m.senderId === user.memberId ? { ...m, isRead: true } : m
                    ))
                    markAllRead(user.memberId)
                })
            },
        })
        client.activate()
        return () => { client.deactivate() }
    }, [selectedChat?.roomId])

    // 채팅 목록 조회
    useEffect(() => {
        if (view !== 'list' || !user) return
        apiClient
            .GET('/api/chat', {
                params: { query: { memberId: user.memberId } },
                headers: authHeaders(),
            })
            .then(({ data }) => {
                if (data) setChatList(sortByRecent(data.map((dto) => toEntry(dto, user.memberId))))
            })
            .catch(() => setChatList([]))
    }, [view, user])

    // 이전 메시지 20개 더 불러오기
    const loadMoreMessages = async (roomId: number) => {
        if (loadingMore || !hasMore) return
        const oldestId = history[0]?.id
        if (!oldestId) return
        setLoadingMore(true)
        const scrollBox = scrollBoxRef.current
        const prevHeight = scrollBox?.scrollHeight ?? 0
        const { data } = await apiClient
            .GET('/api/chat/{roomId}/messages', {
                params: { path: { roomId }, query: { before: oldestId, size: 20 } },
                headers: authHeaders(),
            })
            .catch(() => ({ data: null }))
        if (data) {
            setHasMore(data.length === 20)
            setHistory((prev) => [...data, ...prev])
            // 스크롤 위치 유지
            requestAnimationFrame(() => {
                if (scrollBox) scrollBox.scrollTop = scrollBox.scrollHeight - prevHeight
            })
        }
        setLoadingMore(false)
    }

    // 채팅방 선택 시 히스토리 조회 + 읽음 처리
    const openChat = async (entry: ChatEntry) => {
        setUnread((prev) => Math.max(0, prev - entry.unread))
        setChatList((prev) => prev.map((c) => c.roomId === entry.roomId ? { ...c, unread: 0 } : c))
        setSelectedChat(entry)
        setHistory([])
        setHasMore(false)
        clearMessages()
        setView('chat')

        await Promise.all([
            apiClient
                .GET('/api/chat/{roomId}/messages', {
                    params: { path: { roomId: entry.roomId }, query: { size: 20 } },
                    headers: authHeaders(),
                })
                .then(({ data }) => {
                    if (data) {
                        shouldScrollRef.current = true
                        setHistory(data)
                        setHasMore(data.length === 20)
                    }
                })
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
            src: getImageUrl(trainer.profileImage),
            lastMsg: '',
            time: '',
            unread: 0,
            lastMessageAt: '',
        })
    }

    const handleSend = () => {
        const trimmed = inputText.trim()
        if (!trimmed) return
        if (!connected) {
            setSendError(true)
            setTimeout(() => setSendError(false), 3000)
            return
        }
        sendMessage(trimmed)
        setInputText('')
        setSendError(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleSend()
    }

    const handleLeaveRoom = async () => {
        if (!selectedChat || !user) return
        if (!confirm(`'${selectedChat.name}'님과의 채팅방을 나가시겠습니까?`)) return
        await apiClient
            .DELETE('/api/chat/{roomId}', {
                params: { path: { roomId: selectedChat.roomId }, query: { memberId: user.memberId } },
                headers: authHeaders(),
            })
            .catch(() => {})
        setChatList((prev) => prev.filter((c) => c.roomId !== selectedChat.roomId))
        setSelectedChat(null)
        setView('list')
    }

    if (!user) return null

    const filteredTrainers = trainers.filter((t) =>
        t.id !== user.memberId && (t.userName ?? '').includes(trainerSearch)
    )

    return (
        <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 flex flex-col items-end gap-4">
            {/* 채팅 목록 패널 */}
            {view === 'list' && (
                <div className="w-[calc(100vw-2rem)] sm:w-[360px] bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant overflow-hidden flex flex-col">
                    <div className="bg-primary p-4 text-on-primary flex items-center justify-between">
                        <h3 className="font-headline-sm text-headline-sm">채팅</h3>
                        <button
                            className="material-symbols-outlined hover:bg-white/10 rounded-full p-1 cursor-pointer"
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
                            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-primary text-on-primary text-label-bold font-label-bold hover:opacity-90 transition-opacity cursor-pointer"
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
                <div className="w-[calc(100vw-2rem)] sm:w-[360px] bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant overflow-hidden flex flex-col">
                    <div className="bg-primary p-4 text-on-primary space-y-3">
                        <div className="flex items-center gap-2">
                            <button
                                className="material-symbols-outlined hover:bg-white/10 rounded-full p-1 cursor-pointer"
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
                                    src={getImageUrl(trainer.profileImage)}
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
                <div className="w-[calc(100vw-2rem)] sm:w-[360px] bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant overflow-hidden flex flex-col">
                    <div className="bg-primary p-4 flex items-center justify-between text-on-primary">
                        <div className="flex items-center gap-3">
                            <button
                                className="material-symbols-outlined hover:bg-white/10 rounded-full p-1 cursor-pointer"
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
                        <div className="flex items-center gap-1">
                            <button
                                className="material-symbols-outlined hover:bg-white/10 rounded-full p-1 text-[20px] cursor-pointer"
                                title="채팅방 나가기"
                                onClick={handleLeaveRoom}
                            >
                                exit_to_app
                            </button>
                            <button
                                className="material-symbols-outlined hover:bg-white/10 rounded-full p-1 cursor-pointer"
                                onClick={() => setView('closed')}
                            >
                                close
                            </button>
                        </div>
                    </div>

                    <div
                        ref={scrollBoxRef}
                        className="h-80 overflow-y-auto p-4 space-y-4 bg-surface-container-low"
                        onScroll={(e) => {
                            if (e.currentTarget.scrollTop === 0 && hasMore && selectedChat) {
                                loadMoreMessages(selectedChat.roomId)
                            }
                        }}
                    >
                        {loadingMore && (
                            <p className="text-center text-[11px] text-on-surface-variant py-1">불러오는 중...</p>
                        )}
                        {!hasMore && history.length > 0 && (
                            <p className="text-center text-[11px] text-on-surface-variant py-1">첫 번째 메시지입니다.</p>
                        )}
                        {allMessages.length === 0 && (
                            <p className="text-center text-body-sm text-on-surface-variant mt-8">
                                아직 메시지가 없습니다.
                            </p>
                        )}
                        {allMessages.map((msg, i) => {
                            const isMine = msg.senderId === user.memberId
                            const dateLabel = msg.sentAt ? formatDateLabel(msg.sentAt) : null
                            const prevDateLabel = i > 0 && allMessages[i - 1].sentAt
                                ? formatDateLabel(allMessages[i - 1].sentAt!)
                                : null
                            const showDate = dateLabel && dateLabel !== prevDateLabel
                            return (
                                <div key={msg.id ?? i}>
                                    {showDate && (
                                        <div className="flex items-center gap-2 my-2">
                                            <div className="flex-1 h-px bg-outline-variant/40" />
                                            <span className="text-[10px] text-on-surface-variant shrink-0">{dateLabel}</span>
                                            <div className="flex-1 h-px bg-outline-variant/40" />
                                        </div>
                                    )}
                                    <div className={`flex items-end gap-1 max-w-[85%] ${isMine ? 'ml-auto flex-row-reverse' : ''}`}>
                                        {!isMine && (
                                            <Avatar
                                                src={selectedChat?.src}
                                                alt={selectedChat?.name ?? ''}
                                                className="w-7 h-7 rounded-full shrink-0 object-cover mb-5"
                                            />
                                        )}
                                        <div className={`flex flex-col gap-1 ${isMine ? 'items-end' : 'items-start'}`}>
                                            <div className={`p-3 text-body-sm ${
                                                isMine
                                                    ? 'bg-primary text-on-primary rounded-2xl rounded-tr-none'
                                                    : 'bg-surface-container-highest text-on-surface rounded-2xl rounded-tl-none'
                                            }`}>
                                                {msg.message}
                                            </div>
                                            <span className={`text-[10px] text-secondary ${isMine ? 'mr-1' : 'ml-1'}`}>
                                                {msg.sentAt
                                                    ? new Date(msg.sentAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
                                                    : ''}
                                            </span>
                                        </div>
                                        {isMine && !msg.isRead && (
                                            <span className="text-[10px] text-primary font-bold mb-5 shrink-0">1</span>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="bg-surface-container-lowest border-t border-outline-variant">
                        {sendError && (
                            <p className="text-[11px] text-error text-center py-1">연결이 끊겼습니다. 잠시 후 다시 시도해주세요.</p>
                        )}
                        <div className="p-4 flex items-center gap-2">
                            <input
                                className={`flex-1 bg-surface-container border-none rounded-full px-4 py-2 text-body-sm focus:ring-2 ${sendError ? 'ring-2 ring-error focus:ring-error' : 'focus:ring-primary'}`}
                                placeholder={connected ? '메시지를 입력하세요' : '연결 중...'}
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <button
                                className="material-symbols-outlined text-primary hover:scale-110 transition-transform disabled:opacity-40 cursor-pointer"
                                onClick={handleSend}
                                disabled={!inputText.trim()}
                            >
                                send
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* FAB 버튼 - 패널 닫혀있을 때만 표시 */}
            {view === 'closed' && (
                <button
                    className="relative w-14 h-14 bg-primary text-on-primary rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer"
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

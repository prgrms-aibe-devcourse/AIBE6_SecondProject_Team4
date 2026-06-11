'use client'

import { useEffect, useRef, useState } from 'react'

import { useChat } from '@/hooks/useChat'

type View = 'closed' | 'list' | 'chat'

interface ChatEntry {
    roomId: number  // 백엔드 chat_rooms.id
    name: string
    src: string
    lastMsg: string
    time: string
    unread?: number
    online?: boolean
}

const chatList: ChatEntry[] = [
    {
        roomId: 1, // 실제 DB의 chat_rooms.id
        name: '김민수 트레이너',
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA09pq8e0kKsbZDTF-lUdSQIOoXVn-07pIYtLl_-Zaax5ktY-YqTykDCIktBi4cbscdTLvHEwvRSn1J8dPEm5rE-Hrx0IE2cSdReJduclUxdP7ThEZXQ-EzixnyTOdUTaR-2FfZS7ZdxqsDqcdJgSEMldAVcbfT-08eEaNDNY8mg6W6zi6LfwtMFbXqqFhYPwWs6ce-X6TNlQxHKPlDRH9xBBK5MCA9FehpMFMTRfzqiin-tgxB-uhjCEuayakmauWBFGL-WA135w',
        lastMsg: '오늘 하체 루틴 정말 좋았어요! 식...',
        time: '오후 2:30',
        unread: 2,
        online: true,
    },
    {
        roomId: 2,
        name: '최윤지 트레이너',
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASA0uzgLYeb0CfbPrpu0fo0lIFLL8yHAF3T1rcRly0KKSH9m520u-dmSpIGxHvP1gIt8ZcQn0IatJxWrJpAci04rJCs4b9hILc8LrtCMWlAaP2A2gu7RDYZlfuv7YxgQDjkEntdU4PGvUkZzKCqouvEIVOi9NE2WXDvVcYyWobCV40FnobnyTK698CmtucSjzae9eAV2uA3A0Xefim433ZqKgyVLdzcKCjqAz2z5nWz-ftEVHIWxeU4SOou4wWdu9EdFt7TrKjsQ',
        lastMsg: '내일 오전 10시 수업 잊지 마세요!',
        time: '오전 11:15',
    },
    {
        roomId: 3,
        name: '박준호 트레이너',
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNpZpuHpNSp8s8JVMNc8popczKvH1wIhD3Eu9jvrvnhHIo6z5nZ-0mAnlw5fNIXsQK7pHxZRRlNRlZdY7-cp8pNKM3TILuvqYFpOOUPI-jDzpednr5mLQnkEqdXx3xuheEXOFwWep4MsF2lsLmfFh2rPSh4Qc5foOXfYvdWdvrjVlRdfn3qbWDe0seA-V4_TJvzZYS6PmP5WPP-jNsYryAGWfp9JT4R0SKKPcE4kkVUxHKlP5EvB0OTYjqCkt1ogUbZQDHPd1ScQ',
        lastMsg: '수고하셨습니다. 주말 잘 보내세요.',
        time: '어제',
    },
]

// TODO: 로그인 구현 후 실제 로그인한 유저 ID 로 교체
const MY_ID = 1

export default function ChatFAB() {
    const [view, setView] = useState<View>('closed')
    const [selectedChat, setSelectedChat] = useState<ChatEntry | null>(null)
    const [inputText, setInputText] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // ── WebSocket 훅 연결 ────────────────────────────────────
    // selectedChat.roomId 가 있을 때만 연결, 채팅방 선택 전엔 roomId=0 (비활성)
    const { messages, sendMessage, connected } = useChat({
        roomId: selectedChat?.roomId ?? 0,
        myId: MY_ID,
    })

    // 새 메시지가 오면 스크롤을 맨 아래로 이동
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const openChat = (entry: ChatEntry) => {
        setSelectedChat(entry)
        setView('chat')
    }

    // 메시지 전송 핸들러
    const handleSend = () => {
        const trimmed = inputText.trim()
        if (!trimmed || !connected) return
        sendMessage(trimmed) // useChat 훅의 sendMessage 호출
        setInputText('')
    }

    // 엔터키로 전송
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSend()
    }

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
            {/* 채팅 목록 패널 */}
            {view === 'list' && (
                <div className="w-[360px] bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant overflow-hidden flex flex-col">
                    <div className="bg-primary p-4 space-y-4 text-on-primary">
                        <div className="flex items-center justify-between">
                            <h3 className="font-headline-sm text-headline-sm">채팅</h3>
                            <button
                                className="material-symbols-outlined hover:bg-white/10 rounded-full p-1"
                                onClick={() => setView('closed')}
                            >
                                close
                            </button>
                        </div>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/80 text-sm">
                                search
                            </span>
                            <input
                                className="w-full bg-white/20 border-none rounded-xl py-2 pl-10 pr-4 text-body-sm placeholder:text-white/60 focus:ring-2 focus:ring-white/40"
                                placeholder="트레이너 검색"
                                type="text"
                            />
                        </div>
                    </div>

                    <div className="h-80 overflow-y-auto bg-surface-container-low">
                        {chatList.map((entry, i) => (
                            <div
                                key={entry.name}
                                className={`flex items-center gap-3 p-4 hover:bg-surface-container transition-colors cursor-pointer ${
                                    i < chatList.length - 1
                                        ? 'border-b border-outline-variant/30'
                                        : ''
                                }`}
                                onClick={() => openChat(entry)}
                            >
                                <div className="relative">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        className="w-12 h-12 rounded-full object-cover"
                                        src={entry.src}
                                        alt={entry.name}
                                    />
                                    {entry.online && (
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-surface-container-low rounded-full" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <p className="font-label-bold text-label-bold truncate">
                                            {entry.name}
                                        </p>
                                        <span className="text-[10px] text-secondary">
                                            {entry.time}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-body-sm text-on-surface-variant truncate">
                                            {entry.lastMsg}
                                        </p>
                                        {entry.unread && (
                                            <span className="bg-primary text-on-primary text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shrink-0 ml-1">
                                                {entry.unread}
                                            </span>
                                        )}
                                    </div>
                                </div>
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
                            <div className="relative">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    alt={selectedChat.name}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                                    src={selectedChat.src}
                                />
                                {selectedChat.online && (
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-primary rounded-full" />
                                )}
                            </div>
                            <div>
                                <p className="font-label-bold text-label-bold">
                                    {selectedChat.name}
                                </p>
                                <p className="text-xs opacity-80">
                                    {selectedChat.online ? '온라인' : '오프라인'}
                                </p>
                            </div>
                        </div>
                        <button
                            className="material-symbols-outlined hover:bg-white/10 rounded-full p-1"
                            onClick={() => setView('closed')}
                        >
                            close
                        </button>
                    </div>

                    {/* 메시지 목록 — useChat 훅의 messages 배열을 그대로 렌더링 */}
                    <div className="h-80 overflow-y-auto p-4 space-y-4 bg-surface-container-low">

                        {/* 연결 상태 표시 */}
                        <p className="text-center text-[10px] text-secondary">
                            {connected ? '🟢 연결됨' : '⚪ 연결 중...'}
                        </p>

                        {/* 메시지가 없을 때 */}
                        {messages.length === 0 && (
                            <p className="text-center text-body-sm text-on-surface-variant">
                                아직 메시지가 없습니다.
                            </p>
                        )}

                        {/* 메시지 목록 */}
                        {messages.map((msg, i) => {
                            const isMine = msg.senderId === MY_ID
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
                                        {new Date(msg.sentAt).toLocaleTimeString('ko-KR', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                            )
                        })}

                        {/* 새 메시지 오면 여기로 스크롤 */}
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

            {/* FAB 버튼 */}
            <button
                className="w-14 h-14 bg-primary text-on-primary rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                onClick={() => setView(view === 'closed' ? 'list' : 'closed')}
            >
                <span className="material-symbols-outlined text-3xl">
                    {view !== 'closed' ? 'close' : 'chat'}
                </span>
            </button>
        </div>
    )
}

'use client'

import { useState } from 'react'

type View = 'closed' | 'list' | 'chat'

interface ChatEntry {
    name: string
    src: string
    lastMsg: string
    time: string
    unread?: number
    online?: boolean
}

const chatList: ChatEntry[] = [
    {
        name: '김민수 트레이너',
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA09pq8e0kKsbZDTF-lUdSQIOoXVn-07pIYtLl_-Zaax5ktY-YqTykDCIktBi4cbscdTLvHEwvRSn1J8dPEm5rE-Hrx0IE2cSdReJduclUxdP7ThEZXQ-EzixnyTOdUTaR-2FfZS7ZdxqsDqcdJgSEMldAVcbfT-08eEaNDNY8mg6W6zi6LfwtMFbXqqFhYPwWs6ce-X6TNlQxHKPlDRH9xBBK5MCA9FehpMFMTRfzqiin-tgxB-uhjCEuayakmauWBFGL-WA135w',
        lastMsg: '오늘 하체 루틴 정말 좋았어요! 식...',
        time: '오후 2:30',
        unread: 2,
        online: true,
    },
    {
        name: '최윤지 트레이너',
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASA0uzgLYeb0CfbPrpu0fo0lIFLL8yHAF3T1rcRly0KKSH9m520u-dmSpIGxHvP1gIt8ZcQn0IatJxWrJpAci04rJCs4b9hILc8LrtCMWlAaP2A2gu7RDYZlfuv7YxgQDjkEntdU4PGvUkZzKCqouvEIVOi9NE2WXDvVcYyWobCV40FnobnyTK698CmtucSjzae9eAV2uA3A0Xefim433ZqKgyVLdzcKCjqAz2z5nWz-ftEVHIWxeU4SOou4wWdu9EdFt7TrKjsQ',
        lastMsg: '내일 오전 10시 수업 잊지 마세요!',
        time: '오전 11:15',
    },
    {
        name: '박준호 트레이너',
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNpZpuHpNSp8s8JVMNc8popczKvH1wIhD3Eu9jvrvnhHIo6z5nZ-0mAnlw5fNIXsQK7pHxZRRlNRlZdY7-cp8pNKM3TILuvqYFpOOUPI-jDzpednr5mLQnkEqdXx3xuheEXOFwWep4MsF2lsLmfFh2rPSh4Qc5foOXfYvdWdvrjVlRdfn3qbWDe0seA-V4_TJvzZYS6PmP5WPP-jNsYryAGWfp9JT4R0SKKPcE4kkVUxHKlP5EvB0OTYjqCkt1ogUbZQDHPd1ScQ',
        lastMsg: '수고하셨습니다. 주말 잘 보내세요.',
        time: '어제',
    },
]

export default function ChatFAB() {
    const [view, setView] = useState<View>('closed')
    const [selectedChat, setSelectedChat] = useState<ChatEntry | null>(null)

    const openChat = (entry: ChatEntry) => {
        setSelectedChat(entry)
        setView('chat')
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

                    <div className="h-80 overflow-y-auto p-4 space-y-4 bg-surface-container-low">
                        <div className="flex flex-col items-start gap-1 max-w-[85%]">
                            <div className="bg-surface-container-highest text-on-surface p-3 rounded-2xl rounded-tl-none text-body-sm">
                                안녕하세요! 오늘 오전 하체 루틴은 어떠셨나요? 근육통이 조금 있을 수
                                있으니 스트레칭 꼭 잊지 마세요.
                            </div>
                            <span className="text-[10px] text-secondary ml-1">오전 11:30</span>
                        </div>
                        <div className="flex flex-col items-end gap-1 ml-auto max-w-[85%]">
                            <div className="bg-primary text-on-primary p-3 rounded-2xl rounded-tr-none text-body-sm">
                                생각보다 훨씬 힘들었지만 개운해요! 알려주신 폼롤러 동작 위주로 하고
                                있습니다.
                            </div>
                            <span className="text-[10px] text-secondary mr-1">오전 11:35</span>
                        </div>
                        <div className="flex flex-col items-start gap-1 max-w-[85%]">
                            <div className="bg-surface-container-highest text-on-surface p-3 rounded-2xl rounded-tl-none text-body-sm">
                                좋습니다! 폼롤러 하실 때 허벅지 옆면(장경인대) 쪽을 더 신경 써
                                주시면 회복에 큰 도움이 될 거예요.
                            </div>
                            <span className="text-[10px] text-secondary ml-1">오전 11:36</span>
                        </div>
                    </div>

                    <div className="p-4 bg-surface-container-lowest border-t border-outline-variant flex items-center gap-2">
                        <button className="material-symbols-outlined text-secondary hover:text-primary">
                            add_circle
                        </button>
                        <input
                            className="flex-1 bg-surface-container border-none rounded-full px-4 py-2 text-body-sm focus:ring-2 focus:ring-primary"
                            placeholder="메시지를 입력하세요"
                            type="text"
                        />
                        <button className="material-symbols-outlined text-primary hover:scale-110 transition-transform">
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

'use client'

import { useChat } from '@/hooks/useChat'
import { useEffect, useRef, useState } from 'react'

// ── 테스트용 설정 ─────────────────────────────────────────
// 실제 DB에 있는 값으로 바꿔주세요
const TEST_ROOM_ID = 1   // chat_rooms.id
const TEST_MY_ID = 1     // members.id (로그인한 유저)
const TEST_OTHER_ID = 2  // 상대방 id (메시지 구분용)
// ─────────────────────────────────────────────────────────

export default function ChatPage() {
    const [input, setInput] = useState('')
    const bottomRef = useRef<HTMLDivElement>(null)

    const { messages, sendMessage, connected } = useChat({
        roomId: TEST_ROOM_ID,
        myId: TEST_MY_ID,
    })

    // 새 메시지 오면 스크롤 아래로
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSend = () => {
        if (!input.trim() || !connected) return
        sendMessage(input.trim())
        setInput('')
    }

    return (
        <main className="pt-16 md:pt-20">
            <div className="max-w-screen-xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-4">채팅 테스트</h1>

                {/* 연결 상태 */}
                <div className="mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${connected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {connected ? '🟢 서버 연결됨' : '⚪ 연결 중...'}
                    </span>
                    <span className="ml-3 text-sm text-gray-400">
                        채팅방 #{TEST_ROOM_ID} · 내 ID: {TEST_MY_ID}
                    </span>
                </div>

                {/* 메시지 목록 */}
                <div className="border rounded-xl bg-gray-50 h-96 overflow-y-auto p-4 space-y-3 mb-4">
                    {messages.length === 0 && (
                        <p className="text-center text-gray-400 text-sm mt-8">
                            아직 메시지가 없습니다. 메시지를 보내보세요!
                        </p>
                    )}

                    {messages.map((msg, i) => {
                        const isMine = msg.senderId === TEST_MY_ID
                        return (
                            <div key={i} className={`flex flex-col gap-1 max-w-[70%] ${isMine ? 'ml-auto items-end' : 'items-start'}`}>
                                {/* 발신자 표시 */}
                                <span className="text-xs text-gray-400">
                                    {isMine ? '나' : `상대방 (ID: ${msg.senderId})`}
                                </span>
                                {/* 메시지 버블 */}
                                <div className={`px-4 py-2 rounded-2xl text-sm ${isMine ? 'bg-blue-500 text-white rounded-tr-none' : 'bg-white border rounded-tl-none'}`}>
                                    {msg.message}
                                </div>
                                {/* 시간 */}
                                <span className="text-xs text-gray-400">
                                    {new Date(msg.sentAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </span>
                            </div>
                        )
                    })}
                    <div ref={bottomRef} />
                </div>

                {/* 입력창 */}
                <div className="flex gap-2">
                    <input
                        className="flex-1 border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
                        placeholder={connected ? '메시지를 입력하세요 (Enter로 전송)' : '연결 중...'}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) { e.preventDefault(); handleSend() } }}
                        disabled={!connected}
                    />
                    <button
                        className="px-5 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed"
                        onClick={handleSend}
                        disabled={!connected || !input.trim()}
                    >
                        전송
                    </button>
                </div>

                {/* 테스트 안내 */}
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-800">
                    <p className="font-medium mb-1">🧪 테스트 방법</p>
                    <ol className="list-decimal list-inside space-y-1 text-xs">
                        <li>브라우저 탭 2개로 이 페이지를 엽니다</li>
                        <li>한쪽 탭에서 TEST_MY_ID를 1, 다른 탭은 2로 변경합니다</li>
                        <li>한쪽에서 메시지를 보내면 반대쪽에 실시간으로 수신됩니다</li>
                        <li>page.tsx 상단의 TEST_ROOM_ID, TEST_MY_ID 값을 실제 DB 값으로 맞춰주세요</li>
                    </ol>
                </div>
            </div>
        </main>
    )
}

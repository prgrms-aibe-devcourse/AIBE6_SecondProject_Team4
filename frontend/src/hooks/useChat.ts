'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

// 서버에서 받는 메시지 형태 (ChatResponseDto 와 일치)
export interface ChatMessage {
  chatRoomId: number
  senderId: number
  message: string
  sentAt: string
}

/**
 * WebSocket(STOMP) 채팅 훅
 *
 * ── 사용법 ──────────────────────────────────────────────────
 * const { messages, sendMessage, connected } = useChat({ roomId: 1, myId: 42 })
 * ────────────────────────────────────────────────────────────
 *
 * ── 내부 동작 순서 ──────────────────────────────────────────
 * 1. SockJS 로 /ws 에 연결 (HTTP → WebSocket 업그레이드)
 * 2. STOMP 프로토콜로 /sub/chat/{roomId} 구독
 * 3. sendMessage() 호출 시 /pub/chat/message 로 전송
 * 4. 서버가 같은 채팅방 구독자 전원에게 브로드캐스트 → messages 에 추가
 * ────────────────────────────────────────────────────────────
 */
export function useChat({ roomId, myId }: { roomId: number; myId: number }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [connected, setConnected] = useState(false)
  const clientRef = useRef<Client | null>(null) // STOMP 클라이언트를 ref 로 보관

  useEffect(() => {
    // ── STEP 1. STOMP 클라이언트 생성 ───────────────────────
    const client = new Client({
      // SockJS 를 transport 로 사용 (브라우저 호환성 보장)
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),

      // 연결 성공 시 실행
      onConnect: () => {
        setConnected(true)
        console.log('[WebSocket] 연결됨')

        // ── STEP 2. 채팅방 구독 ─────────────────────────────
        // /sub/chat/{roomId} 를 구독하면 이 채팅방으로 오는 모든 메시지를 받는다
        client.subscribe(`/sub/chat/${roomId}`, (frame) => {
          // frame.body 는 JSON 문자열 → 파싱해서 메시지 목록에 추가
          const received: ChatMessage = JSON.parse(frame.body)
          setMessages((prev) => [...prev, received])
        })
      },

      onDisconnect: () => {
        setConnected(false)
        console.log('[WebSocket] 연결 해제됨')
      },

      // 연결 오류 시
      onStompError: (frame) => {
        console.error('[WebSocket] 오류:', frame.headers['message'])
      },
    })

    // 연결 시작
    client.activate()
    clientRef.current = client

    // ── STEP 5. 컴포넌트 언마운트 시 연결 해제 ──────────────
    return () => {
      client.deactivate()
    }
  }, [roomId]) // roomId 가 바뀌면 재연결

  // ── STEP 3. 메시지 전송 함수 ─────────────────────────────
  const sendMessage = useCallback(
    (text: string) => {
      if (!clientRef.current?.connected) return

      // /pub/chat/message 로 전송 (ChatMessageDto 형태)
      clientRef.current.publish({
        destination: '/pub/chat/message',
        body: JSON.stringify({
          chatRoomId: roomId,
          senderId: myId,
          message: text,
        }),
      })
    },
    [roomId, myId],
  )

  return { messages, sendMessage, connected }
}

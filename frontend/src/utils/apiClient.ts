import createClient, { type Middleware } from 'openapi-fetch'

import type { paths } from '@/types/api'

let onTokenRefreshed: ((token: string) => void) | null = null

export function setTokenRefreshHandler(handler: (token: string) => void) {
    onTokenRefreshed = handler
}

const reissueMiddleware: Middleware = {
    async onResponse({ response, request }) {
        if (response.status !== 401) return response

        // 재발급 요청 자체가 401이면 무한루프 방지
        if (request.url.includes('/api/auth/reissue')) return response

        const reissueRes = await fetch('http://localhost:8080/api/auth/reissue', {
            method: 'POST',
            credentials: 'include', // HttpOnly 쿠키 자동 전송
        })

        if (!reissueRes.ok) {
            // 재발급 실패 → 로그아웃 이벤트 발행
            window.dispatchEvent(new Event('auth:logout'))
            return response
        }

        const data = await reissueRes.json()
        const newToken: string = data.accessToken

        // AuthContext에 새 토큰 반영
        onTokenRefreshed?.(newToken)

        // 원래 요청을 새 토큰으로 재시도
        const retryRequest = new Request(request, {
            headers: {
                ...Object.fromEntries(request.headers.entries()),
                Authorization: `Bearer ${newToken}`,
            },
        })
        return fetch(retryRequest)
    },
}

export const apiClient = createClient<paths>({
    baseUrl: 'http://localhost:8080',
    credentials: 'include',
})

apiClient.use(reissueMiddleware)

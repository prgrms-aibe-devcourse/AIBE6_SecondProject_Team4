<<<<<<< HEAD
=======
import createClient, { type Middleware } from 'openapi-fetch'

>>>>>>> fae692959338cee6c87bde98c2369096d474d590
import type { paths } from '@/types/api'
import createClient from 'openapi-fetch'

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

<<<<<<< HEAD
export function getAuthClient() {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('fitmate_user') : null
    const token = stored ? JSON.parse(stored).token : null

    return createClient<paths>({
        baseUrl: 'http://localhost:8080',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
}
=======
apiClient.use(reissueMiddleware)
>>>>>>> fae692959338cee6c87bde98c2369096d474d590

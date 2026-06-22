import type { paths } from '@/types/api';
import createClient, { type Middleware } from 'openapi-fetch';




































export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

let onTokenRefreshed: ((token: string) => void) | null = null

export function setTokenRefreshHandler(handler: (token: string) => void) {
    onTokenRefreshed = handler
}

// 동시에 여러 401이 발생해도 reissue는 한 번만 호출
let reissuePromise: Promise<string | null> | null = null

async function reissueToken(): Promise<string | null> {
    if (reissuePromise) return reissuePromise

    reissuePromise = fetch(`${API_BASE_URL}/api/auth/reissue`, {
        method: 'POST',
        credentials: 'include',
    })
        .then(async (res) => {
            if (!res.ok) return null
            const data = await res.json()
            return data.accessToken as string
        })
        .catch(() => null)
        .finally(() => {
            reissuePromise = null
        })

    return reissuePromise
}

const reissueMiddleware: Middleware = {
    async onResponse({ response, request }) {
        if (response.status !== 401) return response
        if (request.url.includes('/api/auth/reissue')) return response

        const newToken = await reissueToken()

        if (!newToken) {
            window.dispatchEvent(new Event('auth:logout'))
            return response
        }

        onTokenRefreshed?.(newToken)

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
    baseUrl: API_BASE_URL,
    credentials: 'include',
})

apiClient.use(reissueMiddleware)

export function getAuthClient() {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('fitmate_user') : null
    const token = stored ? JSON.parse(stored).token : null

    const client = createClient<paths>({
        baseUrl: API_BASE_URL,
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    })

    client.use(reissueMiddleware)
    return client
}

export function getImageUrl(path?: string | null): string {
    if (!path) return ''
    if (path.startsWith('http')) return path
    return `${API_BASE_URL}${path}`
}

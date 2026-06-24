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
    async onRequest({ request }) {
        // body는 onResponse 시점에 이미 소비되므로 미리 저장
        if (!['GET', 'HEAD'].includes(request.method)) {
            const bodyText = await request.text()
            ;(request as Request & { _bodyText?: string })._bodyText = bodyText
            return new Request(request, { body: bodyText })
        }
        return request
    },
    async onResponse({ response, request }) {
        if (response.status !== 401) return response
        if (request.url.includes('/api/auth/reissue')) return response

        const newToken = await reissueToken()

        if (!newToken) {
            window.dispatchEvent(new Event('auth:logout'))
            return response
        }

        onTokenRefreshed?.(newToken)

        const savedBody = (request as Request & { _bodyText?: string })._bodyText
        const retryRequest = new Request(request.url, {
            method: request.method,
            headers: {
                ...Object.fromEntries(request.headers.entries()),
                Authorization: `Bearer ${newToken}`,
            },
            body: ['GET', 'HEAD'].includes(request.method) ? undefined : savedBody,
            credentials: request.credentials,
            mode: request.mode,
            cache: request.cache,
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

export async function ensureFreshToken(): Promise<void> {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem('fitmate_user')
    if (!stored) return
    try {
        const parsed = JSON.parse(stored)
        const payload = JSON.parse(atob(parsed.token.split('.')[1]))
        if (Date.now() < payload.exp * 1000) return
        const newToken = await reissueToken()
        if (newToken) {
            onTokenRefreshed?.(newToken)
            parsed.token = newToken
            localStorage.setItem('fitmate_user', JSON.stringify(parsed))
        }
    } catch {}
}

export function getImageUrl(path?: string | null): string {
    if (!path) return ''
    if (path.startsWith('http')) return path
    return `${API_BASE_URL}${path}`
}

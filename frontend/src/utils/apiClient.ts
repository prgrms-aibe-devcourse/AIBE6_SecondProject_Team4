import type { paths } from '@/types/api'
import createClient, { type Middleware } from 'openapi-fetch'

let onTokenRefreshed: ((token: string) => void) | null = null

export function setTokenRefreshHandler(handler: (token: string) => void) {
    onTokenRefreshed = handler
}

const reissueMiddleware: Middleware = {
    async onResponse({ response, request }) {
        if (response.status !== 401) return response

        if (request.url.includes('/api/auth/reissue')) return response

        const reissueRes = await fetch('http://localhost:8080/api/auth/reissue', {
            method: 'POST',
            credentials: 'include',
        })

        if (!reissueRes.ok) {
            window.dispatchEvent(new Event('auth:logout'))
            return response
        }

        const data = await reissueRes.json()
        const newToken: string = data.accessToken

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
    baseUrl: 'http://localhost:8080',
    credentials: 'include',
})

apiClient.use(reissueMiddleware)

export function getAuthClient() {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('fitmate_user') : null
    const token = stored ? JSON.parse(stored).token : null

    const client = createClient<paths>({
        baseUrl: 'http://localhost:8080',
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    })

    client.use(reissueMiddleware)
    return client
}

export function getImageUrl(path?: string | null): string {
    if (!path) return ''
    if (path.startsWith('http')) return path
    return `http://localhost:8080${path}`
}

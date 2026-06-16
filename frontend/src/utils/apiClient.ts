import type { paths } from '@/types/api'
import createClient from 'openapi-fetch'

export const apiClient = createClient<paths>({
    baseUrl: 'http://localhost:8080',
})

export function getAuthClient() {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('fitmate_user') : null
    const token = stored ? JSON.parse(stored).token : null

    return createClient<paths>({
        baseUrl: 'http://localhost:8080',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
}

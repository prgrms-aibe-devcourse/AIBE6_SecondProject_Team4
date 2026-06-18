'use client'

import { useAuth } from '@/context/AuthContext'
import { apiClient } from '@/utils/apiClient'
import { Client } from '@stomp/stompjs'
import { useEffect, useState } from 'react'
import SockJS from 'sockjs-client'

export type AlertItem = {
    id?: number
    type?: 'MESSAGE' | 'REVIEW' | 'MATCHING' | 'INQUIRY'
    targetId?: number
    content?: string
    isRead?: boolean
    createdAt?: string
}

export function useAlert() {
    const { user } = useAuth()
    const [alerts, setAlerts] = useState<AlertItem[]>([])

    const authHeaders = () => user ? { Authorization: `Bearer ${user.token}` } : {}

    useEffect(() => {
        if (!user) return

        apiClient.GET('/api/alerts', { headers: authHeaders() }).then(({ data }) => {
            if (data) setAlerts(data as AlertItem[])
        })

        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            onConnect: () => {
                client.subscribe(`/sub/alert/${user.memberId}`, (message) => {
                    const newAlert: AlertItem = JSON.parse(message.body)
                    setAlerts(prev => [newAlert, ...prev])
                })
            },
        })
        client.activate()
        return () => { client.deactivate() }
    }, [user])

    const markOneRead = async (id: number) => {
        await apiClient.PATCH('/api/alerts/{alertId}/read' as never, { params: { path: { alertId: id } }, headers: authHeaders() } as never)
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a))
    }

    const markAllRead = async () => {
        await apiClient.PATCH('/api/alerts/read' as never, { headers: authHeaders() } as never)
        setAlerts(prev => prev.map(a => ({ ...a, isRead: true })))
    }

    const deleteOne = async (id: number) => {
        await apiClient.DELETE('/api/alerts/{alertId}', { params: { path: { alertId: id } }, headers: authHeaders() })
        setAlerts(prev => prev.filter(a => a.id !== id))
    }

    const deleteAll = async () => {
        await apiClient.DELETE('/api/alerts', { headers: authHeaders() })
        setAlerts([])
    }

    const unreadCount = alerts.filter(a => !a.isRead).length

    return { alerts, unreadCount, markOneRead, markAllRead, deleteOne, deleteAll }
}

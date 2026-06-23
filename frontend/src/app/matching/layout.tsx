'use client'

import { ReactNode, useEffect } from 'react'

const MATCHING_FORM_STORAGE_KEY = 'fitmate-matching-form'

let matchingStorageClearTimer: ReturnType<typeof setTimeout> | null = null
let isMatchingPageUnloading = false

export default function MatchingLayout({ children }: { children: ReactNode }) {
    useEffect(() => {
        if (matchingStorageClearTimer) {
            clearTimeout(matchingStorageClearTimer)
            matchingStorageClearTimer = null
        }

        const handleBeforeUnload = () => {
            isMatchingPageUnloading = true
        }

        window.addEventListener('beforeunload', handleBeforeUnload)

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)

            matchingStorageClearTimer = setTimeout(() => {
                if (!isMatchingPageUnloading) {
                    localStorage.removeItem(MATCHING_FORM_STORAGE_KEY)
                }

                isMatchingPageUnloading = false
                matchingStorageClearTimer = null
            }, 0)
        }
    }, [])

    return <>{children}</>
}

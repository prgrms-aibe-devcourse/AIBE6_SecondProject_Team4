'use client'

import { API_BASE_URL, getImageUrl } from '@/utils/apiClient';
import { useEffect, useRef, useState } from 'react';
































































interface CompletedEntry {
    date: string
    matchingId: number
    completed?: boolean
}

interface WorkoutLog {
    id: number
    matchingId: number
    date: string
    routine: string | null
    diet: string | null
    memo: string | null
    memberPhotos: { id: number; photoUrl: string }[]
    completed: boolean
    trainerNickname: string
    trainerComment: string | null
}

interface Props {
    matchingIds: number[]
}

export default function WorkoutCalendarMini({ matchingIds }: Props) {
    const [entries, setEntries] = useState<CompletedEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
    const [selectedEntry, setSelectedEntry] = useState<CompletedEntry | null>(null)
    const [selectedLogs, setSelectedLogs] = useState<WorkoutLog[]>([])
    const [logLoading, setLogLoading] = useState(false)
    const [uploadingPhoto, setUploadingPhoto] = useState<number | null>(null)
    const [completing, setCompleting] = useState<number | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const activeLogIdRef = useRef<number | null>(null)

    const getToken = () => {
        const stored = localStorage.getItem('fitmate_user')
        return stored ? JSON.parse(stored).token : null
    }

    const fetchEntries = async () => {
        if (!matchingIds.length) { setLoading(false); return }
        setLoading(true)
        const token = getToken()
        const params = matchingIds.map(id => `matchingIds=${id}`).join('&')
        const res = await fetch(`${API_BASE_URL}/api/workout/all-dates?${params}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) setEntries(await res.json())
        setLoading(false)
    }

    useEffect(() => { fetchEntries() }, [matchingIds.join(',')])

    const handleDayClick = async (dayEntries: CompletedEntry[]) => {
        setSelectedEntry(dayEntries[0])
        setSelectedLogs([])
        setLogLoading(true)
        const token = getToken()
        const results: WorkoutLog[] = []
        for (const entry of dayEntries) {
            const res = await fetch(`${API_BASE_URL}/api/matching/${entry.matchingId}/workout-logs`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            if (res.ok) {
                const logs: WorkoutLog[] = await res.json()
                const log = logs.find(l => l.date === entry.date)
                if (log) results.push({ ...log, matchingId: entry.matchingId })
            }
        }
        setSelectedLogs(results)
        setLogLoading(false)
    }

    const refreshSelectedLogs = async () => {
        if (!selectedEntry) return
        const dayEntries = entries.filter(e => e.date === selectedEntry.date)
        await handleDayClick(dayEntries)
        await fetchEntries()
    }

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, log: WorkoutLog) => {
        const file = e.target.files?.[0]
        if (!file) return
        setUploadingPhoto(log.id)
        const token = getToken()
        const formData = new FormData()
        formData.append('file', file)
        try {
            const uploadRes = await fetch(`${API_BASE_URL}/api/files/upload`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            })
            if (!uploadRes.ok) { alert('사진 업로드에 실패했습니다.'); return }
            const { url } = await uploadRes.json()
            await fetch(`${API_BASE_URL}/api/matching/${log.matchingId}/workout-logs/${log.id}/photos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ photoUrl: url }),
            })
            await refreshSelectedLogs()
        } catch { alert('오류가 발생했습니다.') }
        finally { setUploadingPhoto(null); e.target.value = '' }
    }

    const handleComplete = async (log: WorkoutLog) => {
        setCompleting(log.id)
        const token = getToken()
        await fetch(
            `${API_BASE_URL}/api/matching/${log.matchingId}/workout-logs/${log.id}/complete`,
            {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` },
            }
        )
        setCompleting(null)
        await refreshSelectedLogs()
    }

    const handlePhotoDelete = async (log: WorkoutLog, photoId: number) => {
        const token = getToken()
        await fetch(
            `${API_BASE_URL}/api/matching/${log.matchingId}/workout-logs/${log.id}/photos/${photoId}`,
            {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            }
        )
        await refreshSelectedLogs()
    }

    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay()
    const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate()
    const days: Array<Date | null> = [
        ...Array.from({ length: firstDayIndex }, () => null),
        ...Array.from({ length: lastDate }, (_, i) => new Date(currentYear, currentMonth, i + 1)),
    ]

    const toDateStr = (date: Date) =>
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

    const getEntries = (date: Date) => entries.filter(e => e.date === toDateStr(date))

    const monthlyCompleted = new Set(
        entries.filter(e => {
            const [y, m] = e.date.split('-').map(Number)
            return y === currentYear && m === currentMonth + 1
        }).map(e => e.date)
    ).size

    const prevMonth = () => {
        if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) }
        else setCurrentMonth(m => m - 1)
        setSelectedEntry(null); setSelectedLogs([])
    }
    const nextMonth = () => {
        if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) }
        else setCurrentMonth(m => m + 1)
        setSelectedEntry(null); setSelectedLogs([])
    }

    const formatDisplayDate = (dateStr: string) => {
        const d = new Date(`${dateStr}T00:00:00`)
        return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })
    }

    const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

    return (
        <section>
            <div style={{ marginBottom: '16px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#181c24', margin: 0 }}>
                    운동 현황
                </h2>
                <p style={{ fontSize: '14px', color: '#424654', marginTop: '4px' }}>
                    완료한 날짜를 클릭하면 상세 기록을 확인하고 인증 사진을 올릴 수 있어요.
                </p>
            </div>

            <div
                style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}
            >
                {/* 캘린더 */}
                <div
                    style={{
                        background: 'white',
                        borderRadius: '12px',
                        border: '1px solid #c2c6d6',
                        padding: '20px',
                        width: '320px',
                        flexShrink: 0,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '16px',
                        }}
                    >
                        <button
                            onClick={prevMonth}
                            style={{
                                width: '32px',
                                height: '32px',
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer',
                                borderRadius: '8px',
                            }}
                        >
                            <span
                                className="material-symbols-outlined"
                                style={{ fontSize: '20px', color: '#424654' }}
                            >
                                chevron_left
                            </span>
                        </button>
                        <div style={{ textAlign: 'center' }}>
                            <p
                                style={{
                                    fontSize: '15px',
                                    fontWeight: 600,
                                    color: '#181c24',
                                    margin: 0,
                                }}
                            >
                                {currentYear}년 {currentMonth + 1}월
                            </p>
                            {!loading && (
                                <p
                                    style={{
                                        fontSize: '12px',
                                        margin: '2px 0 0',
                                        color: monthlyCompleted > 0 ? '#1a7a50' : '#737785',
                                    }}
                                >
                                    {monthlyCompleted > 0
                                        ? `${monthlyCompleted}일 완료 🎉`
                                        : '이번 달 기록 없음'}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={nextMonth}
                            style={{
                                width: '32px',
                                height: '32px',
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer',
                                borderRadius: '8px',
                            }}
                        >
                            <span
                                className="material-symbols-outlined"
                                style={{ fontSize: '20px', color: '#424654' }}
                            >
                                chevron_right
                            </span>
                        </button>
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(7, 1fr)',
                            marginBottom: '4px',
                        }}
                    >
                        {DAY_LABELS.map((d, i) => (
                            <div
                                key={d}
                                style={{
                                    textAlign: 'center',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    padding: '4px 0',
                                    color: i === 0 ? '#ba1a1a' : i === 6 ? '#0057CD' : '#737785',
                                }}
                            >
                                {d}
                            </div>
                        ))}
                    </div>

                    {loading ? (
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(7, 1fr)',
                                gap: '4px',
                            }}
                        >
                            {Array.from({ length: 35 }).map((_, i) => (
                                <div
                                    key={i}
                                    style={{
                                        aspectRatio: '1',
                                        borderRadius: '8px',
                                        background: '#ebedf9',
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(7, 1fr)',
                                gap: '4px',
                            }}
                        >
                            {days.map((date, i) => {
                                if (!date)
                                    return <div key={`empty-${i}`} style={{ aspectRatio: '1' }} />
                                const dayEntries = getEntries(date)
                                const done = dayEntries.length > 0
                                const isCompleted = dayEntries.some((e) => e.completed)
                                const isSelected = selectedEntry?.date === toDateStr(date)
                                const isToday = new Date().toDateString() === date.toDateString()
                                const isSun = date.getDay() === 0
                                const isSat = date.getDay() === 6
                                return (
                                    <div
                                        key={date.toISOString()}
                                        onClick={() => {
                                            if (done) handleDayClick(dayEntries)
                                        }}
                                        style={{
                                            aspectRatio: '1',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: isSelected
                                                ? '#0057CD'
                                                : isCompleted
                                                  ? '#dcfce7'
                                                  : done
                                                    ? '#dbeafe'
                                                    : 'transparent',
                                            outline:
                                                isToday && !done && !isSelected
                                                    ? '2px solid #0057CD'
                                                    : 'none',
                                            outlineOffset: '1px',
                                            cursor: done ? 'pointer' : 'default',
                                            transition: 'background 0.15s',
                                        }}
                                        onMouseEnter={(e) => {
                                            if (done && !isSelected)
                                                (
                                                    e.currentTarget as HTMLDivElement
                                                ).style.background = '#bbf7d0'
                                        }}
                                        onMouseLeave={(e) => {
                                            if (done && !isSelected)
                                                (
                                                    e.currentTarget as HTMLDivElement
                                                ).style.background = '#dcfce7'
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: '13px',
                                                fontWeight: 600,
                                                lineHeight: '1',
                                                color: isSelected
                                                    ? 'white'
                                                    : isCompleted
                                                      ? '#166534'
                                                      : isSun
                                                        ? '#ba1a1a'
                                                        : isSat
                                                          ? '#0057CD'
                                                          : '#181c24',
                                            }}
                                        >
                                            {date.getDate()}
                                        </span>
                                        {isCompleted && !isSelected && (
                                            <span
                                                className="material-symbols-outlined"
                                                style={{
                                                    fontSize: '10px',
                                                    color: '#16a34a',
                                                    lineHeight: '1',
                                                    marginTop: '2px',
                                                    fontVariationSettings: '"FILL" 1',
                                                }}
                                            >
                                                check_circle
                                            </span>
                                        )}
                                        {isSelected && (
                                            <span
                                                className="material-symbols-outlined"
                                                style={{
                                                    fontSize: '10px',
                                                    color: 'white',
                                                    lineHeight: '1',
                                                    marginTop: '2px',
                                                    fontVariationSettings: '"FILL" 1',
                                                }}
                                            >
                                                check_circle
                                            </span>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    <div
                        style={{
                            display: 'flex',
                            gap: '12px',
                            marginTop: '16px',
                            paddingTop: '16px',
                            borderTop: '1px solid #ebedf9',
                            fontSize: '11px',
                            color: '#737785',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <div
                                style={{
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    background: '#dbeafe',
                                }}
                            />
                            <span>기록 있음</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <div
                                style={{
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    background: '#bbf7d0',
                                }}
                            />
                            <span>운동 완료</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <div
                                style={{
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    background: '#0057CD',
                                }}
                            />
                            <span>선택됨</span>
                        </div>
                    </div>
                </div>

                {/* 상세 패널 */}
                {selectedEntry && (
                    <div
                        style={{
                            flex: 1,
                            minWidth: '260px',
                            background: 'white',
                            borderRadius: '12px',
                            border: '1px solid #c2c6d6',
                            overflow: 'hidden',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                        }}
                    >
                        <div
                            style={{
                                background: selectedLogs.some((l) => l.completed)
                                    ? '#f0fdf4'
                                    : '#eff6ff',
                                borderBottom: `1px solid ${selectedLogs.some((l) => l.completed) ? '#dcfce7' : '#dbeafe'}`,
                                padding: '14px 18px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                            }}
                        >
                            <div
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    background: '#dcfce7',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}
                            >
                                <span
                                    className="material-symbols-outlined"
                                    style={{
                                        fontSize: '18px',
                                        color: selectedLogs.some((l) => l.completed)
                                            ? '#16a34a'
                                            : '#0057CD',
                                        fontVariationSettings: '"FILL" 1',
                                    }}
                                >
                                    {selectedLogs.some((l) => l.completed)
                                        ? 'check_circle'
                                        : 'fitness_center'}
                                </span>
                            </div>
                            <div>
                                <p
                                    style={{
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        color: '#181c24',
                                        margin: 0,
                                    }}
                                >
                                    {formatDisplayDate(selectedEntry.date)}
                                </p>
                                <p
                                    style={{
                                        fontSize: '12px',
                                        color: selectedLogs.some((l) => l.completed)
                                            ? '#1a7a50'
                                            : '#737785',
                                        margin: '2px 0 0',
                                    }}
                                >
                                    {selectedLogs.some((l) => l.completed)
                                        ? '운동 완료 ✓'
                                        : '기록 확인 및 완료 처리'}
                                </p>
                            </div>
                        </div>

                        <div style={{ padding: '16px 18px' }}>
                            {logLoading ? (
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '10px',
                                    }}
                                >
                                    {[80, 100, 60].map((w, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                height: '14px',
                                                borderRadius: '6px',
                                                background: '#ebedf9',
                                                width: `${w}%`,
                                            }}
                                        />
                                    ))}
                                </div>
                            ) : selectedLogs.length > 0 ? (
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '24px',
                                    }}
                                >
                                    {selectedLogs.map((log, logIdx) => (
                                        <div key={logIdx}>
                                            {selectedLogs.length > 1 && (
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        marginBottom: '12px',
                                                        paddingBottom: '8px',
                                                        borderBottom: '1px solid #ebedf9',
                                                    }}
                                                >
                                                    <span
                                                        className="material-symbols-outlined"
                                                        style={{
                                                            fontSize: '14px',
                                                            color: '#0057CD',
                                                        }}
                                                    >
                                                        person
                                                    </span>
                                                    <span
                                                        style={{
                                                            fontSize: '13px',
                                                            fontWeight: 600,
                                                            color: '#0057CD',
                                                        }}
                                                    >
                                                        {log.trainerNickname} 트레이너
                                                    </span>
                                                </div>
                                            )}
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '14px',
                                                }}
                                            >
                                                {log.routine && (
                                                    <div>
                                                        <p
                                                            style={{
                                                                fontSize: '12px',
                                                                fontWeight: 600,
                                                                color: '#0057CD',
                                                                margin: '0 0 6px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '4px',
                                                            }}
                                                        >
                                                            <span
                                                                className="material-symbols-outlined"
                                                                style={{ fontSize: '14px' }}
                                                            >
                                                                fitness_center
                                                            </span>
                                                            운동 루틴
                                                        </p>
                                                        <p
                                                            style={{
                                                                fontSize: '13px',
                                                                color: '#181c24',
                                                                lineHeight: '1.6',
                                                                whiteSpace: 'pre-wrap',
                                                                background: '#eff6ff',
                                                                borderRadius: '8px',
                                                                padding: '10px 12px',
                                                                margin: 0,
                                                                border: '1px solid #dbeafe',
                                                            }}
                                                        >
                                                            {log.routine}
                                                        </p>
                                                    </div>
                                                )}
                                                {log.diet && (
                                                    <div>
                                                        <p
                                                            style={{
                                                                fontSize: '12px',
                                                                fontWeight: 600,
                                                                color: '#166534',
                                                                margin: '0 0 6px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '4px',
                                                            }}
                                                        >
                                                            <span
                                                                className="material-symbols-outlined"
                                                                style={{ fontSize: '14px' }}
                                                            >
                                                                restaurant
                                                            </span>
                                                            추천 식단
                                                        </p>
                                                        <p
                                                            style={{
                                                                fontSize: '13px',
                                                                color: '#181c24',
                                                                lineHeight: '1.6',
                                                                whiteSpace: 'pre-wrap',
                                                                background: '#f0fdf4',
                                                                borderRadius: '8px',
                                                                padding: '10px 12px',
                                                                margin: 0,
                                                                border: '1px solid #dcfce7',
                                                            }}
                                                        >
                                                            {log.diet}
                                                        </p>
                                                    </div>
                                                )}
                                                {log.memo && (
                                                    <div>
                                                        <p
                                                            style={{
                                                                fontSize: '12px',
                                                                fontWeight: 600,
                                                                color: '#737785',
                                                                margin: '0 0 6px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '4px',
                                                            }}
                                                        >
                                                            <span
                                                                className="material-symbols-outlined"
                                                                style={{ fontSize: '14px' }}
                                                            >
                                                                notes
                                                            </span>
                                                            메모
                                                        </p>
                                                        <p
                                                            style={{
                                                                fontSize: '13px',
                                                                color: '#181c24',
                                                                lineHeight: '1.6',
                                                                whiteSpace: 'pre-wrap',
                                                                background: '#f4f6fa',
                                                                borderRadius: '8px',
                                                                padding: '10px 12px',
                                                                margin: 0,
                                                                border: '1px solid #dfe2ed',
                                                            }}
                                                        >
                                                            {log.memo}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* 인증 사진 + 업로드 */}
                                                <div
                                                    style={{
                                                        borderTop: '1px solid #ebedf9',
                                                        paddingTop: '14px',
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            marginBottom: '10px',
                                                        }}
                                                    >
                                                        <p
                                                            style={{
                                                                fontSize: '12px',
                                                                fontWeight: 600,
                                                                color: '#737785',
                                                                margin: 0,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '4px',
                                                            }}
                                                        >
                                                            <span
                                                                className="material-symbols-outlined"
                                                                style={{ fontSize: '14px' }}
                                                            >
                                                                photo_camera
                                                            </span>
                                                            인증 사진{' '}
                                                            {log.memberPhotos.length > 0
                                                                ? `(${log.memberPhotos.length}장)`
                                                                : ''}
                                                        </p>
                                                        {!log.completed && (
                                                            <button
                                                                onClick={() => {
                                                                    activeLogIdRef.current = log.id
                                                                    fileInputRef.current?.click()
                                                                }}
                                                                disabled={uploadingPhoto === log.id}
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '4px',
                                                                    fontSize: '12px',
                                                                    fontWeight: 600,
                                                                    color: '#0057CD',
                                                                    background: '#eff6ff',
                                                                    border: 'none',
                                                                    borderRadius: '8px',
                                                                    padding: '4px 10px',
                                                                    cursor: 'pointer',
                                                                }}
                                                            >
                                                                <span
                                                                    className="material-symbols-outlined"
                                                                    style={{ fontSize: '14px' }}
                                                                >
                                                                    {uploadingPhoto === log.id
                                                                        ? 'progress_activity'
                                                                        : 'add_photo_alternate'}
                                                                </span>
                                                                {uploadingPhoto === log.id
                                                                    ? '업로드 중...'
                                                                    : '사진 추가'}
                                                            </button>
                                                        )}
                                                    </div>
                                                    {log.memberPhotos.length > 0 ? (
                                                        <div
                                                            style={{
                                                                display: 'grid',
                                                                gridTemplateColumns:
                                                                    'repeat(3, 1fr)',
                                                                gap: '6px',
                                                            }}
                                                        >
                                                            {log.memberPhotos.map((photo, idx) => (
                                                                <div
                                                                    key={photo.id}
                                                                    style={{
                                                                        aspectRatio: '1',
                                                                        borderRadius: '8px',
                                                                        overflow: 'hidden',
                                                                        border: '1px solid #dfe2ed',
                                                                        position: 'relative',
                                                                    }}
                                                                >
                                                                    <img
                                                                        src={getImageUrl(
                                                                            photo.photoUrl
                                                                        )}
                                                                        alt={`인증 ${idx + 1}`}
                                                                        style={{
                                                                            width: '100%',
                                                                            height: '100%',
                                                                            objectFit: 'cover',
                                                                        }}
                                                                    />
                                                                    {!log.completed && (
                                                                        <button
                                                                            onClick={() =>
                                                                                handlePhotoDelete(
                                                                                    log,
                                                                                    photo.id
                                                                                )
                                                                            }
                                                                            style={{
                                                                                position:
                                                                                    'absolute',
                                                                                top: '4px',
                                                                                right: '4px',
                                                                                width: '20px',
                                                                                height: '20px',
                                                                                background:
                                                                                    'rgba(0,0,0,0.5)',
                                                                                border: 'none',
                                                                                borderRadius: '50%',
                                                                                cursor: 'pointer',
                                                                                display: 'flex',
                                                                                alignItems:
                                                                                    'center',
                                                                                justifyContent:
                                                                                    'center',
                                                                            }}
                                                                        >
                                                                            <span
                                                                                className="material-symbols-outlined"
                                                                                style={{
                                                                                    fontSize:
                                                                                        '12px',
                                                                                    color: 'white',
                                                                                }}
                                                                            >
                                                                                close
                                                                            </span>
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            ))}
                                                            {!log.completed && (
                                                                <button
                                                                    onClick={() => {
                                                                        activeLogIdRef.current =
                                                                            log.id
                                                                        fileInputRef.current?.click()
                                                                    }}
                                                                    style={{
                                                                        aspectRatio: '1',
                                                                        borderRadius: '8px',
                                                                        border: '2px dashed #c2c6d6',
                                                                        background: 'none',
                                                                        cursor: 'pointer',
                                                                        display: 'flex',
                                                                        flexDirection: 'column',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                    }}
                                                                >
                                                                    <span
                                                                        className="material-symbols-outlined"
                                                                        style={{
                                                                            fontSize: '20px',
                                                                            color: '#737785',
                                                                        }}
                                                                    >
                                                                        add
                                                                    </span>
                                                                </button>
                                                            )}
                                                        </div>
                                                    ) : !log.completed ? (
                                                        <button
                                                            onClick={() => {
                                                                activeLogIdRef.current = log.id
                                                                fileInputRef.current?.click()
                                                            }}
                                                            style={{
                                                                width: '100%',
                                                                height: '80px',
                                                                border: '2px dashed #c2c6d6',
                                                                borderRadius: '10px',
                                                                background: 'none',
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                gap: '4px',
                                                            }}
                                                        >
                                                            <span
                                                                className="material-symbols-outlined"
                                                                style={{
                                                                    fontSize: '24px',
                                                                    color: '#737785',
                                                                }}
                                                            >
                                                                add_photo_alternate
                                                            </span>
                                                            <span
                                                                style={{
                                                                    fontSize: '12px',
                                                                    color: '#737785',
                                                                }}
                                                            >
                                                                운동 완료 사진을 올려주세요
                                                            </span>
                                                        </button>
                                                    ) : (
                                                        <p
                                                            style={{
                                                                fontSize: '12px',
                                                                color: '#737785',
                                                            }}
                                                        >
                                                            사진 없음
                                                        </p>
                                                    )}
                                                </div>

                                                {/* 트레이너 코멘트 */}
                                                {log.trainerComment && (
                                                    <div
                                                        style={{
                                                            borderTop: '1px solid #ebedf9',
                                                            paddingTop: '14px',
                                                        }}
                                                    >
                                                        <p
                                                            style={{
                                                                fontSize: '12px',
                                                                fontWeight: 600,
                                                                color: '#0057CD',
                                                                margin: '0 0 6px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '4px',
                                                            }}
                                                        >
                                                            <span
                                                                className="material-symbols-outlined"
                                                                style={{ fontSize: '14px' }}
                                                            >
                                                                rate_review
                                                            </span>
                                                            트레이너 코멘트
                                                        </p>
                                                        <p
                                                            style={{
                                                                fontSize: '13px',
                                                                color: '#181c24',
                                                                lineHeight: '1.6',
                                                                background: '#eff6ff',
                                                                borderRadius: '8px',
                                                                padding: '10px 12px',
                                                                margin: 0,
                                                                border: '1px solid #dbeafe',
                                                            }}
                                                        >
                                                            {log.trainerComment}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* 운동 완료 버튼 */}
                                                {!log.completed && (
                                                    <div
                                                        style={{
                                                            borderTop: '1px solid #ebedf9',
                                                            paddingTop: '14px',
                                                        }}
                                                    >
                                                        <button
                                                            onClick={() => handleComplete(log)}
                                                            disabled={completing === log.id}
                                                            style={{
                                                                width: '100%',
                                                                height: '44px',
                                                                background:
                                                                    completing === log.id
                                                                        ? '#86efac'
                                                                        : '#16a34a',
                                                                color: 'white',
                                                                border: 'none',
                                                                borderRadius: '10px',
                                                                fontSize: '14px',
                                                                fontWeight: 600,
                                                                cursor:
                                                                    completing === log.id
                                                                        ? 'not-allowed'
                                                                        : 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                gap: '6px',
                                                            }}
                                                        >
                                                            <span
                                                                className="material-symbols-outlined"
                                                                style={{
                                                                    fontSize: '18px',
                                                                    fontVariationSettings:
                                                                        '"FILL" 1',
                                                                }}
                                                            >
                                                                check_circle
                                                            </span>
                                                            {completing === log.id
                                                                ? '처리 중...'
                                                                : '운동 완료'}
                                                        </button>
                                                        <p
                                                            style={{
                                                                fontSize: '11px',
                                                                color: '#737785',
                                                                textAlign: 'center',
                                                                marginTop: '6px',
                                                            }}
                                                        >
                                                            완료 처리 후에는 사진 추가가 불가합니다.
                                                        </p>
                                                    </div>
                                                )}
                                                {log.completed && (
                                                    <div
                                                        style={{
                                                            borderTop: '1px solid #ebedf9',
                                                            paddingTop: '14px',
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                gap: '6px',
                                                                height: '44px',
                                                                background: '#f0fdf4',
                                                                borderRadius: '10px',
                                                                border: '1px solid #bbf7d0',
                                                            }}
                                                        >
                                                            <span
                                                                className="material-symbols-outlined"
                                                                style={{
                                                                    fontSize: '18px',
                                                                    color: '#16a34a',
                                                                    fontVariationSettings:
                                                                        '"FILL" 1',
                                                                }}
                                                            >
                                                                check_circle
                                                            </span>
                                                            <span
                                                                style={{
                                                                    fontSize: '14px',
                                                                    fontWeight: 600,
                                                                    color: '#166534',
                                                                }}
                                                            >
                                                                운동 완료
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p
                                    style={{
                                        fontSize: '13px',
                                        color: '#737785',
                                        textAlign: 'center',
                                        padding: '20px 0',
                                    }}
                                >
                                    기록을 불러올 수 없습니다.
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {!selectedEntry && !loading && entries.length > 0 && (
                    <div
                        style={{
                            flex: 1,
                            minWidth: '200px',
                            minHeight: '200px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '12px',
                            border: '2px dashed #c2c6d6',
                            color: '#737785',
                        }}
                    >
                        <span
                            className="material-symbols-outlined"
                            style={{ fontSize: '36px', marginBottom: '8px' }}
                        >
                            touch_app
                        </span>
                        <p style={{ fontSize: '13px', margin: 0 }}>
                            완료된 날짜를 클릭해 기록을 확인하세요
                        </p>
                    </div>
                )}
            </div>

            {/* 숨겨진 파일 input - 어떤 log의 업로드인지 ref로 추적 */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                style={{ display: 'none' }}
                onChange={(e) => {
                    const log = selectedLogs.find((l) => l.id === activeLogIdRef.current)
                    if (log) handlePhotoUpload(e, log)
                }}
            />
        </section>
    )
}

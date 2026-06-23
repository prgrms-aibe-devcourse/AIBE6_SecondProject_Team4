'use client'

import { useAuth } from '@/context/AuthContext';
import { API_BASE_URL, getImageUrl } from '@/utils/apiClient';
import { useEffect, useState } from 'react';



import { useParams, useRouter } from 'next/navigation';







































































interface WorkoutLog {
    id: number
    matchingId: number
    date: string
    routine: string | null
    diet: string | null
    memo: string | null
    memberPhotos: string[]
    completed: boolean
    trainerNickname: string
    trainerComment: string | null
    createdAt: string
    updatedAt: string
}

export default function WorkoutTrainerPage() {
    const { matchingId } = useParams<{ matchingId: string }>()
    const { user } = useAuth()
    const router = useRouter()

    const [logs, setLogs] = useState<WorkoutLog[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedLog, setSelectedLog] = useState<WorkoutLog | null>(null)
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())

    const [showForm, setShowForm] = useState(false)
    const [editingLog, setEditingLog] = useState<WorkoutLog | null>(null)
    const [form, setForm] = useState({ date: '', routine: '', diet: '', memo: '' })
    const [saving, setSaving] = useState(false)

    const [comment, setComment] = useState('')
    const [savingComment, setSavingComment] = useState(false)

    const isTrainer = user?.role === 'TRAINER'

    const getToken = () => {
        const stored = localStorage.getItem('fitmate_user')
        return stored ? JSON.parse(stored).token : null
    }

    const fetchLogs = async () => {
        setLoading(true)
        const token = getToken()
        const res = await fetch(`${API_BASE_URL}/api/matching/${matchingId}/workout-logs`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
            const data: WorkoutLog[] = await res.json()
            setLogs(data)
            if (selectedLog) {
                const updated = data.find((l) => l.id === selectedLog.id)
                if (updated) setSelectedLog(updated)
            }
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchLogs()
    }, [matchingId])

    // 트레이너가 아니면 접근 차단
    useEffect(() => {
        if (user && !isTrainer) router.replace('/mypage?tab=matching')
    }, [user, isTrainer])

    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay()
    const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate()
    const days: Array<Date | null> = [
        ...Array.from({ length: firstDayIndex }, () => null),
        ...Array.from({ length: lastDate }, (_, i) => new Date(currentYear, currentMonth, i + 1)),
    ]

    const toDateStr = (date: Date) =>
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

    const getLogByDate = (date: Date) => logs.find((l) => l.date === toDateStr(date)) ?? null

    const handleDayClick = (date: Date) => {
        const log = getLogByDate(date)
        if (log) {
            setSelectedLog(log)
            setComment(log.trainerComment ?? '')
        } else {
            setEditingLog(null)
            setForm({ date: toDateStr(date), routine: '', diet: '', memo: '' })
            setShowForm(true)
        }
    }

    const handleOpenEdit = (log: WorkoutLog) => {
        setEditingLog(log)
        setForm({
            date: log.date,
            routine: log.routine ?? '',
            diet: log.diet ?? '',
            memo: log.memo ?? '',
        })
        setShowForm(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        const token = getToken()
        const url = editingLog
            ? `${API_BASE_URL}/api/matching/${matchingId}/workout-logs/${editingLog.id}`
            : `${API_BASE_URL}/api/matching/${matchingId}/workout-logs`
        const method = editingLog ? 'PATCH' : 'POST'
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(form),
        })
        setSaving(false)
        if (res.ok) {
            const saved: WorkoutLog = await res.json()
            setShowForm(false)
            await fetchLogs()
            setSelectedLog(saved)
        }
    }

    const handleDelete = async (logId: number) => {
        if (!confirm('이 운동 기록을 삭제하시겠습니까?')) return
        const token = getToken()
        const res = await fetch(
            `${API_BASE_URL}/api/matching/${matchingId}/workout-logs/${logId}`,
            {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            }
        )
        if (res.ok) {
            setSelectedLog(null)
            fetchLogs()
        }
    }

    const handleSaveComment = async (logId: number) => {
        setSavingComment(true)
        const token = getToken()
        const res = await fetch(
            `${API_BASE_URL}/api/matching/${matchingId}/workout-logs/${logId}/comment`,
            {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ comment }),
            }
        )
        setSavingComment(false)
        if (res.ok) {
            setComment('')
            fetchLogs()
        }
    }

    const formatDisplayDate = (dateStr: string) => {
        const d = new Date(`${dateStr}T00:00:00`)
        return d.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'short',
        })
    }

    const prevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11)
            setCurrentYear((y) => y - 1)
        } else setCurrentMonth((m) => m - 1)
        setSelectedLog(null)
    }
    const nextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0)
            setCurrentYear((y) => y + 1)
        } else setCurrentMonth((m) => m + 1)
        setSelectedLog(null)
    }

    return (
        <main className="mx-auto flex w-full max-w-[1100px] flex-col gap-md px-margin-mobile pb-lg pt-20 md:px-margin-desktop">
            {/* 헤더 */}
            <div className="flex items-center gap-sm">
                <button
                    onClick={() => router.back()}
                    className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
                >
                    <span className="material-symbols-outlined text-on-surface-variant">
                        arrow_back
                    </span>
                </button>
                <div className="flex-1">
                    <h1 className="font-headline-md text-headline-md text-on-surface">운동 관리</h1>
                    <p className="text-body-sm text-on-surface-variant mt-xs">
                        날짜를 클릭해 운동 루틴과 식단을 기록하세요.
                    </p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-md items-start">
                {/* 캘린더 */}
                <div
                    className="w-full lg:w-[420px] flex-shrink-0 bg-surface-container-lowest rounded-xl border border-outline-variant p-md"
                    style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}
                >
                    <div className="flex items-center justify-between mb-md">
                        <button
                            onClick={prevMonth}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-on-surface-variant">
                                chevron_left
                            </span>
                        </button>
                        <span className="font-headline-sm text-on-surface">
                            {currentYear}년 {currentMonth + 1}월
                        </span>
                        <button
                            onClick={nextMonth}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-on-surface-variant">
                                chevron_right
                            </span>
                        </button>
                    </div>

                    <div className="grid grid-cols-7 mb-xs">
                        {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
                            <div
                                key={d}
                                className={`text-center text-body-sm font-semibold py-xs ${i === 0 ? 'text-error' : i === 6 ? 'text-primary' : 'text-on-surface-variant'}`}
                            >
                                {d}
                            </div>
                        ))}
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-7 gap-1">
                            {Array.from({ length: 35 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="aspect-square rounded-lg bg-surface-container animate-pulse"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-7 gap-1">
                            {days.map((date, i) => {
                                if (!date) return <div key={`empty-${i}`} />
                                const log = getLogByDate(date)
                                const isSelected = selectedLog?.date === toDateStr(date)
                                const isToday = new Date().toDateString() === date.toDateString()
                                const isSun = date.getDay() === 0
                                const isSat = date.getDay() === 6
                                return (
                                    <button
                                        key={date.toISOString()}
                                        onClick={() => handleDayClick(date)}
                                        className={`relative aspect-square rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer
                                            ${
                                                isSelected
                                                    ? 'bg-primary text-on-primary'
                                                    : log?.completed
                                                      ? 'bg-green-100 hover:bg-green-200'
                                                      : log
                                                        ? 'bg-primary/10 hover:bg-primary/20'
                                                        : 'hover:bg-surface-container'
                                            }
                                            ${isToday && !isSelected ? 'ring-2 ring-primary ring-offset-1' : ''}
                                        `}
                                    >
                                        <span
                                            className={`text-sm font-semibold leading-none
                                            ${
                                                isSelected
                                                    ? 'text-on-primary'
                                                    : log?.completed
                                                      ? 'text-green-700'
                                                      : isSun
                                                        ? 'text-error'
                                                        : isSat
                                                          ? 'text-primary'
                                                          : 'text-on-surface'
                                            }
                                        `}
                                        >
                                            {date.getDate()}
                                        </span>
                                        {log?.completed && (
                                            <span
                                                className="material-symbols-outlined text-green-600 text-[10px] mt-0.5"
                                                style={{ fontVariationSettings: '"FILL" 1' }}
                                            >
                                                check_circle
                                            </span>
                                        )}
                                        {log && !log.completed && (
                                            <div
                                                className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isSelected ? 'bg-on-primary' : 'bg-primary'}`}
                                            />
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    )}

                    <div className="flex flex-wrap items-center gap-sm mt-md pt-md border-t border-outline-variant/30 text-body-sm text-on-surface-variant">
                        <div className="flex items-center gap-xs">
                            <div className="w-3 h-3 rounded-full bg-primary/20" />
                            <span>기록 있음</span>
                        </div>
                        <div className="flex items-center gap-xs">
                            <div className="w-3 h-3 rounded-full bg-green-300" />
                            <span>회원 완료</span>
                        </div>
                        <span className="ml-auto text-xs">빈 날짜 클릭 시 기록 추가</span>
                    </div>
                </div>

                {/* 상세 패널 */}
                <div className="flex-1 w-full">
                    {selectedLog ? (
                        <div
                            className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden"
                            style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}
                        >
                            <div
                                className="flex items-center justify-between px-md py-sm border-b border-outline-variant/30"
                                style={{
                                    background: selectedLog.completed
                                        ? '#f0fdf4'
                                        : 'rgba(0,87,205,0.04)',
                                }}
                            >
                                <div className="flex items-center gap-sm">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedLog.completed ? 'bg-green-100' : 'bg-primary/10'}`}
                                    >
                                        <span
                                            className={`material-symbols-outlined text-[20px] ${selectedLog.completed ? 'text-green-600' : 'text-primary'}`}
                                            style={
                                                selectedLog.completed
                                                    ? { fontVariationSettings: '"FILL" 1' }
                                                    : undefined
                                            }
                                        >
                                            {selectedLog.completed
                                                ? 'check_circle'
                                                : 'fitness_center'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-label-bold text-on-surface">
                                            {formatDisplayDate(selectedLog.date)}
                                        </p>
                                        <p className="text-body-sm text-on-surface-variant">
                                            {selectedLog.completed
                                                ? '회원이 운동 완료했습니다 ✓'
                                                : '기록 작성됨'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-xs">
                                    <button
                                        onClick={() => handleOpenEdit(selectedLog)}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-body-sm text-on-surface-variant border border-outline-variant hover:bg-surface-container hover:text-primary transition-all cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-base">
                                            edit
                                        </span>
                                        수정
                                    </button>
                                    <button
                                        onClick={() => handleDelete(selectedLog.id)}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-body-sm text-on-surface-variant border border-outline-variant hover:bg-error-container/30 hover:text-error transition-all cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-base">
                                            delete
                                        </span>
                                        삭제
                                    </button>
                                </div>
                            </div>

                            <div className="p-md space-y-md">
                                {selectedLog.routine && (
                                    <div>
                                        <p className="flex items-center gap-xs font-label-bold text-primary mb-xs">
                                            <span className="material-symbols-outlined text-base">
                                                fitness_center
                                            </span>
                                            운동 루틴
                                        </p>
                                        <p className="text-body-md text-on-surface leading-relaxed whitespace-pre-wrap bg-primary/5 rounded-lg p-md border border-primary/10">
                                            {selectedLog.routine}
                                        </p>
                                    </div>
                                )}
                                {selectedLog.diet && (
                                    <div>
                                        <p className="flex items-center gap-xs font-label-bold text-green-700 mb-xs">
                                            <span className="material-symbols-outlined text-base">
                                                restaurant
                                            </span>
                                            추천 식단
                                        </p>
                                        <p className="text-body-md text-on-surface leading-relaxed whitespace-pre-wrap bg-green-50 rounded-lg p-md border border-green-100">
                                            {selectedLog.diet}
                                        </p>
                                    </div>
                                )}
                                {selectedLog.memo && (
                                    <div>
                                        <p className="flex items-center gap-xs font-label-bold text-on-surface-variant mb-xs">
                                            <span className="material-symbols-outlined text-base">
                                                notes
                                            </span>
                                            메모
                                        </p>
                                        <p className="text-body-md text-on-surface leading-relaxed whitespace-pre-wrap bg-surface-container rounded-lg p-md border border-outline-variant/30">
                                            {selectedLog.memo}
                                        </p>
                                    </div>
                                )}
                                {/* 회원 인증 사진 - 조회만 */}
                                <div className="border-t border-outline-variant/30 pt-md">
                                    <p className="flex items-center gap-xs font-label-bold text-on-surface-variant mb-sm">
                                        <span className="material-symbols-outlined text-base">
                                            photo_camera
                                        </span>
                                        회원 인증 사진
                                        {selectedLog.memberPhotos.length > 0 && (
                                            <span className="ml-1 text-xs">
                                                ({selectedLog.memberPhotos.length}장)
                                            </span>
                                        )}
                                    </p>
                                    {selectedLog.memberPhotos.length > 0 ? (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-sm">
                                            {selectedLog.memberPhotos.map((url, idx) => (
                                                <div
                                                    key={idx}
                                                    className="aspect-square rounded-xl overflow-hidden border border-outline-variant"
                                                >
                                                    <img
                                                        src={getImageUrl(url)}
                                                        alt={`인증 ${idx + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-body-sm text-on-surface-variant">
                                            아직 회원이 사진을 올리지 않았습니다.
                                        </p>
                                    )}
                                </div>
                                {selectedLog.completed && (
                                    <div className="border-t border-outline-variant/30 pt-md">
                                        <p className="flex items-center gap-xs font-label-bold text-on-surface-variant mb-sm">
                                            <span className="material-symbols-outlined text-base">
                                                rate_review
                                            </span>
                                            트레이너 코멘트
                                        </p>
                                        {selectedLog.trainerComment && !comment ? (
                                            <div>
                                                <p className="text-body-md text-on-surface leading-relaxed whitespace-pre-wrap bg-primary/5 rounded-lg p-md border border-primary/10 mb-sm">
                                                    {selectedLog.trainerComment}
                                                </p>
                                                <div className="flex gap-xs">
                                                    <button
                                                        onClick={() =>
                                                            setComment(
                                                                selectedLog.trainerComment ?? ''
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-body-sm text-on-surface-variant border border-outline-variant hover:bg-surface-container hover:text-primary transition-all cursor-pointer"
                                                    >
                                                        <span className="material-symbols-outlined text-base">
                                                            edit
                                                        </span>
                                                        수정
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            const token = getToken()
                                                            await fetch(
                                                                `${API_BASE_URL}/api/matching/${matchingId}/workout-logs/${selectedLog.id}/comment`,
                                                                {
                                                                    method: 'PATCH',
                                                                    headers: {
                                                                        'Content-Type':
                                                                            'application/json',
                                                                        Authorization: `Bearer ${token}`,
                                                                    },
                                                                    body: JSON.stringify({
                                                                        comment: '',
                                                                    }),
                                                                }
                                                            )
                                                            setComment('')
                                                            fetchLogs()
                                                        }}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-body-sm text-on-surface-variant border border-outline-variant hover:bg-error-container/30 hover:text-error transition-all cursor-pointer"
                                                    >
                                                        <span className="material-symbols-outlined text-base">
                                                            delete
                                                        </span>
                                                        삭제
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex gap-xs">
                                                <input
                                                    type="text"
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                    placeholder="회원에게 한 줄 코멘트를 남겨주세요"
                                                    className="flex-1 border border-outline-variant rounded-lg px-md py-sm text-body-sm focus:outline-none focus:border-primary"
                                                />
                                                <button
                                                    onClick={() =>
                                                        handleSaveComment(selectedLog.id)
                                                    }
                                                    disabled={savingComment || !comment.trim()}
                                                    className="px-md py-sm rounded-lg bg-primary text-on-primary font-label-bold hover:bg-primary/90 transition-all disabled:opacity-50 cursor-pointer"
                                                >
                                                    {savingComment ? '저장 중...' : '저장'}
                                                </button>
                                                {selectedLog.trainerComment && (
                                                    <button
                                                        onClick={() => setComment('')}
                                                        className="px-md py-sm rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-all cursor-pointer"
                                                    >
                                                        취소
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 rounded-xl border border-dashed border-outline-variant text-on-surface-variant">
                            <span className="material-symbols-outlined text-5xl mb-sm">
                                calendar_today
                            </span>
                            <p className="text-body-md">
                                날짜를 클릭해 기록을 추가하거나 확인하세요.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* 작성/수정 모달 */}
            {showForm && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '16px',
                    }}
                    onClick={() => setShowForm(false)}
                >
                    <div
                        style={{
                            background: 'white',
                            borderRadius: '16px',
                            padding: '32px',
                            width: '100%',
                            maxWidth: '520px',
                            maxHeight: '90vh',
                            overflowY: 'auto',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '24px',
                            }}
                        >
                            <h2
                                style={{
                                    fontSize: '18px',
                                    fontWeight: 700,
                                    color: '#0B1C30',
                                    margin: 0,
                                }}
                            >
                                {editingLog ? '운동 기록 수정' : `${form.date} 기록 추가`}
                            </h2>
                            <button
                                onClick={() => setShowForm(false)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                <span
                                    className="material-symbols-outlined"
                                    style={{ color: '#9097a8' }}
                                >
                                    close
                                </span>
                            </button>
                        </div>
                        <form
                            onSubmit={handleSubmit}
                            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                        >
                            {[
                                {
                                    label: '운동 루틴',
                                    key: 'routine',
                                    placeholder: '예) 스쿼트 3세트 10회, 벤치프레스 3세트 8회...',
                                },
                                {
                                    label: '추천 식단',
                                    key: 'diet',
                                    placeholder: '예) 아침: 닭가슴살 200g + 고구마, 점심: ...',
                                },
                                {
                                    label: '메모',
                                    key: 'memo',
                                    placeholder: '오늘 운동 주의사항, 컨디션 메모 등',
                                },
                            ].map(({ label, key, placeholder }) => (
                                <div
                                    key={key}
                                    style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
                                >
                                    <label
                                        style={{
                                            fontSize: '13px',
                                            fontWeight: 500,
                                            color: '#424655',
                                        }}
                                    >
                                        {label}
                                    </label>
                                    <textarea
                                        value={form[key as keyof typeof form]}
                                        onChange={(e) =>
                                            setForm((f) => ({ ...f, [key]: e.target.value }))
                                        }
                                        placeholder={placeholder}
                                        rows={4}
                                        style={{
                                            width: '100%',
                                            border: '1px solid #c2c6d8',
                                            borderRadius: '10px',
                                            padding: '10px 14px',
                                            fontSize: '14px',
                                            outline: 'none',
                                            boxSizing: 'border-box',
                                            resize: 'vertical',
                                        }}
                                        onFocus={(e) => (e.target.style.borderColor = '#0057cd')}
                                        onBlur={(e) => (e.target.style.borderColor = '#c2c6d8')}
                                    />
                                </div>
                            ))}
                            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        background: 'white',
                                        color: '#424654',
                                        border: '1px solid #c2c6d8',
                                        borderRadius: '10px',
                                        fontSize: '15px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                    }}
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        background: saving ? '#93b4e8' : '#0057CD',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '10px',
                                        fontSize: '15px',
                                        fontWeight: 600,
                                        cursor: saving ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    {saving ? '저장 중...' : editingLog ? '수정하기' : '저장하기'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    )
}

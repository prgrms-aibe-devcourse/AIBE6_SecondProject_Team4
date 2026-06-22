'use client'

import MyReviewList from '@/components/MyReviewList';
import MatchingManagementPreview from '@/components/lesson/MatchingManagementPreview';
import { useAuth } from '@/context/AuthContext';
import type { components } from '@/types/api';
import { getAuthClient, getImageUrl } from '@/utils/apiClient';
import { Fragment, Suspense, useEffect, useRef, useState } from 'react';



import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';














type TrainerProfile = components['schemas']['TrainerProfileResponse']
type UserProfile = components['schemas']['UserProfileResponse']
type InquiryResponse = components['schemas']['InquiryResponse']

const TYPE_LABEL: Record<string, string> = {
    MATCHING: '매칭',
    TRAINER: '트레이너',
    ETC: '기타',
}

function InquirySection() {
    const [inquiries, setInquiries] = useState<InquiryResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [totalElements, setTotalElements] = useState(0)
    const [totalResolved, setTotalResolved] = useState(0)
    const [totalPending, setTotalPending] = useState(0)
    const [expandedId, setExpandedId] = useState<number | null>(null)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editForm, setEditForm] = useState<{ type: string; title: string; content: string }>({ type: '', title: '', content: '' })
    const [saving, setSaving] = useState(false)
    const [deletingId, setDeletingId] = useState<number | null>(null)


    const client = getAuthClient()

    const fetchAllCounts = async () => {
        const { data } = await client.GET('/api/inquiries', {
            params: { query: { page: 0, size: 9999 } as any },
        })
        if (data?.content) {
            const all = data.content as InquiryResponse[]
            setTotalResolved(all.filter(i => i.status === 'RESOLVED').length)
            setTotalPending(all.filter(i => i.status === 'PENDING').length)
        }
    }

    const fetchInquiries = async (p = 0) => {
        setLoading(true)
        const { data } = await client.GET('/api/inquiries', {
            params: { query: { page: p, size: 10, sort: 'createdAt,desc' } as any },
        })
        if (data) {
            setInquiries(data.content ?? [])
            setTotalPages(data.totalPages ?? 0)
            setTotalElements(data.totalElements ?? 0)
            setPage(p)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchInquiries(0)
        fetchAllCounts()
    }, [])

    const handleEdit = (item: InquiryResponse) => {
        setEditingId(item.id ?? null)
        setEditForm({ type: item.type ?? 'ETC', title: item.title ?? '', content: item.content ?? '' })
        setExpandedId(null)
    }

    const handleEditSave = async () => {
        if (!editingId) return
        setSaving(true)
        const { response } = await client.PATCH('/api/inquiries/{inquiryId}', {
            params: { path: { inquiryId: editingId } },
            body: { type: editForm.type as any, title: editForm.title, content: editForm.content },
        })
        setSaving(false)
        if (response.ok) {
            setEditingId(null)
            fetchInquiries(page)
            fetchAllCounts()
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('문의를 삭제하시겠습니까?')) return
        setDeletingId(id)
        const { response } = await client.DELETE('/api/inquiries/{inquiryId}', {
            params: { path: { inquiryId: id } },
        })
        setDeletingId(null)
        if (response.ok) {
            fetchInquiries(page)
            fetchAllCounts()
        }
    }

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '-'
        return new Date(dateStr).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '.').replace('.', '')
    }

    return (
        <section className="space-y-md">
            {/* 헤더 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-headline-sm font-headline-sm text-on-surface">문의 내역 관리</h2>
                <Link
                    href="/inquiry"
                    className="inline-flex items-center gap-2 bg-primary text-on-primary px-md py-sm rounded-lg font-label-bold hover:bg-primary-container transition-all active:scale-95 shadow-sm"
                >
                    <span className="material-symbols-outlined text-[18px]">edit_square</span>
                    새 문의 작성
                </Link>
            </div>

            {/* 요약 카드 */}
            <div className="grid grid-cols-3 gap-2 sm:gap-md">
                {[
                    { label: '전체 문의', value: totalElements, icon: 'description', color: 'text-on-surface', bg: 'bg-surface-container' },
                    { label: '답변 완료', value: totalResolved, icon: 'task_alt', color: 'text-primary', bg: 'bg-primary/10' },
                    { label: '답변 대기', value: totalPending, icon: 'pending', color: 'text-on-surface-variant', bg: 'bg-surface-container-high' },
                ].map(({ label, value, icon, color, bg }) => (
                    <div key={label} className="bg-surface-container-lowest p-3 sm:p-md rounded-xl border border-outline-variant flex items-center justify-between" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
                        <div>
                            <p className="text-[11px] sm:text-body-sm text-on-surface-variant mb-1 whitespace-nowrap">{label}</p>
                            {loading ? (
                                <div className="h-6 w-8 sm:h-7 sm:w-10 rounded-md bg-surface-container animate-pulse mt-1" />
                            ) : (
                                <p className={`text-base sm:text-headline-md font-bold ${color}`}>{value}</p>
                            )}
                        </div>
                        <div className={`hidden sm:flex w-11 h-11 rounded-full ${bg} items-center justify-center`}>
                            <span className={`material-symbols-outlined ${color}`}>{icon}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* 테이블 */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
                {loading ? (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[480px] text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-container-low border-b border-outline-variant">
                                    <th className="px-4 py-4"><div className="h-4 w-14 rounded bg-surface-container animate-pulse" /></th>
                                    <th className="hidden sm:table-cell px-4 py-4"><div className="h-4 w-10 rounded bg-surface-container animate-pulse" /></th>
                                    <th className="px-4 py-4"><div className="h-4 w-16 rounded bg-surface-container animate-pulse" /></th>
                                    <th className="hidden md:table-cell px-4 py-4"><div className="h-4 w-14 rounded bg-surface-container animate-pulse ml-auto" /></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/30">
                                {Array.from({ length: 10 }).map((_, i) => (
                                    <tr key={i}>
                                        <td className="px-4 py-4"><div className="h-6 w-16 rounded-full bg-surface-container animate-pulse" /></td>
                                        <td className="hidden sm:table-cell px-4 py-4"><div className="h-4 w-12 rounded bg-surface-container animate-pulse" /></td>
                                        <td className="px-4 py-4"><div className="h-4 rounded bg-surface-container animate-pulse" style={{ width: `${60 + (i * 13) % 30}%` }} /></td>
                                        <td className="hidden md:table-cell px-4 py-4"><div className="h-4 w-20 rounded bg-surface-container animate-pulse ml-auto" /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : inquiries.length === 0 ? (
                    <div className="text-center py-16 text-on-surface-variant">
                        <span className="material-symbols-outlined text-5xl block mb-3">inbox</span>
                        <p className="text-body-md">문의 내역이 없습니다.</p>
                        <Link href="/inquiry" className="mt-4 inline-flex items-center gap-1 text-primary text-body-sm font-semibold hover:underline">
                            첫 문의 작성하기
                            <span className="material-symbols-outlined text-base">arrow_forward</span>
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[480px] text-left border-collapse">
                                <thead>
                                    <tr className="bg-surface-container-low border-b border-outline-variant">
                                        <th className="px-4 py-4 text-label-bold font-label-bold text-on-surface-variant whitespace-nowrap">상태</th>
                                        <th className="hidden sm:table-cell px-4 py-4 text-label-bold font-label-bold text-on-surface-variant whitespace-nowrap">유형</th>
                                        <th className="px-4 py-4 text-label-bold font-label-bold text-on-surface-variant">제목</th>
                                        <th className="hidden md:table-cell px-4 py-4 text-label-bold font-label-bold text-on-surface-variant text-right whitespace-nowrap">작성일</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant/30">
                                    {inquiries.map((item) => (
                                        <Fragment key={item.id}>
                                            {editingId === item.id ? (
                                                <tr className="bg-surface-container-low">
                                                    <td colSpan={5} className="px-6 py-5">
                                                        <div className="space-y-3">
                                                            <div className="flex gap-3">
                                                                <select
                                                                    className="bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-body-sm"
                                                                    value={editForm.type}
                                                                    onChange={e => setEditForm(f => ({ ...f, type: e.target.value }))}
                                                                >
                                                                    <option value="MATCHING">매칭</option>
                                                                    <option value="TRAINER">트레이너</option>
                                                                    <option value="ETC">기타</option>
                                                                </select>
                                                                <input
                                                                    className="flex-1 bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-body-sm"
                                                                    value={editForm.title}
                                                                    onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                                                                    placeholder="제목"
                                                                />
                                                            </div>
                                                            <textarea
                                                                className="w-full bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-body-sm resize-none"
                                                                rows={4}
                                                                value={editForm.content}
                                                                onChange={e => setEditForm(f => ({ ...f, content: e.target.value }))}
                                                                placeholder="문의 내용"
                                                            />
                                                            <div className="flex gap-2 justify-end">
                                                                <button
                                                                    className="px-4 py-2 text-body-sm border border-outline-variant rounded-lg hover:bg-surface-container transition-all"
                                                                    onClick={() => setEditingId(null)}
                                                                >
                                                                    취소
                                                                </button>
                                                                <button
                                                                    className="px-4 py-2 text-body-sm bg-primary text-on-primary rounded-lg hover:bg-primary-container transition-all disabled:opacity-50"
                                                                    onClick={handleEditSave}
                                                                    disabled={saving}
                                                                >
                                                                    {saving ? '저장 중...' : '저장'}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                <tr
                                                    className="hover:bg-surface-container transition-all cursor-pointer group"
                                                    onClick={() => setExpandedId(expandedId === item.id ? null : (item.id ?? null))}
                                                >
                                                    <td className="px-4 py-4 whitespace-nowrap">
                                                        {item.status === 'RESOLVED' ? (
                                                            <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold whitespace-nowrap">답변 완료</span>
                                                        ) : (
                                                            <span className="px-2 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-semibold whitespace-nowrap">답변 대기</span>
                                                        )}
                                                    </td>
                                                    <td className="hidden sm:table-cell px-4 py-4 text-body-sm text-on-surface-variant whitespace-nowrap">
                                                        {TYPE_LABEL[item.type ?? ''] ?? item.type}
                                                    </td>
                                                    <td className="px-4 py-4 max-w-0 w-full">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-body-sm text-on-surface group-hover:text-primary transition-colors truncate">{item.title}</span>
                                                            <span className={`material-symbols-outlined text-base text-outline flex-shrink-0 transition-transform ${expandedId === item.id ? 'rotate-180' : ''}`}>expand_more</span>
                                                        </div>
                                                    </td>
                                                    <td className="hidden md:table-cell px-4 py-4 text-right text-body-sm text-on-surface-variant whitespace-nowrap">
                                                        {formatDate(item.createdAt)}
                                                    </td>
                                                </tr>
                                            )}
                                            {editingId !== item.id && (
                                                <tr className="bg-surface-container-low">
                                                    <td colSpan={5} className="p-0">
                                                        <div
                                                            style={{
                                                                display: 'grid',
                                                                gridTemplateRows: expandedId === item.id ? '1fr' : '0fr',
                                                                transition: 'grid-template-rows 0.25s ease',
                                                            }}
                                                        >
                                                            <div className="overflow-hidden">
                                                                <div className="px-6 py-5 space-y-4">
                                                                    {/* 문의 내용 */}
                                                                    <div>
                                                                        <p className="text-label-bold text-on-surface-variant mb-2">문의 내용</p>
                                                                        <p className="text-body-md text-on-surface leading-relaxed whitespace-pre-wrap bg-white rounded-lg p-4 border border-outline-variant/30">{item.content}</p>
                                                                    </div>
                                                                    {/* 답변 */}
                                                                    {item.status === 'RESOLVED' && item.answer && (
                                                                        <div>
                                                                            <p className="text-label-bold text-primary mb-2 flex items-center gap-1">
                                                                                <span className="material-symbols-outlined text-base">support_agent</span>
                                                                                관리자 답변
                                                                            </p>
                                                                            <p className="text-body-md text-on-surface leading-relaxed whitespace-pre-wrap bg-primary/5 rounded-lg p-4 border border-primary/20">{item.answer}</p>
                                                                        </div>
                                                                    )}
                                                                    {item.status === 'PENDING' && (
                                                                        <div className="flex items-center gap-2 text-on-surface-variant text-body-sm">
                                                                            <span className="material-symbols-outlined text-base">schedule</span>
                                                                            영업일 기준 24시간 이내에 답변 드리겠습니다.
                                                                        </div>
                                                                    )}
                                                                    {/* 액션 버튼 */}
                                                                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/30">
                                                                        {item.status === 'PENDING' && (
                                                                            <button
                                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-body-sm text-on-surface-variant border border-outline-variant hover:bg-surface-container hover:text-primary transition-all"
                                                                                onClick={(e) => { e.stopPropagation(); handleEdit(item) }}
                                                                            >
                                                                                <span className="material-symbols-outlined text-base">edit</span>
                                                                                수정
                                                                            </button>
                                                                        )}
                                                                        <button
                                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-body-sm text-on-surface-variant border border-outline-variant hover:bg-error-container/30 hover:text-error hover:border-error/30 transition-all disabled:opacity-40"
                                                                            disabled={deletingId === item.id}
                                                                            onClick={(e) => { e.stopPropagation(); handleDelete(item.id!) }}
                                                                        >
                                                                            <span className="material-symbols-outlined text-base">delete</span>
                                                                            삭제
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* 페이지네이션 */}
                        {totalPages > 1 && (
                            <div className="px-6 py-4 border-t border-outline-variant/30 flex items-center justify-center gap-2">
                                <button
                                    onClick={() => fetchInquiries(page - 1)}
                                    disabled={page === 0}
                                    className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container text-on-surface-variant transition-all disabled:opacity-40"
                                >
                                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => fetchInquiries(i)}
                                        className={`w-8 h-8 flex items-center justify-center rounded font-label-bold text-sm transition-all ${
                                            i === page ? 'bg-primary text-on-primary' : 'hover:bg-surface-container text-on-surface-variant'
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => fetchInquiries(page + 1)}
                                    disabled={page === totalPages - 1}
                                    className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container text-on-surface-variant transition-all disabled:opacity-40"
                                >
                                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    )
}

function MyPageContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { user, logout, updateProfileImage } = useAuth()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [uploadingImage, setUploadingImage] = useState(false)
    const [trainerProfile, setTrainerProfile] = useState<TrainerProfile | null>(null)
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [hydrated, setHydrated] = useState(false)
    const [activeTab, setActiveTab] = useState('matching')
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [pwCurrent, setPwCurrent] = useState('')
    const [pwNew, setPwNew] = useState('')
    const [pwConfirm, setPwConfirm] = useState('')
    const [pwError, setPwError] = useState('')
    const [pwSuccess, setPwSuccess] = useState(false)
    const [pwLoading, setPwLoading] = useState(false)
    const [showWithdrawModal, setShowWithdrawModal] = useState(false)
    const [withdrawPassword, setWithdrawPassword] = useState('')
    const [withdrawError, setWithdrawError] = useState('')
    const [withdrawLoading, setWithdrawLoading] = useState(false)

    useEffect(() => {
        setHydrated(true)
    }, [])

    useEffect(() => {
        const tab = searchParams.get('tab')
        if (tab) setActiveTab(tab)
    }, [searchParams])

    useEffect(() => {
        if (!hydrated) return
        if (!user) {
            router.push('/auth/login')
            return
        }
        fetchMyProfile()
    }, [hydrated, user])

    const fetchMyProfile = async () => {
        const client = getAuthClient()
        setLoading(true)
        try {
            if (user?.role === 'TRAINER') {
                const { data, response } = await client.GET('/api/trainers/me')
                setTrainerProfile(response.ok && data ? data : null)
            } else {
                const { data, response } = await client.GET('/api/users/me')
                setUserProfile(response.ok && data ? data : null)
            }
        } catch {
            setTrainerProfile(null)
            setUserProfile(null)
        }
        setLoading(false)
    }

    const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setUploadingImage(true)
        const client = getAuthClient()
        const formData = new FormData()
        formData.append('file', file)
        try {
            const uploadRes = await fetch('http://localhost:8080/api/files/upload', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('fitmate_user') ?? '{}').token}`,
                },
                body: formData,
            })
            if (!uploadRes.ok) { alert('이미지 업로드에 실패했습니다.'); return }
            const { url } = await uploadRes.json()
            await client.PATCH('/api/members/me', { body: { profileImage: url } })
            updateProfileImage(url)
            await fetchMyProfile()
        } catch (err) {
            console.error(err)
            alert('이미지 업로드 중 오류가 발생했습니다.')
        } finally {
            setUploadingImage(false)
            e.target.value = ''
        }
    }

    const profile = user?.role === 'TRAINER' ? trainerProfile : userProfile

    if (!hydrated || loading) {
        const skeletonTab = searchParams.get('tab') ?? 'matching'

        const contentSkeleton = (() => {
            if (skeletonTab === 'reviews') {
                return (
                    <div className="flex flex-col gap-md">
                        {/* 탭 헤더 스켈레톤 */}
                        <div className="flex items-end justify-between border-b border-outline-variant pb-0">
                            <div className="flex gap-md pb-2.5">
                                <div className="h-6 w-20 rounded bg-surface-container animate-pulse" />
                                <div className="h-6 w-28 rounded bg-surface-container animate-pulse" />
                            </div>
                            <div className="mb-2 h-8 w-32 rounded-full bg-surface-container animate-pulse" />
                        </div>
                        {/* 리뷰 카드 스켈레톤 */}
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
                                <div className="mb-4 flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 flex-shrink-0 rounded-full bg-surface-container animate-pulse" />
                                        <div className="space-y-2">
                                            <div className="h-4 w-24 rounded bg-surface-container animate-pulse" />
                                            <div className="h-4 w-32 rounded bg-surface-container animate-pulse" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-3 rounded bg-surface-container animate-pulse" style={{ width: `${70 + (i * 11) % 25}%` }} />
                                    <div className="h-3 rounded bg-surface-container animate-pulse" style={{ width: `${50 + (i * 17) % 30}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }

            if (skeletonTab === 'inquiries') {
                return (
                    <div className="space-y-md">
                        <div className="grid grid-cols-3 gap-md">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-24 rounded-xl bg-surface-container animate-pulse" />
                            ))}
                        </div>
                        <div className="rounded-xl border border-outline-variant overflow-hidden bg-surface-container-lowest" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
                            <div className="h-12 bg-surface-container-low border-b border-outline-variant animate-pulse" />
                            <div className="divide-y divide-outline-variant/30">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="flex items-center gap-4 px-4 py-4">
                                        <div className="h-6 w-16 rounded-full bg-surface-container animate-pulse" />
                                        <div className="h-4 flex-1 rounded bg-surface-container animate-pulse" style={{ maxWidth: `${50 + (i * 13) % 35}%` }} />
                                        <div className="hidden md:block h-4 w-20 rounded bg-surface-container animate-pulse" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            }

            // matching / account / default
            return (
                <div className="grid grid-cols-1 gap-md md:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-40 rounded-xl bg-surface-container animate-pulse" />
                    ))}
                </div>
            )
        })()

        return (
            <main className="mx-auto flex w-full max-w-[1440px] flex-grow flex-col gap-md px-margin-mobile pb-lg pt-20 md:px-margin-desktop">
                {/* 프로필 헤더 스켈레톤 */}
                <div className="flex flex-col gap-4 rounded-xl bg-surface-container-low p-md sm:flex-row sm:items-center sm:justify-between" style={{ boxShadow: '0 4px 20px rgba(116,119,129,0.08)' }}>
                    <div className="flex items-center gap-md">
                        <div className="h-16 w-16 flex-shrink-0 rounded-full bg-surface-container animate-pulse sm:h-24 sm:w-24" />
                        <div className="space-y-2">
                            <div className="h-5 w-32 rounded-lg bg-surface-container animate-pulse" />
                            <div className="h-4 w-20 rounded-lg bg-surface-container animate-pulse" />
                        </div>
                    </div>
                    <div className="h-10 w-full rounded-lg bg-surface-container animate-pulse sm:w-28" />
                </div>

                {/* 사이드바 + 콘텐츠 스켈레톤 */}
                <div className="flex flex-grow flex-col gap-md lg:flex-row">
                    <aside className="flex-shrink-0 lg:w-64">
                        <div className="space-y-xs">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-11 rounded-lg bg-surface-container animate-pulse" />
                            ))}
                        </div>
                    </aside>
                    <div className="flex-grow min-h-[calc(100vh-200px)]">
                        {contentSkeleton}
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="mx-auto flex w-full max-w-[1440px] flex-grow flex-col gap-md px-margin-mobile pb-lg pt-20 md:px-margin-desktop">
            {/* 프로필 헤더 */}
            <div
                className="flex flex-col gap-4 rounded-xl bg-surface-container-low p-md sm:flex-row sm:items-center sm:justify-between"
                style={{ boxShadow: '0 4px 20px rgba(116,119,129,0.08)' }}
            >
                <div className="flex items-center gap-md">
                    <div className="relative flex-shrink-0">
                        <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-surface-container shadow-sm sm:h-24 sm:w-24">
                            {(user?.profileImage || profile?.profileImage) ? (
                                <img
                                    src={getImageUrl(user?.profileImage || profile?.profileImage)}
                                    alt=""
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span className="material-symbols-outlined text-3xl text-outline sm:text-4xl">person</span>
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/jpg,image/webp"
                            className="hidden"
                            onChange={handleProfileImageChange}
                        />
                        <button
                            className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-primary text-white shadow-lg transition-transform hover:scale-110 disabled:opacity-50 sm:h-7 sm:w-7"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingImage}
                        >
                            {uploadingImage ? (
                                <span className="material-symbols-outlined animate-spin text-[12px] sm:text-[14px]">progress_activity</span>
                            ) : (
                                <span className="material-symbols-outlined text-[12px] sm:text-[14px]">edit</span>
                            )}
                        </button>
                    </div>
                    <div className="min-w-0">
                        <h1 className="truncate text-title-lg font-bold text-on-surface sm:text-headline-md sm:font-headline-md">
                            {user?.userName}
                        </h1>
                        <p className="flex items-center gap-xs text-body-sm text-on-surface-variant sm:text-body-md">
                            <span className="material-symbols-outlined text-[16px]">fitness_center</span>
                            {user?.role === 'TRAINER' ? '트레이너' : '일반 회원'}
                        </p>
                    </div>
                </div>
                <button
                    className="flex w-full items-center justify-center gap-xs rounded-lg border border-outline-variant bg-surface-container-high px-md py-sm font-label-bold text-on-surface transition-all hover:bg-surface-container-highest sm:w-auto"
                    onClick={() => router.push('/mypage/edit')}
                >
                    <span className="material-symbols-outlined">settings</span>
                    프로필 설정
                </button>
            </div>

            {/* 사이드바 + 콘텐츠 */}
            <div className="flex flex-grow flex-col gap-md lg:flex-row">
                {/* 사이드바 */}
                <aside className="flex-shrink-0 lg:w-64">
                    <nav className="space-y-xs">
                        {[
                            { id: 'matching', icon: 'handshake', label: '매칭 관리' },
                            { id: 'reviews', icon: 'rate_review', label: '리뷰 관리' },
                            { id: 'inquiries', icon: 'help_center', label: '문의 내역' },
                            { id: 'account', icon: 'manage_accounts', label: '계정 설정' },
                        ].map(({ id, icon, label }) => (
                            <button
                                key={id}
                                className={`flex w-full items-center gap-md rounded-lg px-md py-sm font-label-bold transition-all ${
                                    activeTab === id
                                        ? 'bg-primary text-on-primary'
                                        : 'text-on-surface-variant hover:bg-surface-container-low'
                                }`}
                                onClick={() => router.replace(`/mypage?tab=${id}`)}
                            >
                                <span className="material-symbols-outlined">{icon}</span>
                                {label}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* 메인 콘텐츠 */}
                <div className="flex-grow space-y-md min-h-[calc(100vh-200px)]">
                    {activeTab === 'matching' && <MatchingManagementPreview />}

                    {/* 리뷰 관리 — 실제 후기 목록/통계/수정·삭제 (역할별 분기) */}
                    {activeTab === 'reviews' && (
                        <section className="space-y-md">
                            <h2 className="text-headline-sm font-headline-sm text-on-surface">
                                리뷰 관리
                            </h2>
                            <MyReviewList />
                        </section>
                    )}

                    {activeTab === 'inquiries' && <InquirySection />}

                    {activeTab === 'account' && (
                        <section className="space-y-md">
                            <h2 className="text-headline-sm font-headline-sm text-on-surface">
                                계정 설정
                            </h2>
                            <div
                                className="overflow-hidden rounded-xl border border-outline-variant"
                                style={{
                                    backgroundColor: '#f1f3ff',
                                    boxShadow: 'inset 0 2px 4px rgba(116,119,129,0.08)',
                                }}
                            >
                                {/* 비밀번호 변경 버튼 */}
                                <button
                                    className="flex w-full items-center justify-between border-b border-outline-variant p-md transition-colors hover:bg-white/50"
                                    onClick={() => {
                                        setPwCurrent('')
                                        setPwNew('')
                                        setPwConfirm('')
                                        setPwError('')
                                        setPwSuccess(false)
                                        setShowPasswordModal(true)
                                    }}
                                >
                                    <div className="flex items-center gap-md">
                                        <span className="material-symbols-outlined text-on-surface-variant">lock</span>
                                        <div className="text-left">
                                            <p className="text-label-bold text-on-surface">비밀번호 변경</p>
                                            <p className="text-body-sm text-on-surface-variant">현재 비밀번호 확인 후 새 비밀번호로 변경</p>
                                        </div>
                                    </div>
                                    <span className="material-symbols-outlined text-outline">chevron_right</span>
                                </button>

                                {/* 비밀번호 변경 모달 */}
                                {showPasswordModal && (
                                    <div
                                        style={{
                                            position: 'fixed', inset: 0,
                                            background: 'rgba(0,0,0,0.4)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            zIndex: 1000, padding: '16px',
                                        }}
                                        onClick={() => setShowPasswordModal(false)}
                                    >
                                        <div
                                            style={{
                                                background: 'white', borderRadius: '16px', padding: '32px',
                                                width: '100%', maxWidth: '400px',
                                                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {pwSuccess ? (
                                                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                                <span
                                    className="material-symbols-outlined"
                                    style={{ fontSize: '48px', color: '#0057CD', display: 'block', marginBottom: '16px' }}
                                >
                                    check_circle
                                </span>
                                                    <p style={{ fontSize: '18px', fontWeight: 700, color: '#0B1C30', marginBottom: '8px' }}>
                                                        비밀번호가 변경되었습니다
                                                    </p>
                                                    <p style={{ fontSize: '14px', color: '#424654', marginBottom: '24px' }}>
                                                        다음 로그인부터 새 비밀번호를 사용해 주세요.
                                                    </p>
                                                    <button
                                                        onClick={() => setShowPasswordModal(false)}
                                                        style={{
                                                            width: '100%', padding: '12px',
                                                            background: '#0057CD', color: 'white',
                                                            border: 'none', borderRadius: '10px',
                                                            fontSize: '15px', fontWeight: 600, cursor: 'pointer',
                                                        }}
                                                    >
                                                        확인
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                                                        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0B1C30', margin: 0 }}>
                                                            비밀번호 변경
                                                        </h2>
                                                        <button
                                                            onClick={() => setShowPasswordModal(false)}
                                                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                                                        >
                                                            <span className="material-symbols-outlined" style={{ color: '#9097a8' }}>close</span>
                                                        </button>
                                                    </div>

                                                    <form
                                                        onSubmit={async (e) => {
                                                            e.preventDefault()
                                                            e.stopPropagation()
                                                            setPwError('')

                                                            if (pwNew !== pwConfirm) {
                                                                setPwError('새 비밀번호가 일치하지 않습니다.')
                                                                return
                                                            }
                                                            if (pwNew.length < 8) {
                                                                setPwError('새 비밀번호는 8자 이상이어야 합니다.')
                                                                return
                                                            }

                                                            setPwLoading(true)
                                                            try {
                                                                const stored = localStorage.getItem('fitmate_user')
                                                                const token = stored ? JSON.parse(stored).token : null

                                                                const res = await fetch('http://localhost:8080/api/members/me/password', {
                                                                    method: 'PATCH',
                                                                    credentials: 'include',
                                                                    headers: {
                                                                        'Content-Type': 'application/json',
                                                                        'Authorization': `Bearer ${token}`,
                                                                    },
                                                                    body: JSON.stringify({
                                                                        currentPassword: pwCurrent,
                                                                        newPassword: pwNew,
                                                                    }),
                                                                })

                                                                if (!res.ok) {
                                                                    setPwError('현재 비밀번호가 올바르지 않습니다.')
                                                                    return
                                                                }
                                                                setPwSuccess(true)
                                                                setTimeout(() => {
                                                                    setShowPasswordModal(false)
                                                                    logout()
                                                                    router.push('/auth/login')
                                                                }, 1500)
                                                            } catch {
                                                                setPwError('서버 연결에 실패했습니다.')
                                                            } finally {
                                                                setPwLoading(false)
                                                            }
                                                        }}
                                                        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                                                    >
                                                        {[
                                                            { label: '현재 비밀번호', value: pwCurrent, onChange: setPwCurrent, placeholder: '현재 비밀번호를 입력하세요' },
                                                            { label: '새 비밀번호', value: pwNew, onChange: setPwNew, placeholder: '새 비밀번호를 입력하세요 (8자 이상)' },
                                                            { label: '새 비밀번호 확인', value: pwConfirm, onChange: setPwConfirm, placeholder: '새 비밀번호를 다시 입력하세요' },
                                                        ].map(({ label, value, onChange, placeholder }) => (
                                                            <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                                <label style={{ fontSize: '13px', fontWeight: 500, color: '#424655' }}>{label}</label>
                                                                <input
                                                                    type="password"
                                                                    value={value}
                                                                    onChange={(e) => onChange(e.target.value)}
                                                                    placeholder={placeholder}
                                                                    required
                                                                    style={{
                                                                        width: '100%', border: '1px solid #c2c6d8',
                                                                        borderRadius: '10px', padding: '10px 14px',
                                                                        fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                                                                    }}
                                                                    onFocus={(e) => (e.target.style.borderColor = '#0057cd')}
                                                                    onBlur={(e) => (e.target.style.borderColor = '#c2c6d8')}
                                                                />
                                                            </div>
                                                        ))}

                                                        {pwError && (
                                                            <p style={{ fontSize: '13px', color: '#ba1a1a', textAlign: 'center', margin: 0 }}>
                                                                {pwError}
                                                            </p>
                                                        )}

                                                        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowPasswordModal(false)}
                                                                style={{
                                                                    flex: 1, padding: '12px', background: 'white',
                                                                    color: '#424654', border: '1px solid #c2c6d8',
                                                                    borderRadius: '10px', fontSize: '15px',
                                                                    fontWeight: 600, cursor: 'pointer',
                                                                }}
                                                            >
                                                                취소
                                                            </button>
                                                            <button
                                                                type="submit"
                                                                disabled={pwLoading}
                                                                style={{
                                                                    flex: 1, padding: '12px',
                                                                    background: pwLoading ? '#93b4e8' : '#0057CD',
                                                                    color: 'white', border: 'none',
                                                                    borderRadius: '10px', fontSize: '15px',
                                                                    fontWeight: 600,
                                                                    cursor: pwLoading ? 'not-allowed' : 'pointer',
                                                                }}
                                                            >
                                                                {pwLoading ? '변경 중...' : '변경하기'}
                                                            </button>
                                                        </div>
                                                    </form>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* 회원 탈퇴 */}
                                <button
                                    className="group flex w-full items-center justify-between p-md transition-colors hover:bg-error-container/20"
                                    onClick={() => {
                                        setWithdrawPassword('')
                                        setWithdrawError('')
                                        setShowWithdrawModal(true)
                                    }}
                                >
                                    <div className="flex items-center gap-md text-error">
                                        <span className="material-symbols-outlined">person_remove</span>
                                        <div className="text-left">
                                            <p className="text-label-bold">회원 탈퇴</p>
                                            <p className="text-body-sm opacity-80">계정을 영구적으로 삭제합니다</p>
                                        </div>
                                    </div>
                                    <span className="material-symbols-outlined text-error opacity-0 transition-opacity group-hover:opacity-100">
                                        arrow_forward
                                    </span>
                                </button>

                                {/* 회원 탈퇴 모달 */}
                                {showWithdrawModal && (
                                    <div
                                        style={{
                                            position: 'fixed', inset: 0,
                                            background: 'rgba(0,0,0,0.4)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            zIndex: 1000, padding: '16px',
                                        }}
                                        onClick={() => setShowWithdrawModal(false)}
                                    >
                                        <div
                                            style={{
                                                background: 'white', borderRadius: '16px', padding: '32px',
                                                width: '100%', maxWidth: '400px',
                                                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#ba1a1a', margin: 0 }}>
                                                    회원 탈퇴
                                                </h2>
                                                <button
                                                    onClick={() => setShowWithdrawModal(false)}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                                                >
                                                    <span className="material-symbols-outlined" style={{ color: '#9097a8' }}>close</span>
                                                </button>
                                            </div>

                                            <p style={{ fontSize: '14px', color: '#424654', marginBottom: '24px', lineHeight: '1.6' }}>
                                                탈퇴 시 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다. 계속하려면 현재 비밀번호를 입력해 주세요.
                                            </p>

                                            <form
                                                onSubmit={async (e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                    setWithdrawError('')
                                                    setWithdrawLoading(true)
                                                    try {
                                                        const stored = localStorage.getItem('fitmate_user')
                                                        const token = stored ? JSON.parse(stored).token : null

                                                        const verifyRes = await fetch('http://localhost:8080/api/members/me/verify-password', {
                                                            method: 'POST',
                                                            credentials: 'include',
                                                            headers: {
                                                                'Content-Type': 'application/json',
                                                                'Authorization': `Bearer ${token}`,
                                                            },
                                                            body: JSON.stringify({
                                                                currentPassword: withdrawPassword,
                                                            }),
                                                        })

                                                        if (!verifyRes.ok) {
                                                            setWithdrawError('비밀번호가 올바르지 않습니다.')
                                                            return
                                                        }

                                                        // 회원 탈퇴
                                                        const deleteRes = await fetch('http://localhost:8080/api/members/me', {
                                                            method: 'DELETE',
                                                            credentials: 'include',
                                                            headers: {
                                                                'Authorization': `Bearer ${token}`,
                                                            },
                                                        })

                                                        if (!deleteRes.ok) {
                                                            setWithdrawError('회원 탈퇴에 실패했습니다.')
                                                            return
                                                        }

                                                        setShowWithdrawModal(false)
                                                        logout()
                                                        router.push('/auth/login')
                                                    } catch {
                                                        setWithdrawError('서버 연결에 실패했습니다.')
                                                    } finally {
                                                        setWithdrawLoading(false)
                                                    }
                                                }}
                                                style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                                            >
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                    <label style={{ fontSize: '13px', fontWeight: 500, color: '#424655' }}>현재 비밀번호</label>
                                                    <input
                                                        type="password"
                                                        value={withdrawPassword}
                                                        onChange={(e) => setWithdrawPassword(e.target.value)}
                                                        placeholder="현재 비밀번호를 입력하세요"
                                                        required
                                                        style={{
                                                            width: '100%', border: '1px solid #c2c6d8',
                                                            borderRadius: '10px', padding: '10px 14px',
                                                            fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                                                        }}
                                                        onFocus={(e) => (e.target.style.borderColor = '#ba1a1a')}
                                                        onBlur={(e) => (e.target.style.borderColor = '#c2c6d8')}
                                                    />
                                                </div>

                                                {withdrawError && (
                                                    <p style={{ fontSize: '13px', color: '#ba1a1a', textAlign: 'center', margin: 0 }}>
                                                        {withdrawError}
                                                    </p>
                                                )}

                                                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowWithdrawModal(false)}
                                                        style={{
                                                            flex: 1, padding: '12px', background: 'white',
                                                            color: '#424654', border: '1px solid #c2c6d8',
                                                            borderRadius: '10px', fontSize: '15px',
                                                            fontWeight: 600, cursor: 'pointer',
                                                        }}
                                                    >
                                                        취소
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        disabled={withdrawLoading}
                                                        style={{
                                                            flex: 1, padding: '12px',
                                                            background: withdrawLoading ? '#f5a0a0' : '#ba1a1a',
                                                            color: 'white', border: 'none',
                                                            borderRadius: '10px', fontSize: '15px',
                                                            fontWeight: 600,
                                                            cursor: withdrawLoading ? 'not-allowed' : 'pointer',
                                                        }}
                                                    >
                                                        {withdrawLoading ? '처리 중...' : '탈퇴하기'}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </main>
    )
}
export default function MyPage() {
    return (
        <Suspense fallback={null}>
            <MyPageContent />
        </Suspense>
    )
}

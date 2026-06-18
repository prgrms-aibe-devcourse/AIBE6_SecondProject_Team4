'use client'

import MyReviewList from '@/components/MyReviewList'
import { useAuth } from '@/context/AuthContext'
import type { components } from '@/types/api'
import { getAuthClient, getImageUrl } from '@/utils/apiClient'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Fragment, useEffect, useRef, useState } from 'react'


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
            <div className="grid grid-cols-3 gap-md">
                {[
                    { label: '전체 문의', value: totalElements, icon: 'description', color: 'text-on-surface', bg: 'bg-surface-container' },
                    { label: '답변 완료', value: totalResolved, icon: 'task_alt', color: 'text-primary', bg: 'bg-primary/10' },
                    { label: '답변 대기', value: totalPending, icon: 'pending', color: 'text-on-surface-variant', bg: 'bg-surface-container-high' },
                ].map(({ label, value, icon, color, bg }) => (
                    <div key={label} className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant flex items-center justify-between" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
                        <div>
                            <p className="text-body-sm text-on-surface-variant mb-1">{label}</p>
                            <p className={`text-headline-md font-bold ${color}`}>{loading ? '-' : value}</p>
                        </div>
                        <div className={`w-11 h-11 rounded-full ${bg} flex items-center justify-center`}>
                            <span className={`material-symbols-outlined ${color}`}>{icon}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* 테이블 */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
                {loading ? (
                    <div className="flex justify-center py-16">
                        <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
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
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-surface-container-low border-b border-outline-variant">
                                        <th className="px-6 py-4 text-label-bold font-label-bold text-on-surface-variant">상태</th>
                                        <th className="px-6 py-4 text-label-bold font-label-bold text-on-surface-variant">유형</th>
                                        <th className="px-6 py-4 text-label-bold font-label-bold text-on-surface-variant">제목</th>
                                        <th className="px-6 py-4 text-label-bold font-label-bold text-on-surface-variant text-right">작성일</th>
                                        <th className="px-6 py-4 text-label-bold font-label-bold text-on-surface-variant text-right">관리</th>
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
                                                    <td className="px-6 py-5">
                                                        {item.status === 'RESOLVED' ? (
                                                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">답변 완료</span>
                                                        ) : (
                                                            <span className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-semibold">답변 대기</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-5 text-body-sm text-on-surface-variant">
                                                        {TYPE_LABEL[item.type ?? ''] ?? item.type}
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-body-md text-on-surface group-hover:text-primary transition-colors">{item.title}</span>
                                                            <span className={`material-symbols-outlined text-base text-outline transition-transform ${expandedId === item.id ? 'rotate-180' : ''}`}>expand_more</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 text-right text-body-sm text-on-surface-variant whitespace-nowrap">
                                                        {formatDate(item.createdAt)}
                                                    </td>
                                                    <td className="px-6 py-5 text-right" onClick={e => e.stopPropagation()}>
                                                        <div className="flex items-center justify-end gap-2">
                                                            {item.status === 'PENDING' && (
                                                                <button
                                                                    className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all"
                                                                    title="수정"
                                                                    onClick={() => handleEdit(item)}
                                                                >
                                                                    <span className="material-symbols-outlined text-base">edit</span>
                                                                </button>
                                                            )}
                                                            <button
                                                                className="p-1.5 rounded-lg text-on-surface-variant hover:bg-error-container/30 hover:text-error transition-all disabled:opacity-40"
                                                                title="삭제"
                                                                disabled={deletingId === item.id}
                                                                onClick={() => handleDelete(item.id!)}
                                                            >
                                                                <span className="material-symbols-outlined text-base">delete</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                            {expandedId === item.id && editingId !== item.id && (
                                                <tr className="bg-surface-container-low">
                                                    <td colSpan={5} className="px-6 py-5">
                                                        <div className="space-y-4">
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

export default function MyPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { user, logout, updateProfileImage } = useAuth()
    const [trainerProfile, setTrainerProfile] = useState<TrainerProfile | null>(null)
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [hydrated, setHydrated] = useState(false)
    const [activeTab, setActiveTab] = useState('matching')
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [uploadingImage, setUploadingImage] = useState(false)

    useEffect(() => {
        setHydrated(true)
    }, [])

    useEffect(() => {
        if (!hydrated) return
        if (!user) {
            router.push('/auth/login')
            return
        }
        fetchMyProfile()
    }, [hydrated, user, searchParams])

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

    const profile = user?.role === 'TRAINER' ? trainerProfile : userProfile

    if (!hydrated || loading) {
        return (
            <main className="flex justify-center py-20 pt-16 md:pt-20">
                <span className="material-symbols-outlined animate-spin text-4xl text-primary">
                    progress_activity
                </span>
            </main>
        )
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

            if (!uploadRes.ok) {
                alert('이미지 업로드에 실패했습니다.')
                return
            }

            const { url } = await uploadRes.json()

            await client.PATCH('/api/members/me', {
                body: { profileImage: url },
            })

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

    return (
        <main className="mx-auto flex w-full max-w-[1440px] flex-grow flex-col gap-md px-margin-mobile pb-lg pt-20 md:px-margin-desktop">
            {/* 프로필 헤더 */}
            <div
                className="flex items-center justify-between rounded-xl bg-surface-container-low p-md"
                style={{ boxShadow: '0 4px 20px rgba(116,119,129,0.08)' }}
            >
                <div className="flex items-center gap-md">
                    <div className="relative">
                        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-surface-container shadow-sm">
                            {profile?.profileImage ? (
                                <img
                                    src={getImageUrl(profile.profileImage)}
                                    alt=""
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span className="material-symbols-outlined text-4xl text-outline">
                                    person
                                </span>
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
                            className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow-lg border-2 border-white hover:scale-110 transition-transform disabled:opacity-50"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingImage}
                        >
                            {uploadingImage ? (
                                <span className="material-symbols-outlined text-[18px] animate-spin">
                                    progress_activity
                                </span>
                            ) : (
                                <span className="material-symbols-outlined text-[18px]">edit</span>
                            )}
                        </button>
                    </div>
                    <div>
                        <h1 className="text-headline-md font-headline-md text-on-surface">
                            {user?.userName}
                        </h1>
                        <p className="flex items-center gap-xs text-body-md text-on-surface-variant">
                            <span className="material-symbols-outlined text-[16px]">
                                fitness_center
                            </span>
                            {user?.role === 'TRAINER' ? '트레이너' : '일반 회원'}
                        </p>
                    </div>
                </div>
                <button
                    className="flex items-center gap-xs rounded-lg border border-outline-variant bg-surface-container-high px-md py-sm font-label-bold text-on-surface transition-all hover:bg-surface-container-highest"
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
                            { id: 'account', icon: 'manage_accounts', label: '계정 설정' },
                        ].map(({ id, icon, label }) => (
                            <button
                                key={id}
                                className={`flex w-full items-center gap-md rounded-lg px-md py-sm font-label-bold transition-all ${
                                    activeTab === id
                                        ? 'bg-primary-container text-on-primary-container'
                                        : 'text-on-surface-variant hover:bg-surface-container-low'
                                }`}
                                onClick={() => setActiveTab(id)}
                            >
                                <span className="material-symbols-outlined">{icon}</span>
                                {label}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* 메인 콘텐츠 */}
                <div className="flex-grow space-y-md">
                    {activeTab === 'matching' && (
                        <section className="space-y-md">
                            <h2 className="text-headline-sm font-headline-sm text-on-surface">
                                매칭 관리
                            </h2>
                            <div className="grid grid-cols-1 gap-md md:grid-cols-3">
                                <div
                                    className="flex flex-col gap-sm rounded-xl border border-outline-variant bg-surface-container-lowest p-md"
                                    style={{ boxShadow: '0 4px 20px rgba(116,119,129,0.08)' }}
                                >
                                    <div className="flex items-center gap-sm text-primary">
                                        <span className="material-symbols-outlined">
                                            outgoing_mail
                                        </span>
                                        <span className="text-label-bold">보낸 요청</span>
                                    </div>
                                    <div className="flex-grow py-sm">
                                        <p className="py-4 text-center text-body-sm text-secondary">
                                            보낸 요청이 없습니다.
                                        </p>
                                    </div>
                                    <button className="w-full py-2 font-label-bold text-primary hover:underline">
                                        모든 요청 보기
                                    </button>
                                </div>
                                <div
                                    className="flex flex-col gap-sm rounded-xl border border-outline-variant bg-surface-container-lowest p-md"
                                    style={{ boxShadow: '0 4px 20px rgba(116,119,129,0.08)' }}
                                >
                                    <div className="flex items-center gap-sm text-tertiary">
                                        <span className="material-symbols-outlined">inbox</span>
                                        <span className="text-label-bold">받은 요청</span>
                                    </div>
                                    <div className="flex-grow py-sm">
                                        <p className="py-4 text-center text-body-sm text-secondary">
                                            받은 요청이 없습니다.
                                        </p>
                                    </div>
                                    <button className="w-full py-2 font-label-bold text-primary hover:underline">
                                        수신함 관리
                                    </button>
                                </div>
                                <div
                                    className="flex flex-col gap-sm rounded-xl border border-outline-variant bg-surface-container-lowest p-md"
                                    style={{ boxShadow: '0 4px 20px rgba(116,119,129,0.08)' }}
                                >
                                    <div className="flex items-center gap-sm text-secondary">
                                        <span className="material-symbols-outlined">verified</span>
                                        <span className="text-label-bold">매칭 완료 내역</span>
                                    </div>
                                    <div className="flex-grow py-sm">
                                        <p className="py-4 text-center text-body-sm text-secondary">
                                            매칭 내역이 없습니다.
                                        </p>
                                    </div>
                                    <button className="w-full py-2 font-label-bold text-primary hover:underline">
                                        히스토리 보기
                                    </button>
                                </div>
                            </div>
                        </section>
                    )}

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
                                <button className="flex w-full items-center justify-between border-b border-outline-variant p-md transition-colors hover:bg-white/50">
                                    <div className="flex items-center gap-md">
                                        <span className="material-symbols-outlined text-on-surface-variant">
                                            lock
                                        </span>
                                        <div className="text-left">
                                            <p className="text-label-bold text-on-surface">
                                                비밀번호 및 보안
                                            </p>
                                            <p className="text-body-sm text-on-surface-variant">
                                                비밀번호 변경 및 2단계 인증 설정
                                            </p>
                                        </div>
                                    </div>
                                    <span className="material-symbols-outlined text-outline">
                                        chevron_right
                                    </span>
                                </button>
                                <button
                                    className="group flex w-full items-center justify-between p-md transition-colors hover:bg-error-container/20"
                                    onClick={() => {
                                        logout()
                                        router.push('/auth/login')
                                    }}
                                >
                                    <div className="flex items-center gap-md text-error">
                                        <span className="material-symbols-outlined">logout</span>
                                        <div className="text-left">
                                            <p className="text-label-bold">로그아웃</p>
                                            <p className="text-body-sm opacity-80">
                                                계정에서 안전하게 로그아웃합니다
                                            </p>
                                        </div>
                                    </div>
                                    <span className="material-symbols-outlined text-error opacity-0 transition-opacity group-hover:opacity-100">
                                        arrow_forward
                                    </span>
                                </button>
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </main>
    )
}

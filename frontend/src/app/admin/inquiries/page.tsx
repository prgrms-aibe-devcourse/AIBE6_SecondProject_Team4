'use client'

import { getAuthClient } from '@/utils/apiClient'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { components } from '@/types/api'

type InquiryResponse = components['schemas']['InquiryResponse']

const TYPE_LABEL: Record<string, string> = {
    MATCHING: '매칭',
    TRAINER: '트레이너',
    ETC: '기타',
}

const formatDate = (str?: string) => {
    if (!str) return '-'
    const d = new Date(str)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function AdminInquiriesPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [allInquiries, setAllInquiries] = useState<InquiryResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(Number(searchParams.get('page') ?? '0'))
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'RESOLVED'>('ALL')
    const [search, setSearch] = useState('')
    const [searchInput, setSearchInput] = useState('')

    const PAGE_SIZE = 10

    useEffect(() => { fetchAll() }, [])

    const fetchAll = async () => {
        setLoading(true)
        const client = getAuthClient()
        const { data } = await client.GET('/api/admin/inquiries', {
            params: { query: { page: 0, size: 9999, sort: 'createdAt,asc' } as any },
        })
        if (data?.content) {
            setAllInquiries(data.content as InquiryResponse[])
        }
        setLoading(false)
    }

    const pendingCount = allInquiries.filter(i => i.status === 'PENDING').length

    const filtered = allInquiries
        .filter(i => statusFilter === 'ALL' || i.status === statusFilter)
        .filter(i => !search || i.title?.includes(search) || i.content?.includes(search))
        .sort((a, b) => {
            if (statusFilter !== 'ALL') return 0
            if (a.status === b.status) return 0
            return a.status === 'PENDING' ? -1 : 1
        })

    const totalElements = filtered.length
    const totalPages = Math.ceil(totalElements / PAGE_SIZE)
    const displayedInquiries = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

    const handleFilterChange = (s: typeof statusFilter) => {
        setStatusFilter(s)
        setPage(0)
    }

    const pageNumbers = () => {
        const start = Math.max(0, page - 2)
        const end = Math.min(totalPages - 1, start + 4)
        return Array.from({ length: end - start + 1 }, (_, i) => start + i)
    }

    return (
        <>
            {/* 통계 카드 */}
            <div className="grid grid-cols-12 gap-6 mb-10">
                <div className="col-span-12 lg:col-span-5 relative overflow-hidden rounded-xl bg-primary-container p-8 shadow-lg">
                    <div className="relative z-10">
                        <p className="mb-2 text-sm font-bold uppercase tracking-wider opacity-80 text-white">미처리 문의</p>
                        <h2 className="text-[48px] font-bold leading-none text-white">
                            {loading ? <span className="h-12 w-16 rounded bg-white/20 animate-pulse inline-block" /> : pendingCount}
                            <span className="text-2xl ml-2">건</span>
                        </h2>
                    </div>
                    <span className="material-symbols-outlined absolute -right-5 -bottom-5 text-[180px] opacity-10 text-white">pending_actions</span>
                </div>
                <div className="col-span-12 lg:col-span-7 grid grid-cols-2 gap-6">
                    <div className="flex flex-col justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-8 shadow-sm hover:border-primary transition-all">
                        <div>
                            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-container/30 text-secondary">
                                <span className="material-symbols-outlined">description</span>
                            </div>
                            <p className="mb-1 text-sm font-bold text-on-surface-variant">전체 문의</p>
                            <h3 className="text-2xl font-bold text-on-surface">
                                {loading ? <span className="h-7 w-12 rounded bg-surface-container animate-pulse inline-block" /> : `${totalElements} 건`}
                            </h3>
                        </div>
                        <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-surface-container">
                            <div className="h-full bg-secondary" style={{ width: totalElements > 0 ? `${Math.min((pendingCount / totalElements) * 100, 100)}%` : '0%' }} />
                        </div>
                    </div>
                    <div className="flex flex-col justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-8 shadow-sm hover:border-primary transition-all">
                        <div>
                            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <span className="material-symbols-outlined">task_alt</span>
                            </div>
                            <p className="mb-1 text-sm font-bold text-on-surface-variant">답변 완료</p>
                            <h3 className="text-2xl font-bold text-on-surface">
                                {loading ? <span className="h-7 w-12 rounded bg-surface-container animate-pulse inline-block" /> : `${totalElements - pendingCount} 건`}
                            </h3>
                        </div>
                        <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-surface-container">
                            <div className="h-full bg-primary" style={{ width: totalElements > 0 ? `${Math.min(((totalElements - pendingCount) / totalElements) * 100, 100)}%` : '0%' }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* 검색 + 테이블 */}
            <div className="rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm overflow-hidden">
                {/* 필터 */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-surface-container-high p-6">
                    <div className="flex items-center gap-3">
                        {(['ALL', 'PENDING', 'RESOLVED'] as const).map(s => (
                            <button
                                key={s}
                                onClick={() => handleFilterChange(s)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                    statusFilter === s
                                        ? 'bg-primary text-on-primary'
                                        : 'border border-outline-variant text-on-surface-variant hover:bg-surface-container'
                                }`}
                            >
                                {s === 'ALL' ? '전체' : s === 'PENDING' ? '답변 대기' : '답변 완료'}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
                            <input
                                className="rounded-lg border border-outline-variant bg-surface-container py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="제목/내용 검색..."
                                value={searchInput}
                                onChange={e => setSearchInput(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') { setSearch(searchInput); setPage(0) } }}
                            />
                        </div>
                        <p className="text-body-sm text-on-surface-variant whitespace-nowrap">
                            전체 <span className="font-bold text-on-surface">{totalElements}</span>건
                        </p>
                    </div>
                </div>

                {/* 테이블 */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-surface-container-high bg-surface-container-low">
                                <th className="px-6 py-4 text-sm font-bold text-on-surface-variant whitespace-nowrap">상태</th>
                                <th className="px-6 py-4 text-sm font-bold text-on-surface-variant whitespace-nowrap">유형</th>
                                <th className="px-6 py-4 text-sm font-bold text-on-surface-variant w-full">제목</th>
                                <th className="px-6 py-4 text-sm font-bold text-on-surface-variant whitespace-nowrap text-right">회원 ID</th>
                                <th className="px-6 py-4 text-sm font-bold text-on-surface-variant whitespace-nowrap text-right">등록 일시</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container-high">
                            {loading ? (
                                Array.from({ length: 10 }).map((_, i) => (
                                    <tr key={i}>
                                        <td className="px-6 py-5"><div className="h-6 w-16 rounded-full bg-surface-container animate-pulse" /></td>
                                        <td className="px-6 py-5"><div className="h-4 w-12 rounded bg-surface-container animate-pulse" /></td>
                                        <td className="px-6 py-5"><div className="h-4 rounded bg-surface-container animate-pulse" style={{ width: `${55 + (i * 13) % 35}%` }} /></td>
                                        <td className="px-6 py-5"><div className="h-4 w-10 rounded bg-surface-container animate-pulse" /></td>
                                        <td className="px-6 py-5"><div className="h-4 w-28 rounded bg-surface-container animate-pulse" /></td>
                                    </tr>
                                ))
                            ) : displayedInquiries.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-16 text-center text-on-surface-variant">
                                        <span className="material-symbols-outlined text-5xl block mb-3">inbox</span>
                                        문의가 없습니다.
                                    </td>
                                </tr>
                            ) : (
                                displayedInquiries.map(item => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-surface-container-low transition-colors group cursor-pointer"
                                        onClick={() => router.push(`/admin/inquiries/${item.id}?page=${page}`)}
                                    >
                                        <td className="px-6 py-5">
                                            {item.status === 'RESOLVED' ? (
                                                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary whitespace-nowrap">답변 완료</span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-full bg-error-container px-3 py-1 text-xs font-bold text-on-error-container whitespace-nowrap">답변 대기</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-5 text-sm font-semibold text-secondary whitespace-nowrap">{TYPE_LABEL[item.type ?? ''] ?? item.type}</td>
                                        <td className="px-6 py-5 text-body-md font-medium text-on-surface">{item.title}</td>
                                        <td className="px-6 py-5 text-sm text-on-surface-variant whitespace-nowrap text-right">{item.memberId}</td>
                                        <td className="px-6 py-5 text-sm text-on-surface-variant whitespace-nowrap text-right">{formatDate(item.createdAt)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 페이지네이션 */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-surface-container-high px-6 py-4">
                        <p className="text-body-sm text-on-surface-variant">
                            전체 {totalElements}개 중 {page * 10 + 1}–{Math.min((page + 1) * 10, totalElements)} 표시
                        </p>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPage(p => p - 1)}
                                disabled={page === 0}
                                className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-surface-container transition-colors disabled:opacity-30"
                            >
                                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                            </button>
                            {pageNumbers().map(p => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`h-9 w-9 rounded-lg text-sm font-bold transition-colors ${
                                        p === page ? 'bg-primary text-on-primary' : 'hover:bg-surface-container text-on-surface-variant'
                                    }`}
                                >
                                    {p + 1}
                                </button>
                            ))}
                            {totalPages > 5 && page < totalPages - 3 && (
                                <>
                                    <span className="px-1 text-on-surface-variant">...</span>
                                    <button
                                        onClick={() => setPage(totalPages - 1)}
                                        className="h-9 w-9 rounded-lg text-sm font-bold hover:bg-surface-container text-on-surface-variant"
                                    >
                                        {totalPages}
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={page === totalPages - 1}
                                className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-surface-container transition-colors disabled:opacity-30"
                            >
                                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

'use client'

import { getAuthClient } from '@/utils/apiClient';
import { useEffect, useState } from 'react';



import { useRouter } from 'next/navigation';









interface MemberRow {
    id: number
    userId: string
    userName: string
    nickname: string
    email: string
    role: 'USER' | 'TRAINER' | 'ADMIN'
    phone: string
    createdAt: string
    deleted: boolean
}

interface PageResponse {
    content: MemberRow[]
    totalElements: number
    totalPages: number
    number: number
}

interface Stats {
    total: number
    trainer: number
    user: number
}

export default function AdminMembersPage() {
    const router = useRouter()
    const [members, setMembers] = useState<MemberRow[]>([])
    const [stats, setStats] = useState<Stats>({ total: 0, trainer: 0, user: 0 })
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [totalElements, setTotalElements] = useState(0)
    const [keyword, setKeyword] = useState('')
    const [role, setRole] = useState('')
    const [deletingId, setDeletingId] = useState<number | null>(null)

    const fetchStats = async () => {
        const stored = localStorage.getItem('fitmate_user')
        const token = stored ? JSON.parse(stored).token : null
        const res = await fetch('http://localhost:8080/api/admin/members/stats', {
            headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
            const data = await res.json()
            setStats(data)
        }
    }

    const fetchMembers = async (p = 0) => {
        setLoading(true)
        const stored = localStorage.getItem('fitmate_user')
        const token = stored ? JSON.parse(stored).token : null

        const params = new URLSearchParams({
            page: String(p),
            size: '10',
            sort: 'createdAt,desc',
        })
        if (keyword.trim()) params.append('keyword', keyword.trim())
        if (role) params.append('role', role)

        const res = await fetch(`http://localhost:8080/api/admin/members?${params}`, {
            headers: { Authorization: `Bearer ${token}` },
        })

        if (res.ok) {
            const data: PageResponse = await res.json()
            setMembers(data.content)
            setTotalPages(data.totalPages)
            setTotalElements(data.totalElements)
            setPage(data.number)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchStats()
        fetchMembers(0)
    }, [])

    const handleSearch = () => {
        fetchMembers(0)
    }

    const handleDelete = async (memberId: number, userName: string) => {
        if (!confirm(`${userName} 회원을 강제 탈퇴 처리하시겠습니까?`)) return
        setDeletingId(memberId)
        const stored = localStorage.getItem('fitmate_user')
        const token = stored ? JSON.parse(stored).token : null

        const res = await fetch(`http://localhost:8080/api/admin/members/${memberId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        })

        if (res.ok) {
            fetchMembers(page)
            fetchStats()
        }
        setDeletingId(null)
    }

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '-'
        return new Date(dateStr).toLocaleDateString('ko-KR', {
            year: 'numeric', month: '2-digit', day: '2-digit'
        }).replace(/\. /g, '.').replace(/\.$/, '')
    }

    const getRoleBadge = (role: string) => {
        if (role === 'TRAINER') return (
            <span className="px-2 py-1 bg-primary text-on-primary text-[10px] font-bold rounded uppercase">트레이너</span>
        )
        if (role === 'ADMIN') return (
            <span className="px-2 py-1 bg-error text-on-error text-[10px] font-bold rounded uppercase">관리자</span>
        )
        return (
            <span className="px-2 py-1 bg-surface-container-highest text-on-surface-variant text-[10px] font-bold rounded uppercase">일반</span>
        )
    }

    const getStatusBadge = (deleted: boolean) => {
        if (deleted) return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-dim text-on-surface-variant">
                <span className="w-1.5 h-1.5 rounded-full bg-outline mr-1.5" />
                탈퇴
            </span>
        )
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5" />
                정상
            </span>
        )
    }

    return (
        <div className="space-y-6">
            {/* 페이지 타이틀 */}
            <div>
                <h2 className="text-headline-md font-bold text-on-surface">회원 관리</h2>
                <p className="text-on-surface-variant text-body-md">
                    전체 회원 리스트를 조회하고 관리할 수 있습니다.
                </p>
            </div>

            {/* 요약 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        label: '전체 회원',
                        value: stats.total,
                        icon: 'group',
                        color: 'text-primary',
                        bg: 'bg-primary-fixed',
                    },
                    {
                        label: '트레이너 회원',
                        value: stats.trainer,
                        icon: 'fitness_center',
                        color: 'text-secondary',
                        bg: 'bg-secondary-fixed',
                    },
                    {
                        label: '일반 회원',
                        value: stats.user,
                        icon: 'person',
                        color: 'text-tertiary',
                        bg: 'bg-tertiary-fixed',
                    },
                ].map(({ label, value, icon, color, bg }) => (
                    <div
                        key={label}
                        className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-surface-container-high flex items-center justify-between"
                    >
                        <div>
                            <p className="text-on-surface-variant text-body-sm font-semibold mb-1">
                                {label}
                            </p>
                            <p className={`text-3xl font-bold ${color}`}>
                                {loading ? '-' : value.toLocaleString()}
                            </p>
                        </div>
                        <div
                            className={`w-12 h-12 ${bg} rounded-full flex items-center justify-center ${color}`}
                        >
                            <span className="material-symbols-outlined text-[28px]">{icon}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* 검색 & 필터 */}
            <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container-high flex flex-wrap items-end gap-4">
                <div className="flex-1 min-w-[240px]">
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                        통합 검색
                    </label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                            search
                        </span>
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="ID, 이름, 이메일로 검색"
                            className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-body-sm transition-all outline-none"
                        />
                    </div>
                </div>
                <div className="w-40">
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                        유형
                    </label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary text-body-sm outline-none"
                    >
                        <option value="">전체 유형</option>
                        <option value="TRAINER">트레이너</option>
                        <option value="USER">일반 회원</option>
                    </select>
                </div>
                <button
                    onClick={handleSearch}
                    className="bg-primary text-on-primary px-6 py-2 rounded-lg font-semibold text-body-sm hover:brightness-110 transition-all flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-[18px]">search</span>
                    검색
                </button>
            </div>

            {/* 테이블 */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-high overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-surface-container-low border-b border-surface-container-high">
                            <th className="px-6 py-4 font-semibold text-body-sm text-on-surface-variant">
                                사용자 ID
                            </th>
                            <th className="px-6 py-4 font-semibold text-body-sm text-on-surface-variant">
                                이름
                            </th>
                            <th className="px-6 py-4 font-semibold text-body-sm text-on-surface-variant">
                                이메일
                            </th>
                            <th className="px-6 py-4 font-semibold text-body-sm text-on-surface-variant">
                                가입일
                            </th>
                            <th className="px-6 py-4 font-semibold text-body-sm text-on-surface-variant">
                                유형
                            </th>
                            <th className="px-6 py-4 font-semibold text-body-sm text-on-surface-variant text-center">
                                상태
                            </th>
                            <th className="px-6 py-4 font-semibold text-body-sm text-on-surface-variant text-center">
                                관리
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container-high">
                        {loading ? (
                            Array.from({ length: 10 }).map((_, i) => (
                                <tr key={i}>
                                    {Array.from({ length: 7 }).map((_, j) => (
                                        <td key={j} className="px-6 py-4">
                                            <div
                                                className="h-4 rounded bg-surface-container animate-pulse"
                                                style={{ width: `${60 + ((j * 10) % 30)}%` }}
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : members.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-6 py-16 text-center text-on-surface-variant"
                                >
                                    <span className="material-symbols-outlined text-5xl block mb-3">
                                        person_search
                                    </span>
                                    <p className="text-body-md">검색 결과가 없습니다.</p>
                                </td>
                            </tr>
                        ) : (
                            members.map((member) => (
                                <tr
                                    key={member.id}
                                    className="hover:bg-surface-container-low transition-colors"
                                >
                                    <td className="px-6 py-4 text-body-sm font-medium text-on-surface">
                                        {member.userId}
                                    </td>
                                    <td className="px-6 py-4 text-body-sm text-on-surface">
                                        {member.userName}
                                    </td>
                                    <td className="px-6 py-4 text-body-sm text-on-surface-variant">
                                        {member.email ?? '-'}
                                    </td>
                                    <td className="px-6 py-4 text-body-sm text-on-surface-variant">
                                        {formatDate(member.createdAt)}
                                    </td>
                                    <td className="px-6 py-4">{getRoleBadge(member.role)}</td>
                                    <td className="px-6 py-4 text-center">
                                        {getStatusBadge(member.deleted)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {!member.deleted ? (
                                            <button
                                                onClick={() =>
                                                    handleDelete(member.id, member.userName)
                                                }
                                                disabled={deletingId === member.id}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-error-container text-on-error-container hover:bg-error hover:text-on-error transition-all disabled:opacity-40"
                                            >
                                                <span className="material-symbols-outlined text-[14px]">
                                                    person_remove
                                                </span>
                                                {deletingId === member.id
                                                    ? '처리 중...'
                                                    : '강제 탈퇴'}
                                            </button>
                                        ) : (
                                            <span className="text-on-surface-variant text-body-sm">
                                                -
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* 페이지네이션 */}
                <div className="px-6 py-4 border-t border-surface-container-high flex items-center justify-between bg-surface-container-low/50">
                    <p className="text-body-sm text-on-surface-variant">
                        표시 중: {page * 10 + 1} - {Math.min((page + 1) * 10, totalElements)} (전체{' '}
                        {totalElements.toLocaleString()}명)
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => fetchMembers(page - 1)}
                            disabled={page === 0}
                            className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container-high disabled:opacity-40 transition-all"
                        >
                            <span className="material-symbols-outlined text-[18px]">
                                chevron_left
                            </span>
                        </button>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            const pageNum = Math.max(0, Math.min(page - 2, totalPages - 5)) + i
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => fetchMembers(pageNum)}
                                    className={`w-8 h-8 flex items-center justify-center rounded font-semibold text-sm transition-all ${
                                        pageNum === page
                                            ? 'bg-primary text-on-primary'
                                            : 'hover:bg-surface-container-high text-on-surface-variant'
                                    }`}
                                >
                                    {pageNum + 1}
                                </button>
                            )
                        })}
                        <button
                            onClick={() => fetchMembers(page + 1)}
                            disabled={page === totalPages - 1}
                            className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container-high disabled:opacity-40 transition-all"
                        >
                            <span className="material-symbols-outlined text-[18px]">
                                chevron_right
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

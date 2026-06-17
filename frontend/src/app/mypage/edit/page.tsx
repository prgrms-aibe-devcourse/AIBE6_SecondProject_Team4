'use client'

import { useAuth } from '@/context/AuthContext'
import { getAuthClient } from '@/utils/apiClient'
import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

const SPORTS_LIST = ['PT', '필라테스', '요가', '크로스핏', '테니스', '골프', '수영', '댄스']
const LESSON_LEVELS = ['입문/초보', '중급', '고급/대회준비']
const LESSON_TYPES = ['1:1', '그룹', '온라인']
const GOALS = ['다이어트', '근력 향상', '체형 교정', '재활', '유연성', '스트레스 해소', '건강 유지']

export default function ProfileEditPage() {
    const router = useRouter()
    const { user } = useAuth()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [activeSection, setActiveSection] = useState('basic')

    // 트레이너 폼
    const [trainerId, setTrainerId] = useState<number | null>(null)
    const [trainerForm, setTrainerForm] = useState({
        sports: [] as string[],
        lessonType: 'ONE_TO_ONE',
        lessonLevel: [] as string[],
        price: '',
        careerYears: '',
        region: '',
        introduction: '',
        availableTimes: [] as { dayOfWeek: string; startTime: string; endTime: string }[],
    })

    // 유저 폼
    const [userId, setUserId] = useState<number | null>(null)
    const [userForm, setUserForm] = useState({
        sports: [] as string[],
        level: '',
        goal: [] as string[],
        region: '',
        introduction: '',
    })

    useEffect(() => {
        if (!user) {
            router.push('/auth/login')
            return
        }
        fetchMyProfile()
    }, [user])

    const fetchMyProfile = async () => {
        const client = getAuthClient()
        if (user?.role === 'TRAINER') {
            const { data } = await client.GET('/api/trainers/me')
            if (data) {
                setTrainerId(data.id ?? null)
                setTrainerForm({
                    sports: data.sports ? data.sports.split(',').map((s) => s.trim()) : [],
                    lessonType: data.lessonType ?? 'ONE_TO_ONE',
                    lessonLevel: data.lessonLevel
                        ? data.lessonLevel.split(',').map((l) => l.trim())
                        : [],
                    price: data.price?.toString() ?? '',
                    careerYears: data.careerYears?.toString() ?? '',
                    region: data.region ?? '',
                    introduction: data.introduction ?? '',
                    availableTimes:
                        data.availableTimes?.map((t) => ({
                            dayOfWeek: t.dayOfWeek ?? '',
                            startTime: t.startTime ?? '09:00',
                            endTime: t.endTime ?? '22:00',
                        })) ?? [],
                })
            }
        } else {
            const { data } = await client.GET('/api/users/me')
            if (data) {
                setUserId(data.id ?? null)
                setUserForm({
                    sports: data.sports ? data.sports.split(',').map((s) => s.trim()) : [],
                    level: data.level ?? '',
                    goal: data.goal ? data.goal.split(',').map((g) => g.trim()) : [],
                    region: data.region ?? '',
                    introduction: data.introduction ?? '',
                })
            }
        }
        setLoading(false)
    }

    const toggleSport = (sport: string) => {
        if (user?.role === 'TRAINER') {
            setTrainerForm((f) => ({
                ...f,
                sports: f.sports.includes(sport)
                    ? f.sports.filter((s) => s !== sport)
                    : [...f.sports, sport],
            }))
        } else {
            setUserForm((f) => ({
                ...f,
                sports: f.sports.includes(sport)
                    ? f.sports.filter((s) => s !== sport)
                    : [...f.sports, sport],
            }))
        }
    }

    const toggleGoal = (goal: string) => {
        setUserForm((f) => ({
            ...f,
            goal: f.goal.includes(goal) ? f.goal.filter((g) => g !== goal) : [...f.goal, goal],
        }))
    }

    const handleSave = async () => {
        setSaving(true)
        console.log('availableTimes:', trainerForm.availableTimes) // 추가
        const client = getAuthClient()

        await client.PATCH('/api/members/me', {
            body: {
                region: user?.role === 'TRAINER' ? trainerForm.region : userForm.region,
                introduction:
                    user?.role === 'TRAINER' ? trainerForm.introduction : userForm.introduction,
            },
        })

        if (user?.role === 'TRAINER') {
            const body = {
                sports: trainerForm.sports.join(','),
                lessonType: trainerForm.lessonType,
                lessonLevel: trainerForm.lessonLevel.join(','),
                price: Number(trainerForm.price),
                careerYears: Number(trainerForm.careerYears),
                availableTimes: trainerForm.availableTimes.map((t) => ({
                    dayOfWeek: t.dayOfWeek,
                    startTime: t.startTime,
                    endTime: t.endTime,
                })),
            }
            if (trainerId) {
                await client.PUT('/api/trainers/{id}', {
                    params: { path: { id: trainerId } },
                    body,
                })
            } else {
                await client.POST('/api/trainers', { body })
            }
        } else {
            const body = {
                sports: trainerForm.sports.join(','),
                lessonType: trainerForm.lessonType,
                price: Number(trainerForm.price),
                careerYears: Number(trainerForm.careerYears),
                availableTimes: trainerForm.availableTimes.map((t) => ({
                    dayOfWeek: t.dayOfWeek,
                    startTime: t.startTime,
                    endTime: t.endTime,
                })),
            }
            if (userId) {
                await client.PUT('/api/users/{id}', { params: { path: { id: userId } }, body })
            } else {
                await client.POST('/api/users', { body })
            }
        }

        setSaving(false)
        router.push('/mypage?t=' + Date.now())
    }

    if (loading) {
        return (
            <main className="pt-16 md:pt-20 flex justify-center py-20">
                <span className="material-symbols-outlined animate-spin text-primary text-4xl">
                    progress_activity
                </span>
            </main>
        )
    }

    const sidebarItems =
        user?.role === 'TRAINER'
            ? [
                  { id: 'basic', icon: 'person', label: '기본 정보' },
                  { id: 'specialty', icon: 'fitness_center', label: '전문 분야' },
                  { id: 'lesson', icon: 'assignment', label: '레슨 상세 정보' },
              ]
            : [
                  { id: 'basic', icon: 'person', label: '기본 정보' },
                  { id: 'specialty', icon: 'fitness_center', label: '관심 종목' },
                  { id: 'goal', icon: 'flag', label: '목표 설정' },
              ]

    return (
        <main className="pt-16 md:pt-20">
            <div className="max-w-[1440px] mx-auto px-margin-desktop py-lg flex gap-lg">
                {/* 사이드바 */}
                <aside className="w-64 flex-shrink-0">
                    <div
                        className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md"
                        style={{ boxShadow: '0 4px 20px rgba(116,119,129,0.08)' }}
                    >
                        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-sm">
                            {user?.role === 'TRAINER' ? '트레이너 프로필' : '회원 프로필'}
                        </h2>
                        <p className="text-body-sm text-on-surface-variant mb-md">
                            전문적인 프로필을 구축하여 더 많은 고객에게 다가가세요.
                        </p>
                        <nav className="space-y-xs">
                            {sidebarItems.map(({ id, icon, label }) => (
                                <button
                                    key={id}
                                    className={`w-full flex items-center gap-sm px-sm py-sm rounded-lg text-label-bold font-label-bold transition-all ${
                                        activeSection === id
                                            ? 'bg-primary text-on-primary'
                                            : 'text-on-surface-variant hover:bg-surface-container'
                                    }`}
                                    onClick={() => setActiveSection(id)}
                                >
                                    <span className="material-symbols-outlined text-sm">
                                        {icon}
                                    </span>
                                    {label}
                                </button>
                            ))}
                        </nav>

                        {/* 프로필 완성도 */}
                        <div className="mt-md pt-md border-t border-outline-variant">
                            <p className="text-label-md font-label-md text-on-surface-variant mb-xs">
                                프로필 완성도
                            </p>
                            <div className="w-full bg-surface-container rounded-full h-2">
                                <div
                                    className="bg-primary h-2 rounded-full"
                                    style={{ width: '60%' }}
                                ></div>
                            </div>
                            <p className="text-label-md font-label-md text-on-surface-variant mt-xs">
                                60% 완성
                            </p>
                        </div>
                    </div>
                </aside>

                {/* 메인 폼 */}
                <div className="flex-grow">
                    <div
                        className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg"
                        style={{ boxShadow: '0 4px 20px rgba(116,119,129,0.08)' }}
                    >
                        {/* 기본 정보 */}
                        {activeSection === 'basic' && (
                            <div className="space-y-md">
                                <div className="flex items-center gap-sm mb-md">
                                    <span className="material-symbols-outlined text-primary">
                                        person
                                    </span>
                                    <h2 className="font-headline-sm text-headline-sm">기본 정보</h2>
                                </div>
                                <div className="grid grid-cols-2 gap-md">
                                    <div className="space-y-xs">
                                        <label className="block text-label-md font-label-md text-on-surface-variant">
                                            성함
                                        </label>
                                        <input
                                            className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-sm py-sm text-body-md outline-none"
                                            value={user?.userName ?? ''}
                                            readOnly
                                        />
                                    </div>
                                    <div className="space-y-xs">
                                        <label className="block text-label-md font-label-md text-on-surface-variant">
                                            활동 지역
                                        </label>
                                        <input
                                            className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-sm py-sm text-body-md outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="도시 또는 지역 검색"
                                            value={
                                                user?.role === 'TRAINER'
                                                    ? trainerForm.region
                                                    : userForm.region
                                            }
                                            onChange={(e) =>
                                                user?.role === 'TRAINER'
                                                    ? setTrainerForm((f) => ({
                                                          ...f,
                                                          region: e.target.value,
                                                      }))
                                                    : setUserForm((f) => ({
                                                          ...f,
                                                          region: e.target.value,
                                                      }))
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="space-y-xs">
                                    <label className="block text-label-md font-label-md text-on-surface-variant">
                                        한 줄 소개
                                    </label>
                                    <textarea
                                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-sm py-sm text-body-md outline-none focus:ring-2 focus:ring-primary resize-none"
                                        placeholder="귀하의 피트니스 철학을 간단히 설명해주세요..."
                                        rows={4}
                                        maxLength={120}
                                        value={
                                            user?.role === 'TRAINER'
                                                ? trainerForm.introduction
                                                : userForm.introduction
                                        }
                                        onChange={(e) =>
                                            user?.role === 'TRAINER'
                                                ? setTrainerForm((f) => ({
                                                      ...f,
                                                      introduction: e.target.value,
                                                  }))
                                                : setUserForm((f) => ({
                                                      ...f,
                                                      introduction: e.target.value,
                                                  }))
                                        }
                                    />
                                </div>
                            </div>
                        )}

                        {/* 전문 분야 / 관심 종목 */}
                        {activeSection === 'specialty' && (
                            <div className="space-y-md">
                                <div className="flex items-center gap-sm mb-md">
                                    <span className="material-symbols-outlined text-primary">
                                        fitness_center
                                    </span>
                                    <h2 className="font-headline-sm text-headline-sm">
                                        {user?.role === 'TRAINER' ? '전문 분야' : '관심 종목'}
                                    </h2>
                                </div>
                                <p className="text-body-sm text-on-surface-variant">
                                    중복 선택 가능합니다.
                                </p>
                                <div className="grid grid-cols-4 gap-sm">
                                    {SPORTS_LIST.map((sport) => {
                                        const selected =
                                            user?.role === 'TRAINER'
                                                ? trainerForm.sports.includes(sport)
                                                : userForm.sports.includes(sport)
                                        return (
                                            <button
                                                key={sport}
                                                className={`py-sm rounded-lg text-label-bold font-label-bold border transition-all ${
                                                    selected
                                                        ? 'bg-primary text-on-primary border-primary'
                                                        : 'bg-surface-container-low border-outline-variant text-on-surface-variant hover:border-primary'
                                                }`}
                                                onClick={() => toggleSport(sport)}
                                            >
                                                {sport}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* 트레이너 - 레슨 상세 정보 */}
                        {activeSection === 'lesson' && user?.role === 'TRAINER' && (
                            <div className="space-y-md">
                                <div className="flex items-center gap-sm mb-md">
                                    <span className="material-symbols-outlined text-primary">
                                        assignment
                                    </span>
                                    <h2 className="font-headline-sm text-headline-sm">
                                        레슨 상세 정보
                                    </h2>
                                </div>
                                <div className="space-y-xs">
                                    <label className="block text-label-md font-label-md text-on-surface-variant">
                                        레슨 유형
                                    </label>
                                    <div className="grid grid-cols-3 gap-sm">
                                        {[
                                            { label: '1:1', value: 'ONE_TO_ONE' },
                                            { label: '그룹', value: 'GROUP' },
                                            { label: '온라인', value: 'ONLINE' },
                                        ].map(({ label, value }) => (
                                            <button
                                                key={value}
                                                className={`py-sm rounded-lg text-label-bold font-label-bold border transition-all ${
                                                    trainerForm.lessonType === value
                                                        ? 'bg-primary text-on-primary border-primary'
                                                        : 'bg-surface-container-low border-outline-variant text-on-surface-variant hover:border-primary'
                                                }`}
                                                onClick={() =>
                                                    setTrainerForm((f) => ({
                                                        ...f,
                                                        lessonType: value,
                                                    }))
                                                }
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-md">
                                    <div className="space-y-xs">
                                        <label className="block text-label-md font-label-md text-on-surface-variant">
                                            경력 (년차)
                                        </label>
                                        <input
                                            className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-sm py-sm text-body-md outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="활동 기간 입력"
                                            type="number"
                                            value={trainerForm.careerYears}
                                            onChange={(e) =>
                                                setTrainerForm((f) => ({
                                                    ...f,
                                                    careerYears: e.target.value,
                                                }))
                                            }
                                        />
                                    </div>
                                    <div className="space-y-xs">
                                        <label className="block text-label-md font-label-md text-on-surface-variant">
                                            최당 가격 (원)
                                        </label>
                                        <div className="flex items-center bg-surface-container-low border border-outline-variant rounded-lg px-sm py-sm">
                                            <span className="text-on-surface-variant mr-xs">₩</span>
                                            <input
                                                className="flex-grow bg-transparent text-body-md outline-none"
                                                placeholder="0"
                                                type="number"
                                                value={trainerForm.price}
                                                onChange={(e) =>
                                                    setTrainerForm((f) => ({
                                                        ...f,
                                                        price: e.target.value,
                                                    }))
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-xs">
                                    <label className="block text-label-md font-label-md text-on-surface-variant">
                                        레슨 수준
                                    </label>
                                    <div className="grid grid-cols-3 gap-sm">
                                        {LESSON_LEVELS.map((level) => (
                                            <button
                                                key={level}
                                                className={`py-sm rounded-lg text-label-bold font-label-bold border transition-all ${
                                                    trainerForm.lessonLevel.includes(level)
                                                        ? 'bg-primary text-on-primary border-primary'
                                                        : 'bg-surface-container-low border-outline-variant text-on-surface-variant hover:border-primary'
                                                }`}
                                                onClick={() =>
                                                    setTrainerForm((f) => ({
                                                        ...f,
                                                        lessonLevel: f.lessonLevel.includes(level)
                                                            ? f.lessonLevel.filter(
                                                                  (l) => l !== level
                                                              )
                                                            : [...f.lessonLevel, level],
                                                    }))
                                                }
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* 활동 시간 */}
                                <div className="space-y-sm">
                                    <label className="block text-label-md font-label-md text-on-surface-variant">
                                        활동 시간
                                    </label>
                                    {/* 요일 선택 */}
                                    <div className="flex gap-xs">
                                        {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(
                                            (day, i) => {
                                                const labels = [
                                                    '월',
                                                    '화',
                                                    '수',
                                                    '목',
                                                    '금',
                                                    '토',
                                                    '일',
                                                ]
                                                const selected = trainerForm.availableTimes.some(
                                                    (t) => t.dayOfWeek === day
                                                )
                                                return (
                                                    <button
                                                        key={day}
                                                        className={`w-10 h-10 rounded-full text-label-bold font-label-bold border transition-all ${
                                                            selected
                                                                ? 'bg-primary text-on-primary border-primary'
                                                                : 'bg-surface-container-low border-outline-variant text-on-surface-variant hover:border-primary'
                                                        }`}
                                                        onClick={() => {
                                                            setTrainerForm((f) => {
                                                                const exists =
                                                                    f.availableTimes.some(
                                                                        (t) => t.dayOfWeek === day
                                                                    )
                                                                if (exists) {
                                                                    return {
                                                                        ...f,
                                                                        availableTimes:
                                                                            f.availableTimes.filter(
                                                                                (t) =>
                                                                                    t.dayOfWeek !==
                                                                                    day
                                                                            ),
                                                                    }
                                                                } else {
                                                                    return {
                                                                        ...f,
                                                                        availableTimes: [
                                                                            ...f.availableTimes,
                                                                            {
                                                                                dayOfWeek: day,
                                                                                startTime: '09:00',
                                                                                endTime: '22:00',
                                                                            },
                                                                        ],
                                                                    }
                                                                }
                                                            })
                                                        }}
                                                    >
                                                        {labels[i]}
                                                    </button>
                                                )
                                            }
                                        )}
                                    </div>
                                    {/* 시간 선택 */}
                                    <div className="flex items-center gap-sm">
                                        <div className="flex items-center gap-xs">
                                            <label className="text-label-md font-label-md text-on-surface-variant">
                                                시작
                                            </label>
                                            <input
                                                type="time"
                                                className="bg-surface-container-low border border-outline-variant rounded-lg px-sm py-xs text-body-md outline-none focus:ring-2 focus:ring-primary"
                                                value={
                                                    trainerForm.availableTimes[0]?.startTime ??
                                                    '09:00'
                                                }
                                                onChange={(e) =>
                                                    setTrainerForm((f) => ({
                                                        ...f,
                                                        availableTimes: f.availableTimes.map(
                                                            (t) => ({
                                                                ...t,
                                                                startTime: e.target.value,
                                                            })
                                                        ),
                                                    }))
                                                }
                                            />
                                        </div>
                                        <span className="text-on-surface-variant">-</span>
                                        <div className="flex items-center gap-xs">
                                            <label className="text-label-md font-label-md text-on-surface-variant">
                                                종료
                                            </label>
                                            <input
                                                type="time"
                                                className="bg-surface-container-low border border-outline-variant rounded-lg px-sm py-xs text-body-md outline-none focus:ring-2 focus:ring-primary"
                                                value={
                                                    trainerForm.availableTimes[0]?.endTime ??
                                                    '22:00'
                                                }
                                                onChange={(e) =>
                                                    setTrainerForm((f) => ({
                                                        ...f,
                                                        availableTimes: f.availableTimes.map(
                                                            (t) => ({
                                                                ...t,
                                                                endTime: e.target.value,
                                                            })
                                                        ),
                                                    }))
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 유저 - 목표 설정 */}
                        {activeSection === 'goal' && user?.role !== 'TRAINER' && (
                            <div className="space-y-md">
                                <div className="flex items-center gap-sm mb-md">
                                    <span className="material-symbols-outlined text-primary">
                                        flag
                                    </span>
                                    <h2 className="font-headline-sm text-headline-sm">목표 설정</h2>
                                </div>
                                <div className="space-y-xs">
                                    <label className="block text-label-md font-label-md text-on-surface-variant">
                                        레벨
                                    </label>
                                    <div className="grid grid-cols-3 gap-sm">
                                        {[
                                            { label: '초급', value: 'BEGINNER' },
                                            { label: '중급', value: 'INTERMEDIATE' },
                                            { label: '고급', value: 'ADVANCED' },
                                        ].map(({ label, value }) => (
                                            <button
                                                key={value}
                                                className={`py-sm rounded-lg text-label-bold font-label-bold border transition-all ${
                                                    userForm.level === value
                                                        ? 'bg-primary text-on-primary border-primary'
                                                        : 'bg-surface-container-low border-outline-variant text-on-surface-variant hover:border-primary'
                                                }`}
                                                onClick={() =>
                                                    setUserForm((f) => ({ ...f, level: value }))
                                                }
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-xs">
                                    <label className="block text-label-md font-label-md text-on-surface-variant">
                                        운동 목표 (중복 선택 가능)
                                    </label>
                                    <div className="grid grid-cols-4 gap-sm">
                                        {GOALS.map((goal) => (
                                            <button
                                                key={goal}
                                                className={`py-sm rounded-lg text-label-bold font-label-bold border transition-all ${
                                                    userForm.goal.includes(goal)
                                                        ? 'bg-primary text-on-primary border-primary'
                                                        : 'bg-surface-container-low border-outline-variant text-on-surface-variant hover:border-primary'
                                                }`}
                                                onClick={() => toggleGoal(goal)}
                                            >
                                                {goal}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 저장/취소 버튼 */}
                        <div className="flex justify-end gap-sm mt-lg pt-md border-t border-outline-variant">
                            <button
                                className="px-lg py-sm border border-outline-variant text-on-surface rounded-lg font-label-bold hover:bg-surface-container transition"
                                onClick={() => router.back()}
                            >
                                취소
                            </button>
                            <button
                                className="px-lg py-sm bg-primary text-on-primary rounded-lg font-label-bold hover:shadow-lg active:scale-95 transition-all disabled:opacity-50"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving ? '저장 중...' : '프로필 저장'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

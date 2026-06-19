'use client'

import MatchingSummary from '@/components/matching/MatchingSummary'
import PreferredTimeInput, { type PreferredTime } from '@/components/matching/PreferredTimeInput'
import { DISTRICTS, LESSON_TYPES, LEVELS, REGIONS, SPORTS } from '@/constants/matchingOptions'
import { useAuth } from '@/context/AuthContext'
import { getAuthClient } from '@/utils/apiClient'
import { FormEvent, useEffect, useMemo, useState } from 'react'

import { useRouter } from 'next/navigation'

export type MatchingDraft = {
    sports?: string
    level?: string
    lessonType?: string
    region?: string
    budgetMin?: number
    budgetMax?: number
    lessonContent?: string
    preferredTimes?: Array<{
        dayOfWeek?: string
        startTime?: string
        endTime?: string
    }>
}

type MatchingFormProps = {
    initialDraft?: MatchingDraft | null
}

const DAY_LABELS: Record<string, string> = {
    MONDAY: '월요일',
    TUESDAY: '화요일',
    WEDNESDAY: '수요일',
    THURSDAY: '목요일',
    FRIDAY: '금요일',
    SATURDAY: '토요일',
    SUNDAY: '일요일',
}

const formatPrice = (price: number) => `${price.toLocaleString('ko-KR')}원`

export default function MatchingForm({ initialDraft }: MatchingFormProps) {
    const router = useRouter()
    const { user } = useAuth()
    const [sports, setSports] = useState('필라테스')
    const [level, setLevel] = useState('중급')
    const [lessonType, setLessonType] = useState('1:1 PT')
    const [region, setRegion] = useState('서울')
    const [district, setDistrict] = useState('강남구')
    const [budgetMin, setBudgetMin] = useState(50000)
    const [budgetMax, setBudgetMax] = useState(80000)
    const [dayOfWeek, setDayOfWeek] = useState('월요일')
    const [startTime, setStartTime] = useState('19:00')
    const [endTime, setEndTime] = useState('20:00')
    const [lessonContent, setLessonContent] = useState('')
    const [preferredTimes, setPreferredTimes] = useState<PreferredTime[]>([
        { id: 1, dayOfWeek: '월요일', startTime: '19:00', endTime: '20:00' },
    ])
    const [formError, setFormError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (!initialDraft) {
            return
        }

        if (initialDraft.sports && SPORTS.includes(initialDraft.sports)) {
            setSports(initialDraft.sports)
        }

        if (initialDraft.level && LEVELS.includes(initialDraft.level)) {
            setLevel(initialDraft.level)
        }

        if (initialDraft.lessonType && LESSON_TYPES.includes(initialDraft.lessonType)) {
            setLessonType(initialDraft.lessonType)
        }

        if (initialDraft.region && REGIONS.includes(initialDraft.region)) {
            setRegion(initialDraft.region)
            setDistrict('')
        }

        const parsedBudgetMin =
            typeof initialDraft.budgetMin === 'number'
                ? Math.max(30000, Math.min(initialDraft.budgetMin, 140000))
                : null
        const parsedBudgetMax =
            typeof initialDraft.budgetMax === 'number'
                ? Math.max(40000, Math.min(initialDraft.budgetMax, 150000))
                : null

        if (parsedBudgetMin !== null && parsedBudgetMax !== null) {
            let nextBudgetMin = Math.min(parsedBudgetMin, parsedBudgetMax)
            let nextBudgetMax = Math.max(parsedBudgetMin, parsedBudgetMax)

            if (nextBudgetMax - nextBudgetMin < 10000) {
                nextBudgetMax = Math.min(150000, nextBudgetMin + 10000)
                nextBudgetMin = Math.max(30000, nextBudgetMax - 10000)
            }

            setBudgetMin(nextBudgetMin)
            setBudgetMax(nextBudgetMax)
        } else if (parsedBudgetMin !== null) {
            setBudgetMin(parsedBudgetMin)
            setBudgetMax(Math.min(150000, Math.max(80000, parsedBudgetMin + 10000)))
        } else if (parsedBudgetMax !== null) {
            setBudgetMin(Math.max(30000, Math.min(50000, parsedBudgetMax - 10000)))
            setBudgetMax(parsedBudgetMax)
        }

        if (initialDraft.lessonContent) {
            setLessonContent(initialDraft.lessonContent)
        }

        const parsedTimes =
            initialDraft.preferredTimes
                ?.filter((time) => time.dayOfWeek && time.startTime && time.endTime)
                .map((time, index) => ({
                    id: Date.now() + index,
                    dayOfWeek: DAY_LABELS[time.dayOfWeek!] ?? time.dayOfWeek!,
                    startTime: time.startTime!.slice(0, 5),
                    endTime: time.endTime!.slice(0, 5),
                })) ?? []

        const firstParsedDay = initialDraft.preferredTimes?.find(
            (time) => time.dayOfWeek
        )?.dayOfWeek

        if (firstParsedDay) {
            setDayOfWeek(DAY_LABELS[firstParsedDay] ?? firstParsedDay)
        }

        setPreferredTimes(parsedTimes)

        if (parsedTimes.length > 0) {
            const firstTime = parsedTimes[0]

            setDayOfWeek(firstTime.dayOfWeek)
            setStartTime(firstTime.startTime)
            setEndTime(firstTime.endTime)
        }

        setFormError('')
    }, [initialDraft])

    const districtOptions = useMemo(() => DISTRICTS[region] ?? [], [region])

    const handleRegionChange = (nextRegion: string) => {
        setRegion(nextRegion)
        setDistrict(DISTRICTS[nextRegion]?.[0] ?? '')
    }

    const handleBudgetMinChange = (value: number) => {
        setBudgetMin(Math.min(value, budgetMax - 10000))
    }

    const handleBudgetMaxChange = (value: number) => {
        setBudgetMax(Math.max(value, budgetMin + 10000))
    }

    const addPreferredTime = () => {
        if (startTime >= endTime) {
            setFormError('종료 시간은 시작 시간보다 늦어야 합니다.')
            return
        }

        const isDuplicate = preferredTimes.some(
            (time) =>
                time.dayOfWeek === dayOfWeek &&
                time.startTime === startTime &&
                time.endTime === endTime
        )

        if (isDuplicate) {
            setFormError('이미 추가한 선호 시간입니다.')
            return
        }

        setPreferredTimes((times) => [...times, { id: Date.now(), dayOfWeek, startTime, endTime }])
        setFormError('')
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!user) {
            router.push('/auth/login')
            return
        }

        if (preferredTimes.length === 0) {
            setFormError('선호 시간을 한 개 이상 추가해 주세요.')
            return
        }

        setIsSubmitting(true)
        setFormError('')

        try {
            const client = getAuthClient()
            const { data, error } = await client.POST('/api/matching', {
                body: {
                    level,
                    sports,
                    lessonType,
                    region,
                    budgetMin,
                    budgetMax,
                    lessonContent,
                    preferredTimes: preferredTimes.map((time) => ({
                        dayOfWeek: time.dayOfWeek,
                        startTime: `${time.startTime}:00`,
                        endTime: `${time.endTime}:00`,
                    })),
                },
            })

            if (error || !data?.matchingId) {
                setFormError('매칭 요청을 저장하지 못했습니다.')
                return
            }

            const { error: resultError } = await client.POST('/api/matching/{matchingId}/results', {
                params: {
                    path: {
                        matchingId: data.matchingId,
                    },
                },
            })

            if (resultError) {
                setFormError('추천 결과를 생성하지 못했습니다.')
                return
            }

            sessionStorage.setItem(
                `matching-request-${data.matchingId}`,
                JSON.stringify({
                    sports,
                    level,
                    lessonType,
                    region,
                    district,
                    budgetMin,
                    budgetMax,
                    lessonContent,
                })
            )

            router.push(`/matching/${data.matchingId}`)
        } catch {
            setFormError('서버에 연결할 수 없습니다.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-gutter items-start"
        >
            <div className="space-y-md">
                <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md md:p-lg">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">
                        어떤 운동을 원하시나요?
                    </h3>

                    <label className="block mt-md text-label-md font-label-md text-on-surface-variant">
                        운동 종목
                        <select
                            value={sports}
                            onChange={(event) => setSports(event.target.value)}
                            className="mt-xs w-full h-12 rounded-lg border border-outline-variant bg-surface-container-lowest px-sm text-body-md outline-none focus:border-primary"
                        >
                            {SPORTS.map((sport) => (
                                <option key={sport} value={sport}>
                                    {sport}
                                </option>
                            ))}
                        </select>
                    </label>

                    <ChoiceButtons
                        legend="레슨 수준"
                        options={LEVELS}
                        selected={level}
                        onSelect={setLevel}
                    />
                    <ChoiceButtons
                        legend="레슨 유형"
                        options={LESSON_TYPES}
                        selected={lessonType}
                        onSelect={setLessonType}
                    />
                </section>

                <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md md:p-lg">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">
                        지역 및 예산
                    </h3>

                    <div className="mt-md grid grid-cols-1 sm:grid-cols-2 gap-sm">
                        <SelectField
                            label="희망 지역(시/도)"
                            value={region}
                            options={REGIONS}
                            onChange={handleRegionChange}
                        />
                        <SelectField
                            label="상세 지역(구/군)"
                            value={district}
                            options={districtOptions}
                            onChange={setDistrict}
                            placeholder="상세 지역을 선택하세요"
                        />
                    </div>

                    <div className="mt-md">
                        <div className="flex flex-wrap items-end justify-between gap-xs">
                            <span className="text-label-md font-label-md text-on-surface-variant">
                                1회당 희망 예산
                            </span>
                            <strong className="text-primary text-body-lg">
                                {formatPrice(budgetMin)} ~ {formatPrice(budgetMax)}
                            </strong>
                        </div>

                        <div className="mt-md space-y-sm">
                            <BudgetRange
                                label="최소 예산"
                                value={budgetMin}
                                onChange={handleBudgetMinChange}
                            />
                            <BudgetRange
                                label="최대 예산"
                                value={budgetMax}
                                onChange={handleBudgetMaxChange}
                            />
                        </div>
                        <div className="mt-xs flex justify-between text-label-md text-outline">
                            <span>3만원</span>
                            <span>15만원+</span>
                        </div>
                    </div>
                </section>

                <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md md:p-lg">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">
                        일정 및 목표
                    </h3>
                    <p className="mt-xs text-body-sm text-on-surface-variant">
                        선호하는 요일과 시간은 여러 개 추가할 수 있습니다.
                    </p>

                    <PreferredTimeInput
                        dayOfWeek={dayOfWeek}
                        startTime={startTime}
                        endTime={endTime}
                        preferredTimes={preferredTimes}
                        onDayChange={setDayOfWeek}
                        onStartTimeChange={setStartTime}
                        onEndTimeChange={setEndTime}
                        onAdd={addPreferredTime}
                        onRemove={(id) =>
                            setPreferredTimes((times) => times.filter((time) => time.id !== id))
                        }
                    />

                    <label className="block mt-md text-label-md font-label-md text-on-surface-variant">
                        구체적인 목표나 요청사항
                        <textarea
                            value={lessonContent}
                            onChange={(event) => setLessonContent(event.target.value)}
                            maxLength={500}
                            rows={6}
                            placeholder="예: 코어 근육 강화를 원합니다. 과거 허리 디스크 이력이 있습니다."
                            className="mt-xs w-full resize-none rounded-lg border border-outline-variant bg-surface-container-lowest p-sm text-body-md outline-none focus:border-primary"
                        />
                    </label>
                    <div className="mt-xs text-right text-label-md text-outline">
                        {lessonContent.length}/500
                    </div>
                </section>
            </div>

            <MatchingSummary
                sports={sports}
                level={level}
                lessonType={lessonType}
                region={region}
                district={district}
                preferredTimeCount={preferredTimes.length}
                budgetMin={budgetMin}
                budgetMax={budgetMax}
                errorMessage={formError}
                isSubmitting={isSubmitting}
            />
        </form>
    )
}

type ChoiceButtonsProps = {
    legend: string
    options: string[]
    selected: string
    onSelect: (option: string) => void
}

function ChoiceButtons({ legend, options, selected, onSelect }: ChoiceButtonsProps) {
    return (
        <fieldset className="mt-md">
            <legend className="text-label-md font-label-md text-on-surface-variant">
                {legend}
            </legend>
            <div className="mt-xs flex flex-wrap gap-xs">
                {options.map((option) => (
                    <button
                        key={option}
                        type="button"
                        onClick={() => onSelect(option)}
                        className={`h-10 px-md rounded-full border text-body-sm transition-colors ${
                            selected === option
                                ? 'border-primary bg-primary-fixed text-on-primary-fixed-variant font-semibold'
                                : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-primary'
                        }`}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </fieldset>
    )
}

type SelectFieldProps = {
    label: string
    value: string
    options: string[]
    onChange: (value: string) => void
    placeholder?: string
}

function SelectField({ label, value, options, onChange, placeholder }: SelectFieldProps) {
    return (
        <label className="text-label-md font-label-md text-on-surface-variant">
            {label}
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="mt-xs w-full h-12 rounded-lg border border-outline-variant bg-surface-container-lowest px-sm text-body-md outline-none focus:border-primary"
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </label>
    )
}

function BudgetRange({
    label,
    value,
    onChange,
}: {
    label: string
    value: number
    onChange: (value: number) => void
}) {
    return (
        <label className="block">
            <span className="sr-only">{label}</span>
            <input
                type="range"
                min="30000"
                max="150000"
                step="10000"
                value={value}
                onChange={(event) => onChange(Number(event.target.value))}
                className="w-full accent-primary"
            />
        </label>
    )
}

'use client'

import BudgetSelector from '@/components/matching/BudgetSelector'
import MatchingSummary from '@/components/matching/MatchingSummary'
import PreferredTimeInput, { type PreferredTime } from '@/components/matching/PreferredTimeInput'
import {
    DAYS_OF_WEEK,
    DISTRICTS,
    LESSON_TYPES,
    LEVELS,
    REGIONS,
    SPORTS,
} from '@/constants/matchingOptions'
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
    enhancedQuery?: string
    suggestedPreferences?: string[]
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

const PREFERENCE_OPTIONS = [
    '초보자 친화',
    '동기부여',
    '자세 교정',
    '체형 개선',
    '근력 향상',
    '재활 경험',
    '대회 준비',
    '체계적인 관리',
    '운동 습관 형성',
    '경력 우선',
]

const PREFERENCE_PREFIX = '중요하게 생각하는 조건:'
const MATCHING_FORM_STORAGE_KEY = 'fitmate-matching-form'

const applyPreferencesToContent = (content: string, preferences: string[]) => {
    const baseContent = content
        .split('\n')
        .filter((line) => !line.trim().startsWith(PREFERENCE_PREFIX))
        .join('\n')
        .trim()

    return [
        baseContent,
        preferences.length > 0 ? `${PREFERENCE_PREFIX} ${preferences.join(', ')}` : '',
    ]
        .filter(Boolean)
        .join('\n')
        .slice(0, 500)
}

type StoredMatchingForm = {
    sports: string
    levels: string[]
    lessonTypes: string[]
    region: string
    district: string
    budgetMin: number
    budgetMax: number
    lessonContent: string
    suggestedPreferences: string[]
    selectedPreferences: string[]
    preferredTimes: PreferredTime[]
}

export default function MatchingForm({ initialDraft }: MatchingFormProps) {
    const router = useRouter()
    const { user } = useAuth()
    const [sports, setSports] = useState('필라테스')
    const [levels, setLevels] = useState<string[]>(['중급'])
    const [lessonTypes, setLessonTypes] = useState<string[]>(['1:1 PT'])
    const [region, setRegion] = useState('서울')
    const [district, setDistrict] = useState('강남구')
    const [budgetMin, setBudgetMin] = useState(50000)
    const [budgetMax, setBudgetMax] = useState(80000)
    const [lessonContent, setLessonContent] = useState('')
    const [suggestedPreferences, setSuggestedPreferences] = useState<string[]>([])
    const [selectedPreferences, setSelectedPreferences] = useState<string[]>([])
    const [preferredTimes, setPreferredTimes] = useState<PreferredTime[]>([])
    const [formError, setFormError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isStorageReady, setIsStorageReady] = useState(false)

    useEffect(() => {
        if (!initialDraft) {
            return
        }

        if (initialDraft.sports && SPORTS.includes(initialDraft.sports)) {
            setSports(initialDraft.sports)
        }

        const parsedLevels =
            initialDraft.level
                ?.split(',')
                .map(normalizeLevelLabel)
                .filter((value) => LEVELS.includes(value)) ?? []

        if (parsedLevels.length > 0) {
            setLevels([...new Set(parsedLevels)])
        } else {
            setLevels([...LEVELS])
        }

        const parsedLessonTypes =
            initialDraft.lessonType
                ?.split(',')
                .map(normalizeLessonTypeLabel)
                .filter((value) => LESSON_TYPES.includes(value)) ?? []

        if (parsedLessonTypes.length > 0) {
            setLessonTypes([...new Set(parsedLessonTypes)])
        } else {
            setLessonTypes([...LESSON_TYPES])
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

        const nextLessonContent = initialDraft.enhancedQuery ?? initialDraft.lessonContent

        if (nextLessonContent) {
            setLessonContent(nextLessonContent)
        }

        setSuggestedPreferences(initialDraft.suggestedPreferences ?? [])
        setSelectedPreferences([])

        const parsedTimes =
            initialDraft.preferredTimes
                ?.filter((time) => time.dayOfWeek)
                .map((time, index) => ({
                    id: Date.now() + index,
                    dayOfWeek: DAY_LABELS[time.dayOfWeek!] ?? time.dayOfWeek!,
                    startTime: '00:00',
                    endTime: '23:59:59',
                })) ?? []

        setPreferredTimes(parsedTimes)

        setFormError('')
    }, [initialDraft])

    useEffect(() => {
        if (initialDraft) {
            setIsStorageReady(true)
            return
        }

        try {
            const storedValue = localStorage.getItem(MATCHING_FORM_STORAGE_KEY)

            if (!storedValue) {
                return
            }

            const storedForm = JSON.parse(storedValue) as Partial<StoredMatchingForm>

            if (storedForm.sports && SPORTS.includes(storedForm.sports)) {
                setSports(storedForm.sports)
            }
            if (storedForm.levels?.length) {
                setLevels(storedForm.levels.filter((level) => LEVELS.includes(level)))
            }
            if (storedForm.lessonTypes?.length) {
                setLessonTypes(
                    storedForm.lessonTypes.filter((lessonType) => LESSON_TYPES.includes(lessonType))
                )
            }
            if (storedForm.region && REGIONS.includes(storedForm.region)) {
                setRegion(storedForm.region)
            }
            if (typeof storedForm.district === 'string') {
                setDistrict(storedForm.district)
            }
            if (typeof storedForm.budgetMin === 'number') {
                setBudgetMin(storedForm.budgetMin)
            }
            if (typeof storedForm.budgetMax === 'number') {
                setBudgetMax(storedForm.budgetMax)
            }
            if (typeof storedForm.lessonContent === 'string') {
                setLessonContent(storedForm.lessonContent)
            }

            setSuggestedPreferences(
                storedForm.suggestedPreferences?.filter((preference) =>
                    PREFERENCE_OPTIONS.includes(preference)
                ) ?? []
            )
            setSelectedPreferences(
                storedForm.selectedPreferences?.filter((preference) =>
                    PREFERENCE_OPTIONS.includes(preference)
                ) ?? []
            )
            setPreferredTimes(storedForm.preferredTimes ?? [])
        } catch {
            localStorage.removeItem(MATCHING_FORM_STORAGE_KEY)
        } finally {
            setIsStorageReady(true)
        }
    }, [initialDraft])

    useEffect(() => {
        if (!isStorageReady) {
            return
        }

        const storedForm: StoredMatchingForm = {
            sports,
            levels,
            lessonTypes,
            region,
            district,
            budgetMin,
            budgetMax,
            lessonContent,
            suggestedPreferences,
            selectedPreferences,
            preferredTimes,
        }

        localStorage.setItem(MATCHING_FORM_STORAGE_KEY, JSON.stringify(storedForm))
    }, [
        budgetMax,
        budgetMin,
        district,
        isStorageReady,
        lessonContent,
        lessonTypes,
        levels,
        preferredTimes,
        region,
        selectedPreferences,
        sports,
        suggestedPreferences,
    ])

    const districtOptions = useMemo(() => DISTRICTS[region] ?? [], [region])

    const handleRegionChange = (nextRegion: string) => {
        setRegion(nextRegion)
        setDistrict(DISTRICTS[nextRegion]?.[0] ?? '')
    }

    const handleBudgetMinChange = (value: number) => {
        const nextValue = Math.max(0, value)

        setBudgetMin(nextValue)

        if (nextValue > budgetMax) {
            setBudgetMax(nextValue)
        }
    }

    const handleBudgetMaxChange = (value: number) => {
        const nextValue = Math.max(0, value)

        setBudgetMax(nextValue)

        if (nextValue < budgetMin) {
            setBudgetMin(nextValue)
        }
    }

    const handleBudgetRangeChange = (minValue: number, maxValue: number) => {
        setBudgetMin(minValue)
        setBudgetMax(maxValue)
    }

    const toggleSelection = (
        option: string,
        selectedValues: string[],
        setSelectedValues: (values: string[]) => void
    ) => {
        if (selectedValues.includes(option)) {
            if (selectedValues.length === 1) {
                setFormError('레슨 수준과 레슨 유형은 한 개 이상 선택해야 합니다.')
                return
            }

            setSelectedValues(selectedValues.filter((value) => value !== option))
        } else {
            setSelectedValues([...selectedValues, option])
        }

        setFormError('')
    }

    const togglePreferredDay = (day: string) => {
        setPreferredTimes((times) => {
            if (times.some((time) => time.dayOfWeek === day)) {
                return times.filter((time) => time.dayOfWeek !== day)
            }

            return [
                ...times,
                {
                    id: Date.now(),
                    dayOfWeek: day,
                    startTime: '00:00',
                    endTime: '23:59:59',
                },
            ]
        })
        setFormError('')
    }

    const togglePreference = (preference: string) => {
        setSelectedPreferences((preferences) => {
            const nextPreferences = preferences.includes(preference)
                ? preferences.filter((value) => value !== preference)
                : [...preferences, preference]

            setLessonContent((content) => applyPreferencesToContent(content, nextPreferences))

            return nextPreferences
        })
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!user) {
            router.push('/auth/login?redirect=/matching')
            return
        }

        setIsSubmitting(true)
        setFormError('')

        try {
            const client = getAuthClient()
            const submittedTimes =
                preferredTimes.length > 0
                    ? preferredTimes
                    : DAYS_OF_WEEK.map((day, index) => ({
                          id: index,
                          dayOfWeek: day,
                          startTime: '00:00',
                          endTime: '23:59:59',
                      }))

            const finalLessonContent = lessonContent.trim().slice(0, 500)

            const { data, error } = await client.POST('/api/matching', {
                body: {
                    level: levels.map(toStoredLevel).join(','),
                    sports,
                    lessonType: lessonTypes.join(','),
                    region,
                    budgetMin,
                    budgetMax,
                    lessonContent: finalLessonContent,
                    preferredTimes: submittedTimes.map((time) => ({
                        dayOfWeek: time.dayOfWeek,
                        startTime: '00:00:00',
                        endTime: '23:59:59',
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
                    level: levels.join(', '),
                    lessonType: lessonTypes.join(', '),
                    region,
                    district,
                    budgetMin,
                    budgetMax,
                    lessonContent: finalLessonContent,
                    preferredDays: preferredTimes.map((time) => time.dayOfWeek),
                    suggestedPreferences,
                    selectedPreferences,
                })
            )

            localStorage.removeItem(MATCHING_FORM_STORAGE_KEY)
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
                {(initialDraft?.enhancedQuery || suggestedPreferences.length > 0) && (
                    <section className="bg-primary-fixed/25 border border-primary/25 rounded-lg p-md md:p-lg">
                        <div className="flex items-center gap-xs">
                            <span className="material-symbols-outlined text-primary">
                                auto_awesome
                            </span>
                            <h3 className="font-headline-sm text-headline-sm text-on-surface">
                                AI 분석 결과
                            </h3>
                        </div>

                        <dl className="mt-md grid grid-cols-1 gap-sm text-body-sm sm:grid-cols-2">
                            <AnalysisItem label="종목" value={sports} />
                            <AnalysisItem label="지역" value={region} />
                            <AnalysisItem label="레슨 유형" value={lessonTypes.join(', ')} />
                            <AnalysisItem label="레슨 수준" value={levels.join(', ')} />
                            <AnalysisItem
                                label="요일"
                                value={
                                    preferredTimes.length > 0
                                        ? preferredTimes.map((time) => time.dayOfWeek).join(', ')
                                        : '전체'
                                }
                            />
                        </dl>

                        <fieldset className="mt-md border-t border-primary/15 pt-md">
                            <legend className="text-label-md font-label-bold text-on-surface">
                                어떤 점을 중요하게 생각하시나요?
                            </legend>
                            <p className="mt-xs text-body-sm text-on-surface-variant">
                                AI 추천은 주황색, 직접 선택한 항목은 파란색으로 표시됩니다.
                            </p>
                            <div className="mt-sm flex flex-wrap gap-xs">
                                {PREFERENCE_OPTIONS.map((preference) => {
                                    const selected = selectedPreferences.includes(preference)
                                    const recommended = suggestedPreferences.includes(preference)

                                    return (
                                        <button
                                            key={preference}
                                            type="button"
                                            aria-pressed={selected}
                                            onClick={() => togglePreference(preference)}
                                            className={`relative h-9 rounded-full border px-sm text-body-sm transition-colors cursor-pointer ${
                                                selected
                                                    ? 'border-primary bg-primary text-on-primary'
                                                    : recommended
                                                      ? 'border-[#F59E0B] bg-[#FFF7E6] text-[#92400E] font-semibold'
                                                      : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-primary'
                                            }`}
                                        >
                                            {preference}
                                            {selected && (
                                                <span className="material-symbols-outlined ml-1 align-middle text-[16px]">
                                                    check
                                                </span>
                                            )}
                                            {recommended && !selected && (
                                                <span className="ml-1 text-label-sm">AI 추천</span>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        </fieldset>
                    </section>
                )}

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
                        selected={levels}
                        onToggle={(option) => toggleSelection(option, levels, setLevels)}
                    />
                    <ChoiceButtons
                        legend="레슨 유형"
                        options={LESSON_TYPES}
                        selected={lessonTypes}
                        onToggle={(option) => toggleSelection(option, lessonTypes, setLessonTypes)}
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

                    <BudgetSelector
                        minBudget={budgetMin}
                        maxBudget={budgetMax}
                        onMinChange={handleBudgetMinChange}
                        onMaxChange={handleBudgetMaxChange}
                        onRangeChange={handleBudgetRangeChange}
                    />
                </section>

                <section className="overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest shadow-sm">
                    <div className="p-lg md:p-xl">
                        <div className="flex items-start gap-sm">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-fixed text-primary">
                                <span className="material-symbols-outlined">calendar_month</span>
                            </span>
                            <div>
                                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                                    일정 및 목표
                                </h3>
                                <p className="mt-xs text-body-md text-on-surface-variant">
                                    가능한 요일을 선택하지 않으면 모든 요일을 기준으로 추천합니다.
                                </p>
                            </div>
                        </div>

                        <PreferredTimeInput
                            preferredTimes={preferredTimes}
                            onToggle={togglePreferredDay}
                        />

                        <div className="my-lg h-px bg-outline-variant" />

                        <label className="block text-label-lg font-label-bold text-on-surface">
                            AI가 보완한 목표와 요청사항
                            <div className="mt-sm overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                                <textarea
                                    value={lessonContent}
                                    onChange={(event) => setLessonContent(event.target.value)}
                                    maxLength={500}
                                    rows={7}
                                    placeholder="구체적인 목표나 트레이너에게 바라는 점을 입력해 주세요."
                                    className="block w-full resize-none border-0 bg-transparent p-md text-body-md text-on-surface outline-none placeholder:text-outline"
                                />
                                <div className="flex items-center justify-between border-t border-outline-variant bg-surface-container-low px-md py-xs">
                                    <span className="text-label-md font-label-normal text-on-surface-variant">
                                        선택한 선호 조건도 요청사항에 함께 반영됩니다.
                                    </span>
                                    <span className="text-label-md font-label-bold text-outline">
                                        {lessonContent.length}/500
                                    </span>
                                </div>
                            </div>
                        </label>
                    </div>
                </section>
            </div>

            <MatchingSummary
                sports={sports}
                level={levels.join(', ')}
                lessonType={lessonTypes.join(', ')}
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

function AnalysisItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between gap-md rounded-lg bg-surface-container-lowest px-sm py-xs">
            <dt className="text-on-surface-variant">{label}</dt>
            <dd className="font-semibold text-right text-on-surface">{value}</dd>
        </div>
    )
}

type ChoiceButtonsProps = {
    legend: string
    options: string[]
    selected: string[]
    onToggle: (option: string) => void
}

function ChoiceButtons({ legend, options, selected, onToggle }: ChoiceButtonsProps) {
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
                        aria-pressed={selected.includes(option)}
                        onClick={() => onToggle(option)}
                        className={`h-10 px-md rounded-full border text-body-sm transition-colors cursor-pointer ${
                            selected.includes(option)
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

function normalizeLevelLabel(value: string) {
    const trimmedValue = value.trim()

    if (['입문', '초보', '초급', '입문/초보', '입문/초급'].includes(trimmedValue)) {
        return '입문/초급'
    }

    if (['고급', '대회준비', '고급/대회준비'].includes(trimmedValue)) {
        return '고급/대회준비'
    }

    return trimmedValue
}

function toStoredLevel(value: string) {
    if (value === '입문/초급') {
        return '초급'
    }

    if (value === '고급/대회준비') {
        return '고급'
    }

    return value
}

function normalizeLessonTypeLabel(value: string) {
    const normalizedValue = value.trim().replaceAll(' ', '').toUpperCase()

    if (['ONE_TO_ONE', '1:1', '1:1PT', '개인'].includes(normalizedValue)) {
        return '1:1 PT'
    }

    if (['GROUP', '그룹'].includes(normalizedValue)) {
        return '그룹'
    }

    if (['ONLINE', '온라인'].includes(normalizedValue)) {
        return '온라인'
    }

    return value.trim()
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

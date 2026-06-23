'use client'

const MIN_BUDGET = 0
const DEFAULT_MAX_BUDGET = 150000
const BUDGET_STEP = 10000

const BUDGET_PRESETS = [
    { label: '전체', min: 0, max: DEFAULT_MAX_BUDGET },
    { label: '3만원 이하', min: 0, max: 30000 },
    { label: '3만원 ~ 5만원', min: 30000, max: 50000 },
    { label: '5만원 ~ 7만원', min: 50000, max: 70000 },
    { label: '7만원 ~ 10만원', min: 70000, max: 100000 },
    { label: '10만원 이상', min: 100000, max: DEFAULT_MAX_BUDGET },
]

type BudgetSelectorProps = {
    minBudget: number
    maxBudget: number
    onMinChange: (value: number) => void
    onMaxChange: (value: number) => void
    onRangeChange: (minValue: number, maxValue: number) => void
}

const formatPrice = (price: number) => price.toLocaleString('ko-KR')

const formatBudgetLabel = (price: number) => {
    if (price === 0) {
        return '0원'
    }

    const manwon = price / 10000

    if (Number.isInteger(manwon)) {
        return `${manwon}만원`
    }

    return `${manwon.toFixed(1)}만원`
}

const roundUpToStep = (value: number) => {
    return Math.ceil(value / BUDGET_STEP) * BUDGET_STEP
}

export default function BudgetSelector({
    minBudget,
    maxBudget,
    onMinChange,
    onMaxChange,
    onRangeChange,
}: BudgetSelectorProps) {
    const dynamicMaxBudget = Math.max(
        DEFAULT_MAX_BUDGET,
        roundUpToStep(Math.max(minBudget, maxBudget))
    )

    const sliderMin = Math.min(dynamicMaxBudget - BUDGET_STEP, Math.max(MIN_BUDGET, minBudget))

    const sliderMax = Math.max(
        sliderMin + BUDGET_STEP,
        Math.min(dynamicMaxBudget, Math.max(MIN_BUDGET, maxBudget))
    )

    const minPosition = ((sliderMin - MIN_BUDGET) / (dynamicMaxBudget - MIN_BUDGET)) * 100

    const maxPosition = ((sliderMax - MIN_BUDGET) / (dynamicMaxBudget - MIN_BUDGET)) * 100

    const selectedPreset = BUDGET_PRESETS.find(
        (preset) => preset.min === minBudget && preset.max === maxBudget
    )?.label

    const rangeMaxLabel =
        selectedPreset === '10만원 이상'
            ? '10만원 이상'
            : `${formatBudgetLabel(dynamicMaxBudget)} 이상`

    const rangeMiddleLabel = formatBudgetLabel(dynamicMaxBudget / 2)

    return (
        <div className="mt-md">
            <div className="flex flex-wrap items-end justify-between gap-xs">
                <span className="text-label-md font-label-md text-on-surface-variant">
                    1회당 희망 예산
                </span>
                <strong className="text-primary text-body-lg">
                    {formatPrice(minBudget)}원 ~ {formatPrice(maxBudget)}원
                </strong>
            </div>

            <div className="mt-sm grid grid-cols-[1fr_auto_1fr] items-center gap-xs">
                <label>
                    <span className="sr-only">최소 예산</span>
                    <input
                        type="number"
                        min={0}
                        step={1000}
                        value={minBudget}
                        onChange={(event) => onMinChange(Number(event.target.value))}
                        className="h-12 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-sm text-body-md outline-none focus:border-primary"
                    />
                </label>

                <span className="text-outline">-</span>

                <label>
                    <span className="sr-only">최대 예산</span>
                    <input
                        type="number"
                        min={0}
                        step={1000}
                        value={maxBudget}
                        onChange={(event) => onMaxChange(Number(event.target.value))}
                        className="h-12 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-sm text-body-md outline-none focus:border-primary"
                    />
                </label>
            </div>

            <div className="relative mt-lg h-12">
                <div className="absolute inset-x-3 top-1/2 h-1 -translate-y-1/2 rounded-full bg-outline-variant" />

                <div
                    className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-primary"
                    style={{
                        left: `calc(${minPosition}% + 12px)`,
                        right: `calc(${100 - maxPosition}% + 12px)`,
                    }}
                />

                <input
                    aria-label="최소 예산"
                    type="range"
                    min={MIN_BUDGET}
                    max={dynamicMaxBudget - BUDGET_STEP}
                    step={BUDGET_STEP}
                    value={sliderMin}
                    onChange={(event) => {
                        const nextMin = Number(event.target.value)

                        onRangeChange(nextMin, Math.max(nextMin + BUDGET_STEP, sliderMax))
                    }}
                    className="budget-range absolute inset-x-0 top-1 z-10 h-10 w-full"
                />

                <input
                    aria-label="최대 예산"
                    type="range"
                    min={MIN_BUDGET + BUDGET_STEP}
                    max={dynamicMaxBudget}
                    step={BUDGET_STEP}
                    value={sliderMax}
                    onChange={(event) => {
                        const nextMax = Number(event.target.value)

                        onRangeChange(Math.min(sliderMin, nextMax - BUDGET_STEP), nextMax)
                    }}
                    className="budget-range absolute inset-x-0 top-1 z-20 h-10 w-full"
                />
            </div>

            <div className="mt-xs flex justify-between text-label-md text-outline">
                <span>0원</span>
                <span>{rangeMiddleLabel}</span>
                <span>{rangeMaxLabel}</span>
            </div>

            <div className="mt-md grid grid-cols-1 gap-xs sm:grid-cols-2">
                {BUDGET_PRESETS.map((preset) => {
                    const selected = selectedPreset === preset.label

                    return (
                        <button
                            key={preset.label}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => onRangeChange(preset.min, preset.max)}
                            className={`flex h-10 items-center gap-xs rounded-lg px-sm text-left text-body-sm transition-colors ${
                                selected
                                    ? 'bg-primary-fixed text-on-primary-fixed-variant font-semibold'
                                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                            }`}
                        >
                            <span
                                className={`h-4 w-4 rounded-full border ${
                                    selected ? 'border-[5px] border-primary' : 'border-outline'
                                }`}
                            />
                            {preset.label}
                        </button>
                    )
                })}
            </div>

            <style jsx>{`
                .budget-range {
                    pointer-events: none;
                    appearance: none;
                    background: transparent;
                }

                .budget-range::-webkit-slider-runnable-track {
                    height: 4px;
                    background: transparent;
                }

                .budget-range::-webkit-slider-thumb {
                    width: 24px;
                    height: 24px;
                    margin-top: -10px;
                    pointer-events: auto;
                    appearance: none;
                    cursor: grab;
                    border: 3px solid #0b57d0;
                    border-radius: 9999px;
                    background: white;
                    box-shadow: 0 1px 4px rgb(0 0 0 / 18%);
                }

                .budget-range::-moz-range-track {
                    height: 4px;
                    background: transparent;
                }

                .budget-range::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    pointer-events: auto;
                    cursor: grab;
                    border: 3px solid #0b57d0;
                    border-radius: 9999px;
                    background: white;
                    box-shadow: 0 1px 4px rgb(0 0 0 / 18%);
                }
            `}</style>
        </div>
    )
}

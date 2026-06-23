const LESSON_TYPE_LABELS: Record<string, string> = {
    ONE_TO_ONE: '1대1',
    '1:1': '1대1',
    '1:1 PT': '1대1',
    GROUP: '그룹',
    그룹: '그룹',
}

export function formatLessonType(value?: string): string {
    if (!value) return '-'

    return value
        .split(',')
        .map((type) => type.trim())
        .filter(Boolean)
        .map((type) => LESSON_TYPE_LABELS[type] ?? type)
        .join(', ')
}

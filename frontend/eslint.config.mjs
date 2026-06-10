import { FlatCompat } from '@eslint/eslintrc'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
    baseDirectory: __dirname,
})

const eslintConfig = [
    {
        ignores: [
            'src/lib/backend/*/schema.d.ts', // openapi-typescript에 의해서 자동으로 만들어지는 파일들이 저장되는 경로
            'src/components/**', // 추후 샤드CN에 의해서 자동으로 만들어지는 파일들이 저장될 경로
            'src/hooks/**', // 추후 샤드CN에 의해서 자동으로 만들어지는 파일들이 저장될 경로
        ],
    },
    ...compat.extends('next/core-web-vitals', 'next/typescript'),
]

export default eslintConfig

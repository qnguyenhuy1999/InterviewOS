import sharedConfig from '@interviewos/eslint-config'
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'

const nextConfigWithoutTypescript = nextCoreWebVitals.filter((config) => config.name !== 'next/typescript')

const webEslintConfig = [
  ...sharedConfig,
  ...nextConfigWithoutTypescript,
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
]

export default webEslintConfig

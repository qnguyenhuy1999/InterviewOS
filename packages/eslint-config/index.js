// @ts-check
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      '**/.next/**',
      '**/dist/**',
      '**/storybook-static/**',
      '**/node_modules/**',
      '**/next-env.d.ts',
    ],
  },
  ...tseslint.configs.recommended,
  {
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      'no-console': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  {
    files: ['apps/web/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@interviewos/database',
              message: 'apps/web must not import database code directly.',
            },
            {
              name: '@interviewos/api',
              message: 'apps/web must not import API app code directly.',
            },
          ],
          patterns: [
            {
              group: ['apps/api', 'apps/api/*'],
              message: 'apps/web must not import from apps/api.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['apps/api/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@interviewos/ui',
              message: 'apps/api must not depend on UI package code.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['packages/ui/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['apps/*', 'apps/*/*'],
              message: 'packages/ui must not import from apps.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['packages/types/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@interviewos/database',
              message: 'packages/types must stay framework-agnostic.',
            },
            { name: '@interviewos/ui', message: 'packages/types must stay framework-agnostic.' },
            { name: 'react', message: 'packages/types must not depend on React.' },
            { name: 'next', message: 'packages/types must not depend on Next.js.' },
          ],
          patterns: [
            { group: ['apps/*', 'apps/*/*'], message: 'packages/types must not import from apps.' },
            { group: ['next/*'], message: 'packages/types must not depend on Next.js.' },
            { group: ['react/*'], message: 'packages/types must not depend on React.' },
            { group: ['@nestjs/*'], message: 'packages/types must not depend on NestJS.' },
            { group: ['@prisma/*'], message: 'packages/types must not depend on Prisma.' },
          ],
        },
      ],
    },
  },
  {
    files: ['packages/utils/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: '@interviewos/ui', message: 'packages/utils must stay framework-agnostic.' },
            {
              name: '@interviewos/database',
              message: 'packages/utils must stay framework-agnostic.',
            },
            { name: 'react', message: 'packages/utils must not depend on React.' },
            { name: 'next', message: 'packages/utils must not depend on Next.js.' },
          ],
          patterns: [
            { group: ['apps/*', 'apps/*/*'], message: 'packages/utils must not import from apps.' },
            { group: ['next/*'], message: 'packages/utils must not depend on Next.js.' },
            { group: ['react/*'], message: 'packages/utils must not depend on React.' },
            { group: ['@nestjs/*'], message: 'packages/utils must not depend on NestJS.' },
            { group: ['@prisma/*'], message: 'packages/utils must not depend on Prisma.' },
          ],
        },
      ],
    },
  },
)

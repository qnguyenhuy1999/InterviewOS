export const APP_NAME = 'InterviewOS'
export const API_VERSION = 'v1'
export const DEFAULT_PORT = 3001
export const API_BASE_PATH = '/api/v1'

export const ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  USERS: {
    PROFILE: '/users/profile',
    LEARNING_PROFILE: '/users/learning-profile',
  },
  NOTES: {
    BASE: '/notes',
    BY_ID: '/notes/:id',
    GENERATE: '/notes/generate',
    IMPROVE: '/notes/:id/improve',
    QUESTIONS: '/notes/:id/questions',
  },
  INTERVIEWS: {
    BASE: '/interviews',
    BY_ID: '/interviews/:id',
    ANSWER: '/interviews/:id/answers',
  },
  ENGLISH: {
    BASE: '/english',
    ANALYZE: '/english/analyze',
  },
  RECOMMENDATIONS: {
    BASE: '/recommendations',
  },
  RESUME: {
    UPLOAD: '/resume/upload',
    LATEST: '/resume/latest',
  },
} as const

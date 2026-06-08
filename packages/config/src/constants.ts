export const APP_NAME = 'InterviewOS'
export const API_VERSION = 'v1'
export const DEFAULT_PORT = 3001
export const API_BASE_PATH = '/api/v1'

export const API_ROUTES = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    logoutAll: '/auth/logout-all',
    me: '/auth/me',
    sessions: '/auth/sessions',
    sessionById: (sessionId: string) => `/auth/sessions/${sessionId}`,
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    resendEmailVerification: '/auth/email-verification/resend',
    confirmEmailVerification: '/auth/email-verification/confirm',
  },
  users: {
    me: '/users/me',
    learningProfile: '/users/me/profile',
  },
  notes: {
    list: '/notes',
    byId: (noteId: string) => `/notes/${noteId}`,
    generate: (noteId: string) => `/notes/${noteId}/generate`,
    questions: (noteId: string) => `/notes/${noteId}/questions`,
  },
  sessions: {
    list: '/sessions',
    multiTurn: '/sessions/multi-turn',
    byId: (sessionId: string) => `/sessions/${sessionId}`,
    answer: (sessionId: string) => `/sessions/${sessionId}/answer`,
    turns: (sessionId: string) => `/sessions/${sessionId}/turns`,
    end: (sessionId: string) => `/sessions/${sessionId}/end`,
    evaluation: (sessionId: string) => `/sessions/${sessionId}/evaluation`,
  },
  review: {
    queue: '/review',
    rate: (reviewItemId: string) => `/review/${reviewItemId}/rate`,
    learningPath: '/learning-path',
    learningPathAction: (itemId: string) => `/learning-path/${itemId}/action`,
    weakConcepts: '/weak-concepts',
    weakConceptStatus: (weakConceptId: string) => `/weak-concepts/${weakConceptId}/status`,
  },
  readiness: {
    current: '/readiness',
    history: '/readiness/history',
    compute: '/readiness/compute',
  },
  englishNotes: {
    list: '/english-notes',
    updateStatus: (englishNoteId: string) => `/english-notes/${englishNoteId}/status`,
  },
  analytics: {
    progress: '/analytics/progress',
    interviews: '/analytics/interviews',
  },
  recommendations: {
    list: '/recommendations',
  },
  resume: {
    upload: '/resume/upload',
    latest: '/resume/latest',
  },
  companyModes: {
    list: '/company-modes',
    bySlug: (slug: string) => `/company-modes/${slug}`,
  },
} as const

export const ROUTES = API_ROUTES

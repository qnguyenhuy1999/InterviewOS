export interface ScoreBreakdown {
  dimension: string
  score: number
  weight: number
  label: string
  trend: 'UP' | 'DOWN' | 'STABLE'
}

export interface ReadinessSnapshot {
  id: string
  userId: string
  overallScore: number
  confidenceLevel: number
  technicalMastery: number
  interviewPerformance: number
  behavioralPerformance: number
  systemDesignPerformance: number
  englishCommunication: number
  reviewCompletion: number
  learningProgress: number
  breakdown: ScoreBreakdown[]
  improvementTrend: number
  computedAt: Date
}

export interface ReadinessImpactBreakdown {
  overallDelta: number
  technicalDelta: number
  behavioralDelta: number
  systemDesignDelta: number
  communicationDelta: number
  consistencyDelta: number
}

export interface ReadinessHistoryView {
  id: string
  overallScore: number
  improvementTrend: number
  computedAt: Date
}

export interface ReadinessPageView {
  title: string
  subtitle: string
  recomputeLabel: string
  latest: ReadinessSnapshot
  history: ReadinessHistoryView[]
}

import type {
  EnglishLevel,
  ExperienceLevel,
  LearningStateInput,
  UserWeakConcept,
} from '@interviewos/types'
import { ExplanationDepth } from '@interviewos/types'
import { Injectable } from '@nestjs/common'

export type UserLearningProfile = {
  targetLevel: ExperienceLevel
  englishLevel: EnglishLevel
  techStack: string[]
  targetRole?: string
  interviewGoals: string[]
  weakConcepts: UserWeakConcept[]
  explanationDepth?: ExplanationDepth
}

export type AIContext = {
  learningState: LearningStateInput
  explanationDepth: ExplanationDepth
}

@Injectable()
export class AIContextBuilder {
  build(profile: UserLearningProfile): AIContext {
    return {
      learningState: this.buildLearningState(profile),
      explanationDepth: profile.explanationDepth ?? this.inferDepth(profile),
    }
  }

  private buildLearningState(profile: UserLearningProfile): LearningStateInput {
    return {
      targetLevel: profile.targetLevel,
      englishLevel: profile.englishLevel,
      techStack: profile.techStack,
      targetRole: profile.targetRole,
      interviewGoals: profile.interviewGoals,
      activeWeakConcepts: profile.weakConcepts
        .filter((c) => c.status === 'ACTIVE' || c.status === 'IMPROVING')
        .map((c) => c.concept),
      weakConceptCount: profile.weakConcepts.length,
    }
  }

  // Infer explanation depth from level when not explicitly set
  private inferDepth(profile: UserLearningProfile): ExplanationDepth {
    switch (profile.targetLevel) {
      case 'JUNIOR':
        return ExplanationDepth.STANDARD
      case 'MID':
        return ExplanationDepth.STANDARD
      case 'SENIOR':
        return ExplanationDepth.DEEP
      case 'STAFF':
      case 'PRINCIPAL':
        return ExplanationDepth.INTERVIEW
      default:
        return ExplanationDepth.STANDARD
    }
  }
}

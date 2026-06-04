import type {
  AnalyzeResumeInput,
  BehavioralEvalInput,
  ConductTurnInput,
  EvaluateInterviewAnswerInput,
  GenerateEnglishFeedbackInput,
  GenerateQuestionsFromNoteInput,
  GenerateTechnicalNoteInput,
  ReadinessComputeInput,
  RecommendNextLearningInput,
  SessionEvalInput,
  SystemDesignEvalInput,
} from '@interviewos/types'

export type PromptDefinition = {
  id: string
  version: string
  instructions: string
  prompt: string
}

export const promptCatalog = {
  technicalNote: 'technical-note.v1',
  generatedQuestions: 'generated-questions.v1',
  interviewEvaluation: 'interview-evaluation.v1',
  englishFeedback: 'english-feedback.v1',
  learningRecommendations: 'learning-recommendations.v1',
  resumeAnalysis: 'resume-analysis.v1',
  conductTurn: 'conduct-turn.v1',
  behavioralEval: 'behavioral-eval.v1',
  systemDesignEval: 'system-design-eval.v1',
  sessionEvaluation: 'session-evaluation.v1',
  readinessScore: 'readiness-score.v1',
} as const

export function technicalNotePrompt(input: GenerateTechnicalNoteInput): PromptDefinition {
  return {
    id: promptCatalog.technicalNote,
    version: 'v1',
    instructions:
      'You are InterviewOS. Produce concise, production-oriented technical interview study notes. Return only schema-compliant JSON.',
    prompt: [
      `Topic: ${input.topic}`,
      `Note type: ${input.noteType}`,
      `Target role: ${input.targetRole}`,
      `Target level: ${input.targetLevel}`,
      `English level: ${input.englishLevel}`,
      `Tech stack: ${(input.techStack ?? []).join(', ') || 'None provided'}`,
      `Interview goals: ${(input.interviewGoals ?? []).join(', ') || 'None provided'}`,
      `Preferred output style: ${input.preferredOutputStyle ?? 'Practical and clear'}`,
      `Additional context: ${input.additionalContext ?? 'None provided'}`,
    ].join('\n'),
  }
}

export function generatedQuestionsPrompt(input: GenerateQuestionsFromNoteInput): PromptDefinition {
  return {
    id: promptCatalog.generatedQuestions,
    version: 'v1',
    instructions:
      'Generate interview questions from the provided technical note. Return only schema-compliant JSON. Questions must be practical and role-appropriate.',
    prompt: [
      `Note ID: ${input.noteId}`,
      `Title: ${input.title}`,
      `Preferred difficulty: ${input.difficulty ?? 'MEDIUM'}`,
      `Question count: ${input.count ?? 5}`,
      `Structured content: ${JSON.stringify(input.content)}`,
    ].join('\n'),
  }
}

export function interviewEvaluationPrompt(
  input: EvaluateInterviewAnswerInput,
): PromptDefinition {
  return {
    id: promptCatalog.interviewEvaluation,
    version: 'v1',
    instructions:
      'Evaluate the interview answer for technical depth, clarity, and interview readiness. Return only schema-compliant JSON.',
    prompt: [
      `Question: ${input.question}`,
      `Candidate answer: ${input.answer}`,
      `Expected concepts: ${input.expectedConcepts.join(', ')}`,
      `Source section: ${input.sourceSection}`,
      `Target level: ${input.targetLevel}`,
    ].join('\n'),
  }
}

export function englishFeedbackPrompt(input: GenerateEnglishFeedbackInput): PromptDefinition {
  return {
    id: promptCatalog.englishFeedback,
    version: 'v1',
    instructions:
      'Review the candidate answer for spoken-English interview quality. Return only schema-compliant JSON.',
    prompt: [`Target English level: ${input.targetLevel}`, `Answer: ${input.text}`].join('\n'),
  }
}

export function learningRecommendationsPrompt(
  input: RecommendNextLearningInput,
): PromptDefinition {
  return {
    id: promptCatalog.learningRecommendations,
    version: 'v1',
    instructions:
      'Recommend the next learning actions for this interview candidate. Return only schema-compliant JSON.',
    prompt: [
      `User ID: ${input.userId}`,
      `Current level: ${input.currentLevel}`,
      `Tech stack: ${input.techStack.join(', ')}`,
      `Recent topics: ${input.recentTopics.join(', ')}`,
      `Weak concepts: ${input.weakConcepts.join(', ')}`,
    ].join('\n'),
  }
}

export function resumeAnalysisPrompt(input: AnalyzeResumeInput): PromptDefinition {
  return {
    id: promptCatalog.resumeAnalysis,
    version: 'v1',
    instructions:
      'Analyze the resume against the target role. Return only schema-compliant JSON.',
    prompt: [
      `Target role: ${input.targetRole}`,
      `Target level: ${input.targetLevel}`,
      `Resume text: ${input.resumeText}`,
    ].join('\n'),
  }
}

export function conductTurnPrompt(input: ConductTurnInput): PromptDefinition {
  const history = input.conversationHistory
    .slice(-8)
    .map((t: ConductTurnInput['conversationHistory'][number]) => `[${t.role}] ${t.content}`)
    .join('\n')
  const persona = input.companyModeConfig?.interviewerPersona ?? 'You are a senior technical interviewer.'
  return {
    id: promptCatalog.conductTurn,
    version: 'v1',
    instructions: `${persona} Decide how to respond to the candidate's latest answer. Return only schema-compliant JSON.`,
    prompt: [
      `Session type: ${input.sessionType}`,
      `Candidate level: ${input.userProfile.level}`,
      `Role: ${input.userProfile.role}`,
      `Stack: ${input.userProfile.stack.join(', ')}`,
      `Conversation (last 8 turns):\n${history}`,
      `Latest answer: ${input.candidateAnswer}`,
    ].join('\n'),
  }
}

export function behavioralEvalPrompt(input: BehavioralEvalInput): PromptDefinition {
  const conversation = input.conversation
    .map((t: BehavioralEvalInput['conversation'][number]) => `[${t.role}] ${t.content}`)
    .join('\n')
  return {
    id: promptCatalog.behavioralEval,
    version: 'v1',
    instructions:
      'Evaluate the candidate answer using the STAR framework. Score each dimension 0-10. Return only schema-compliant JSON.',
    prompt: [`Question: ${input.question}`, `Conversation:\n${conversation}`].join('\n'),
  }
}

export function systemDesignEvalPrompt(input: SystemDesignEvalInput): PromptDefinition {
  const conversation = input.conversation
    .map((t: SystemDesignEvalInput['conversation'][number]) => `[${t.role}] ${t.content}`)
    .join('\n')
  return {
    id: promptCatalog.systemDesignEval,
    version: 'v1',
    instructions:
      'Evaluate the system design discussion. Score each dimension 0-10. Return only schema-compliant JSON.',
    prompt: [
      `Question: ${input.question}`,
      `Seniority: ${input.seniorityLevel}`,
      `Conversation:\n${conversation}`,
    ].join('\n'),
  }
}

export function sessionEvaluationPrompt(input: SessionEvalInput): PromptDefinition {
  const conversation = input.conversation
    .map((t: SessionEvalInput['conversation'][number]) => `[${t.role}] ${t.content}`)
    .join('\n')
  return {
    id: promptCatalog.sessionEvaluation,
    version: 'v1',
    instructions:
      'Generate a comprehensive session evaluation. Return only schema-compliant JSON.',
    prompt: [
      `Session type: ${input.sessionType}`,
      `Question: ${input.question}`,
      `Candidate level: ${input.userProfile.level}`,
      `Role: ${input.userProfile.role}`,
      `Full conversation:\n${conversation}`,
    ].join('\n'),
  }
}

export function readinessScorePrompt(input: ReadinessComputeInput): PromptDefinition {
  return {
    id: promptCatalog.readinessScore,
    version: 'v1',
    instructions:
      'Compute interview readiness from the dimension scores and generate improvement areas. Return only schema-compliant JSON.',
    prompt: [
      `Technical mastery: ${input.technicalMastery}`,
      `Interview performance: ${input.interviewPerformance}`,
      `Behavioral performance: ${input.behavioralPerformance}`,
      `System design performance: ${input.systemDesignPerformance}`,
      `English communication: ${input.englishCommunication}`,
      `Review completion: ${input.reviewCompletion}`,
      `Learning progress: ${input.learningProgress}`,
      `Total sessions: ${input.sessionCount}`,
    ].join('\n'),
  }
}

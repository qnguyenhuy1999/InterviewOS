import type {
  AnalyzeResumeInput,
  EvaluateInterviewAnswerInput,
  GenerateEnglishFeedbackInput,
  GenerateQuestionsFromNoteInput,
  GenerateTechnicalNoteInput,
  RecommendNextLearningInput,
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

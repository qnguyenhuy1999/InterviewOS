import type { TechnicalNoteDetailView } from '@interviewos/types'
import { FileQuestionIcon } from 'lucide-react'

import { EmptyState } from '../../../../components/ui/page'
import { QuestionCard } from '../../../molecules/QuestionCard/QuestionCard'
import { NoteSection } from '../../../organisms/NoteSection/NoteSection'
import { getDifficultyTone } from '../../NotebookPage/NotebookPage.utils'
import type { NotebookDetailPageProps } from '../NotebookDetailPage.types'
import { getNotebookQuestionConceptSummary } from '../NotebookDetailPage.utils'

function PracticeQuestions({
  data,
  renderQuestionActions,
}: {
  data: TechnicalNoteDetailView
  renderQuestionActions?: NotebookDetailPageProps['renderQuestionActions']
}) {
  return (
    <NoteSection
      id="practice-questions"
      title="Practice questions"
      description="Drill the note once the mental model is clear."
      tone="muted"
    >
      {data.generatedQuestions.length > 0 ? (
        <div className="space-y-3">
          {data.generatedQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              title={question.question}
              description={question.expectedAnswer}
              difficulty={getDifficultyTone(question.difficulty)}
              badges={[question.category, question.sourceSection]}
              footer={`Concepts: ${getNotebookQuestionConceptSummary(question)}`}
              action={renderQuestionActions ? renderQuestionActions(question.id) : undefined}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          className="border-dashed min-h-48 bg-background"
          icon={FileQuestionIcon}
          title="No generated questions yet"
          description="Generate a question set when the note is ready for rehearsal."
        />
      )}
    </NoteSection>
  )
}

export { PracticeQuestions }

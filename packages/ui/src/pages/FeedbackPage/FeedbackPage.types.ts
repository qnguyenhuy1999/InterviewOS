import type { FeedbackSection } from '../../organisms/FeedbackFormPanel'

export interface FeedbackPageProps {
  sections: FeedbackSection[]
  onChange: (sectionId: string, fieldId: string, value: string | number) => void
  onSubmit: () => void
  isDraft?: boolean
}

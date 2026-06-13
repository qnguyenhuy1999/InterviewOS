export type SaveStatus = 'saved' | 'saving' | 'unsaved'

export interface NotesPadProps {
  sessionId: string
  initialContent?: string
  onChange: (text: string) => void
  className?: string
}

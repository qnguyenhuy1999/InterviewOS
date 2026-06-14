import type { SetupStep } from '../../layouts/SetupLayout'
import { SetupLayout } from '../../layouts/SetupLayout'
import type { InterviewSetupPageProps } from './InterviewSetupPage.types'

const STEPS: SetupStep[] = [
  { id: 'role-config', label: 'Role Config', status: 'current' },
  { id: 'question-bank', label: 'Question Bank', status: 'pending' },
  { id: 'scoring-rubric', label: 'Scoring Rubric', status: 'pending' },
  { id: 'review-start', label: 'Review & Start', status: 'pending' },
]

function stepsWithCurrent(currentStep: string): SetupStep[] {
  let passed = false
  return STEPS.map((s) => {
    if (s.id === currentStep) {
      passed = true
      return { ...s, status: 'current' as const }
    }
    if (!passed) return { ...s, status: 'completed' as const }
    return { ...s, status: 'pending' as const }
  })
}

export function InterviewSetupPage({ currentStep = 'role-config' }: InterviewSetupPageProps) {
  const steps = stepsWithCurrent(currentStep)
  return (
    <SetupLayout steps={steps} currentStep={currentStep}>
      {currentStep === 'role-config' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Role Configuration</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Role Title</label>
              <input
                type="text"
                defaultValue="Senior Frontend Engineer"
                className="w-full rounded-md border px-3 py-2 text-sm"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Interview Type</label>
              <select className="w-full rounded-md border px-3 py-2 text-sm">
                <option>Technical</option>
                <option>Behavioral</option>
                <option>System Design</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
              <input
                type="number"
                defaultValue={60}
                className="w-full rounded-md border px-3 py-2 text-sm"
                readOnly
              />
            </div>
          </div>
        </div>
      )}
      {currentStep === 'question-bank' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Question Bank</h2>
          <div className="space-y-3">
            {[
              'What is the virtual DOM?',
              'Explain React reconciliation',
              'Describe CSS specificity',
              'How does event delegation work?',
              'What are React hooks rules?',
            ].map((q, i) => (
              <div key={i} className="flex items-center gap-3 rounded-md border p-3">
                <input type="checkbox" defaultChecked className="h-4 w-4" readOnly />
                <span className="text-sm">{q}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {currentStep === 'scoring-rubric' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Scoring Rubric</h2>
          {['Technical Knowledge', 'Communication', 'Problem Solving'].map((section) => (
            <div key={section} className="rounded-md border p-4 space-y-2">
              <h3 className="font-medium">{section}</h3>
              <p className="text-sm text-gray-500">Scored 1–5 per criterion</p>
            </div>
          ))}
        </div>
      )}
      {currentStep === 'review-start' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Review & Start</h2>
          <div className="rounded-md border p-4 space-y-2">
            <p className="text-sm">
              <span className="font-medium">Role:</span> Senior Frontend Engineer
            </p>
            <p className="text-sm">
              <span className="font-medium">Questions:</span> 5 selected
            </p>
            <p className="text-sm">
              <span className="font-medium">Scoring sections:</span> 3
            </p>
          </div>
          <button className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white">
            Start Interview
          </button>
        </div>
      )}
    </SetupLayout>
  )
}

export default InterviewSetupPage

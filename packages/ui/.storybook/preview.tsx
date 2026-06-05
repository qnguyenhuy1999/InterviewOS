import '../src/globals.css'

import type { Preview } from '@storybook/react-vite'

import { TooltipProvider } from '../components/ui/tooltip'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
    viewport: {
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '375px', height: '812px' } },
        tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
        desktop: { name: 'Desktop', styles: { width: '1440px', height: '900px' } },
      },
    },
  },
  decorators: [
    (Story) => (
      <TooltipProvider delayDuration={0}>
        <div className="bg-background text-foreground antialiased">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
}

export default preview

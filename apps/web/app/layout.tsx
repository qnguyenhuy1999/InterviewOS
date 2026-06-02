import './globals.css'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'InterviewOS',
  description: 'Interview preparation platform for software engineers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}

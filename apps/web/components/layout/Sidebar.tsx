'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/onboarding', label: 'Onboarding' },
  { href: '/notebook', label: 'Notebook' },
  { href: '/interview', label: 'Interview' },
  { href: '/english-notes', label: 'English Notes' },
  { href: '/learning-path', label: 'Learning Path' },
  { href: '/resume', label: 'Resume' },
  { href: '/settings', label: 'Settings' },
] as const

export function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-3 z-40 block rounded-md p-2 hover:bg-accent md:hidden"
        aria-label="Open navigation"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setOpen(false)} />
      )}

      <aside
        data-open={open || undefined}
        className="fixed inset-y-0 left-0 z-50 w-64 -translate-x-full border-r border-border bg-sidebar p-4 transition-transform data-open:translate-x-0 md:static md:z-auto md:translate-x-0"
      >
        <div className="mb-6 flex items-center justify-between">
          <Link href="/dashboard" className="font-heading text-lg font-bold">
            InterviewOS
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="rounded-md p-1 hover:bg-accent md:hidden"
            aria-label="Close navigation"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-md px-3 py-2 text-sm transition-colors ${
                  active
                    ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}

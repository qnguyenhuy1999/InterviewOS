import { useEffect, useState } from 'react'
import { Group, Panel, Separator, usePanelRef } from 'react-resizable-panels'
import type { PanelImperativeHandle } from 'react-resizable-panels'

import { cn } from '../../../lib/utils'
import type { InterviewLayoutProps } from './InterviewLayout.types'

const MOBILE_BREAKPOINT = 1024
const LEFT_ICON_RAIL_PX = 40
const LEFT_COLLAPSE_THRESHOLD_PX = 200

export function InterviewLayout({
  topBar,
  leftPanel,
  centerPanel,
  rightPanel,
  defaultLeftWidth = 280,
  defaultRightWidth = 320,
}: InterviewLayoutProps) {
  const leftPanelRef = usePanelRef()
  const rightPanelRef = usePanelRef()
  const [leftCollapsed, setLeftCollapsed] = useState(false)
  const [isRightDrawerOpen, setIsRightDrawerOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    setIsMobile(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
        return

      if (e.key === '[' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault()
        const panel = leftPanelRef.current as PanelImperativeHandle | null
        if (!panel) return
        panel.isCollapsed() ? panel.expand() : panel.collapse()
      }

      if (e.key === ']' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault()
        if (isMobile) {
          setIsRightDrawerOpen((v) => !v)
        } else {
          const panel = rightPanelRef.current as PanelImperativeHandle | null
          if (!panel) return
          panel.isCollapsed() ? panel.expand() : panel.collapse()
        }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isMobile, leftPanelRef, rightPanelRef])

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[var(--color-surface-base)]">
      <div
        className={cn(
          'flex h-12 shrink-0 items-center border-b border-[var(--color-border-interview)]',
          'bg-[var(--color-surface-raised)] px-3',
        )}
      >
        {topBar}
      </div>

      <div className="relative min-h-0 flex-1">
        {isMobile ? (
          <>
            <Group orientation="horizontal" className="h-full">
              <Panel
                panelRef={leftPanelRef}
                defaultSize={`${defaultLeftWidth}px`}
                minSize={`${LEFT_ICON_RAIL_PX}px`}
                collapsible
                collapsedSize={`${LEFT_ICON_RAIL_PX}px`}
                onResize={(size) => {
                  setLeftCollapsed(size.inPixels <= LEFT_ICON_RAIL_PX + 4)
                }}
                className={cn(
                  'border-r border-[var(--color-border-interview)]',
                  leftCollapsed && 'overflow-hidden',
                )}
              >
                <div className="h-full overflow-hidden">{leftPanel}</div>
              </Panel>

              <Separator
                className={cn(
                  'w-1 cursor-col-resize bg-[var(--color-border-interview)]',
                  'transition-colors hover:bg-[var(--color-accent-teal)]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-teal)]',
                )}
              />

              <Panel minSize={`${LEFT_COLLAPSE_THRESHOLD_PX}px`} className="min-w-0">
                <div className="h-full overflow-auto">{centerPanel}</div>
              </Panel>
            </Group>

            <div
              className={cn(
                'absolute inset-y-0 right-0 z-20 w-80',
                'border-l border-[var(--color-border-interview)] bg-[var(--color-surface-raised)]',
                'shadow-[var(--shadow-interview-lg)]',
                'transition-transform duration-[var(--duration-normal)] ease-[var(--ease-out-expo)]',
                isRightDrawerOpen ? 'translate-x-0' : 'translate-x-full',
              )}
              aria-hidden={!isRightDrawerOpen}
            >
              {rightPanel}
            </div>

            {isRightDrawerOpen && (
              <div
                className="absolute inset-0 z-10 bg-black/20"
                aria-hidden="true"
                onClick={() => setIsRightDrawerOpen(false)}
              />
            )}
          </>
        ) : (
          <Group orientation="horizontal" className="h-full">
            <Panel
              panelRef={leftPanelRef}
              defaultSize={`${defaultLeftWidth}px`}
              minSize={`${LEFT_ICON_RAIL_PX}px`}
              collapsible
              collapsedSize={`${LEFT_ICON_RAIL_PX}px`}
              onResize={(size) => {
                setLeftCollapsed(size.inPixels <= LEFT_ICON_RAIL_PX + 4)
              }}
              className={cn(
                'border-r border-[var(--color-border-interview)]',
                leftCollapsed && 'overflow-hidden',
              )}
            >
              <div
                className={cn(
                  'h-full overflow-hidden transition-all',
                  leftCollapsed && 'flex items-start justify-center',
                )}
              >
                {leftPanel}
              </div>
            </Panel>

            <Separator
              className={cn(
                'w-1 cursor-col-resize bg-[var(--color-border-interview)]',
                'transition-colors hover:bg-[var(--color-accent-teal)]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-teal)]',
              )}
            />

            <Panel minSize="200px" className="min-w-0">
              <div className="h-full overflow-auto">{centerPanel}</div>
            </Panel>

            <Separator
              className={cn(
                'w-1 cursor-col-resize bg-[var(--color-border-interview)]',
                'transition-colors hover:bg-[var(--color-accent-teal)]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-teal)]',
              )}
            />

            <Panel
              panelRef={rightPanelRef}
              defaultSize={`${defaultRightWidth}px`}
              minSize={`${LEFT_ICON_RAIL_PX}px`}
              collapsible
              collapsedSize={`${LEFT_ICON_RAIL_PX}px`}
              className="border-l border-[var(--color-border-interview)]"
            >
              <div className="h-full overflow-auto">{rightPanel}</div>
            </Panel>
          </Group>
        )}
      </div>
    </div>
  )
}

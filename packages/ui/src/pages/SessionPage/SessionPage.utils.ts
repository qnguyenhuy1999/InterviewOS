import { format, formatDistanceToNowStrict, isToday, isYesterday } from 'date-fns'
import { MonitorIcon, SmartphoneIcon } from 'lucide-react'

import type { LucideIcon } from 'lucide-react'

import {
  SESSION_PAGE_ACTIVE_NOW_LABEL,
  SESSION_PAGE_UNKNOWN_DEVICE_LABEL,
} from './SessionPage.constants'
import type { SessionPageSession } from './SessionPage.types'

type SessionDevicePresentation = {
  deviceLabel: string
  browserLabel: string
  icon: LucideIcon
}

function getBrowserLabel(userAgent: string) {
  if (/firefox/i.test(userAgent)) {
    return 'Firefox'
  }

  if (/edg/i.test(userAgent)) {
    return 'Edge'
  }

  if (/chrome/i.test(userAgent) && !/edg/i.test(userAgent)) {
    return 'Chrome'
  }

  if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) {
    return 'Safari'
  }

  return 'Browser'
}

function getBrowserVersion(userAgent: string, browserLabel: string) {
  const patterns: Record<string, RegExp> = {
    Chrome: /Chrome\/(\d+)/i,
    Edge: /Edg\/(\d+)/i,
    Firefox: /Firefox\/(\d+)/i,
    Safari: /Version\/(\d+)/i,
  }

  const match = patterns[browserLabel]?.exec(userAgent)

  return match ? `${browserLabel} ${match[1]}` : browserLabel
}

function getDeviceLabel(userAgent: string) {
  if (/iphone/i.test(userAgent)) {
    return 'iPhone'
  }

  if (/ipad/i.test(userAgent)) {
    return 'iPad'
  }

  if (/macintosh|mac os x/i.test(userAgent)) {
    return 'MacBook Pro'
  }

  if (/windows/i.test(userAgent)) {
    return 'Windows'
  }

  if (/android/i.test(userAgent)) {
    return 'Android device'
  }

  if (/linux/i.test(userAgent)) {
    return 'Linux device'
  }

  return SESSION_PAGE_UNKNOWN_DEVICE_LABEL
}

export function getSessionDevicePresentation(session: SessionPageSession): SessionDevicePresentation {
  const userAgent = session.userAgent ?? ''
  const deviceLabel = getDeviceLabel(userAgent)
  const browserLabel = getBrowserVersion(userAgent, getBrowserLabel(userAgent))
  const icon = /iphone|ipad|android|mobile/i.test(userAgent) ? SmartphoneIcon : MonitorIcon

  return {
    deviceLabel,
    browserLabel,
    icon,
  }
}

export function formatSessionLastSeenLabel(lastSeenAt: Date | null) {
  if (lastSeenAt === null) {
    return SESSION_PAGE_ACTIVE_NOW_LABEL
  }

  if (isToday(lastSeenAt)) {
    return `${formatDistanceToNowStrict(lastSeenAt)} ago`
  }

  if (isYesterday(lastSeenAt)) {
    return 'Yesterday'
  }

  return format(lastSeenAt, 'MMM d, yyyy')
}

export function formatSessionCreatedLabel(createdAt: Date) {
  return format(createdAt, 'MMM d, yyyy')
}

export function getSessionSummary(sessions: SessionPageSession[]) {
  const currentSession = sessions.find((session) => session.isCurrent)

  return {
    total: sessions.length,
    currentSessionId: currentSession?.id ?? null,
    currentSessionLabel: currentSession ? getSessionDevicePresentation(currentSession).deviceLabel : null,
  }
}

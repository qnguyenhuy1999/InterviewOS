export const SESSION_PAGE_UNKNOWN_DEVICE_LABEL = 'Unknown device'
export const SESSION_PAGE_UNKNOWN_IP_LABEL = 'Unknown IP'
export const SESSION_PAGE_ACTIVE_NOW_LABEL = 'Active now'

export const SESSION_PAGE_SECURITY_TIPS = [
  {
    title: 'After shared computers',
    body: 'Review devices after interviews on shared or borrowed machines — they may stay signed in longer than expected.',
  },
  {
    title: 'Unfamiliar browsers',
    body: 'Revoke any device you do not recognise, especially if it has been inactive for several days.',
  },
  {
    title: 'After credential changes',
    body: 'Use "Log out everywhere" after rotating credentials or changing your primary auth method.',
  },
] as const

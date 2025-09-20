import { Timer } from '@repo/types'

import { db } from '@/lib/instant'

export function useTimersQuery() {
  const { data, isLoading, error } = db.useQuery({
    timers: {
      project: {},
      owner: {}
    }
  })

  // Get active timer (one that hasn't been finished)
  const activeTimer = data?.timers?.find((timer: Timer) => timer.finishedAt === null || timer.finishedAt === undefined)

  return {
    timers: data?.timers || [],
    activeTimer,
    isLoading,
    error
  }
}
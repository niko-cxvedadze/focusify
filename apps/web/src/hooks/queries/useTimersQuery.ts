import { db } from '@/lib/instant'

export function useTimersQuery() {
  const { data, isLoading, error } = db.useQuery({
    timers: {
      $: {
        where: { finishedAt: { $isNull: true } }
      }
    }
  })

  const activeTimer = data?.timers?.[0] || undefined

  return {
    activeTimer,
    timers: data?.timers ?? [],
    isLoading,
    error
  }
}

export async function getTimerById(timerId: string) {
  const { data } = await db.queryOnce({
    timers: {
      $: {
        where: { id: timerId }
      }
    }
  })

  return data?.timers?.[0] || null
}
import { db } from '@/lib/instant'

export function useReportedTimesQuery(projectId?: string) {
  // Use two different query structures to avoid TypeScript issues
  const { data, isLoading, error } = projectId
    ? db.useQuery({ reportedTimes: { $: { where: { projectId: projectId } } } })
    : db.useQuery({
        reportedTimes: {}
      })

  return {
    reportedTimes: data?.reportedTimes ?? [],
    isLoading,
    error
  }
}

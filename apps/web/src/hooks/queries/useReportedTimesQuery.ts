import { db } from '@/lib/instant'

export function useReportedTimesQuery(projectId?: string) {
  const query = projectId
    ? { reportedTimes: { $: { where: { projectId } } } }
    : { reportedTimes: {} }

  const { data, isLoading, error } = db.useQuery(query)

  return {
    reportedTimes: data?.reportedTimes ?? [],
    isLoading,
    error
  }
}
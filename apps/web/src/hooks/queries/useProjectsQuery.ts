import { db } from '@/lib/instant'

export function useProjectsQuery() {
  const { data, isLoading, error } = db.useQuery({ projects: { owner: {} } })

  return {
    projects: data?.projects || [],
    isLoading,
    error
  }
}

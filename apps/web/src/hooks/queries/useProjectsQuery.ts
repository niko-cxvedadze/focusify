import { db } from '@/lib/instant'

export function useProjectsQuery() {
  const { data, isLoading, error } = db.useQuery({ projects: { owner: {} } })

  return {
    projects: data?.projects || [],
    isLoading,
    error
  }
}

export async function getProjectById(projectId: string) {
  const { data } = await db.queryOnce({
    projects: {
      $: {
        where: { id: projectId }
      }
    }
  })

  return data?.projects?.[0] || null
}

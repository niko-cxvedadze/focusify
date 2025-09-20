import { Project } from '@repo/types'

import { PageHeader } from '@/components/PageHeader/PageHeader'
import { ProjectReports } from '@/components/Tracking/ReportsCard'

import { useProjectsQuery } from '@/hooks/queries/useProjectsQuery'

export function ReportsView() {
  const { projects, isLoading } = useProjectsQuery()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6">
      <PageHeader
        title="Reports"
        description="View and manage your time reports across all projects."
      />

      <div className="space-y-6">
        {projects.map((project: Project) => (
          <ProjectReports key={project.id} project={project} />
        ))}
      </div>
    </div>
  )
}

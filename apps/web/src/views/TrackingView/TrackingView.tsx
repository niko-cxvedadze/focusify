import React from 'react'

import { useNavigate, useParams } from 'react-router'

import { PageHeader } from '@/components/PageHeader'
import { TimerCard } from '@/components/Tracking/TimerCard'
import { ReportsCard } from '@/components/Tracking/ReportsCard'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import { useProjectsQuery } from '@/hooks/queries/useProjectsQuery'

export function TrackingView() {
  const navigate = useNavigate()
  const { projectId } = useParams<{ projectId: string }>()

  const { projects } = useProjectsQuery()

  // Auto-redirect to first project if no projectId in URL and projects exist
  React.useEffect(() => {
    if (!projectId && projects.length > 0) {
      navigate(`/tracking/${projects[0].id}`, { replace: true })
    }
  }, [projectId, projects, navigate])

  // Find the selected project based on URL parameter
  const selectedProject = React.useMemo(() => {
    return projectId ? projects.find((p) => p.id === projectId) || null : null
  }, [projectId, projects])

  const handleProjectChange = (newProjectId: string) => {
    navigate(`/tracking/${newProjectId}`)
  }

  return (
    <div className="space-y-6">
      {/* Header with Global Project Selector */}
      <PageHeader title="Time Tracking">
        <Select value={projectId || ''} onValueChange={handleProjectChange}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PageHeader>

      {/* Timer and Reports Section */}
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {selectedProject && <TimerCard project={selectedProject} />}
        </div>

        {selectedProject && (
          <div className="w-full">
            <ReportsCard project={selectedProject} />
          </div>
        )}
      </div>
    </div>
  )
}

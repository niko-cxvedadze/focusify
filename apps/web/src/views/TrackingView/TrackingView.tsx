import React from 'react'

import { useNavigate, useParams } from 'react-router'

import { PageHeader } from '@/components/PageHeader'
import { TimerCard } from '@/components/Tracking/TimerCard'
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
    <div className="h-full flex flex-col">
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

      {/* Full Screen Timer */}
      {selectedProject ? (
        <div className="flex-1 p-8">
          <TimerCard project={selectedProject} />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center text-muted-foreground">
            <p className="text-lg">Select a project to start tracking time</p>
          </div>
        </div>
      )}
    </div>
  )
}

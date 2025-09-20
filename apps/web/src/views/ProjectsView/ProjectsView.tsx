import React from 'react'
import { Plus } from 'lucide-react'

import { ProjectDialog } from '@/components/Projects/ProjectDialog'
import { ProjectCard } from '@/components/Projects/ProjectCard'
import { Button } from '@/components/ui/button'

import { useProjectsQuery } from '@/hooks/queries/useProjectsQuery'

export function ProjectsView() {
  const { projects } = useProjectsQuery()
  const [createOpen, setCreateOpen] = React.useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage and organize your projects to stay focused and productive.
          </p>
        </div>
        <Button size={'sm'} onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          New Project
        </Button>

        {createOpen && (
          <ProjectDialog
            open={createOpen}
            onOpenChange={setCreateOpen}
          />
        )}
      </div>

      {/* Projects Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects?.map((project) => <ProjectCard key={project.id} project={project} />)}
      </div>
    </div>
  )
}

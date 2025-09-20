import React from 'react'

import { Plus } from 'lucide-react'

import { PageHeader } from '@/components/PageHeader'
import { ProjectCard } from '@/components/Projects/ProjectCard'
import { ProjectDialog } from '@/components/Projects/ProjectDialog'
import { Button } from '@/components/ui/button'

import { useProjectsQuery } from '@/hooks/queries/useProjectsQuery'

export function ProjectsView() {
  const { projects } = useProjectsQuery()
  const [createOpen, setCreateOpen] = React.useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader title="Projects">
        <Button size={'sm'} onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </PageHeader>
      {createOpen && <ProjectDialog open={createOpen} onOpenChange={setCreateOpen} />}
      {/* Projects Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects?.map((project) => <ProjectCard key={project.id} project={project} />)}
      </div>
    </div>
  )
}

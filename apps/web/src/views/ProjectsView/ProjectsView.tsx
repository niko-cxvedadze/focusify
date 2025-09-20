import { Plus } from 'lucide-react'

import { CreateProjectDialog } from '@/components/Projects/CreateProjectDialog'
import { ProjectCard } from '@/components/Projects/ProjectCard'
import { Button } from '@/components/ui/button'

const projects = [
  {
    title: 'Work Focus',
    description: 'Focus on work-related tasks and improve productivity during work hours.'
  },
  {
    title: 'Personal Growth',
    description: 'Personal development goals and habits to build a better lifestyle.'
  },
  {
    title: 'Learning',
    description: 'Continuous learning and skill development in various areas of interest.'
  }
]

export function ProjectsView() {
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
        <CreateProjectDialog
          trigger={
            <Button size={'sm'}>
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          }
        />
      </div>

      {/* Projects Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard
            key={project.title}
            title={project.title}
            description={project.description}
          />
        ))}
      </div>
    </div>
  )
}

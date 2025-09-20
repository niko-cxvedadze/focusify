import React from 'react'
import { Project } from '@repo/types'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { ProjectDialog } from '@/components/Projects/ProjectDialog'
import { FolderOpen, MoreHorizontal, DollarSign, Edit, Trash2 } from 'lucide-react'
import { useProjectsMutation } from '@/hooks/mutations/useProjectsMutation'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [editOpen, setEditOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const { deleteProject } = useProjectsMutation()

  const handleDelete = async () => {
    try {
      await deleteProject(project.id)
    } catch (error) {
      console.error('Failed to delete project:', error)
    }
  }

  return (
    <>
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-muted rounded-lg">
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </div>
          <CardTitle className="text-base">{String(project.title)}</CardTitle>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setEditOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setDeleteOpen(true)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4 text-destructive" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-3">
          {String(project.description || 'No description provided')}
        </CardDescription>
        {project.hourlyRate && (
          <div className="flex items-center text-sm text-muted-foreground">
            <DollarSign className="h-3 w-3 mr-1" />
            <span>{project.hourlyRate.toFixed(2)}/hr</span>
          </div>
        )}
      </CardContent>
    </Card>

    {editOpen && (
      <ProjectDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        project={project}
      />
    )}

    <ConfirmDialog
      open={deleteOpen}
      onOpenChange={setDeleteOpen}
      onSubmit={handleDelete}
      title="Are you absolutely sure?"
      description={`This action cannot be undone. This will permanently delete the project "${project.title}" and remove all associated data.`}
      submitText="Delete Project"
    />
    </>
  )
}
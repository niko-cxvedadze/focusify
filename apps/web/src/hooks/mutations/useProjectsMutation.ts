import React from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { id } from '@instantdb/react'
import { Project } from '@repo/types'
import { ProjectForm, ProjectFormValidator } from '@repo/types/validators/projects'
import { useForm } from 'react-hook-form'

import { db } from '@/lib/instant'

export function useProjectsMutation(project?: Project) {
  const user = db.useUser()
  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm<ProjectForm>({
    resolver: zodResolver(ProjectFormValidator),
    defaultValues: project ? {
      title: project.title,
      description: project.description || '',
      hourlyRate: project.hourlyRate || undefined
    } : { title: '', description: '', hourlyRate: undefined }
  })


  const handleSubmit = async (data: ProjectForm, onSuccess?: () => void) => {
    try {
      setIsLoading(true)
      await createProject(data)
      form.reset()
      onSuccess?.()
      return true // Success
    } catch (error) {
      console.error('Failed to create project:', error)
      return false // Failure
    } finally {
      setIsLoading(false)
    }
  }

  const handleFormSubmit = async (data: ProjectForm, onSuccess?: () => void) => {
    try {
      setIsLoading(true)
      if (project) {
        // Edit mode
        await updateProject(project.id, data)
      } else {
        // Create mode
        await createProject(data)
        form.reset()
      }
      onSuccess?.()
    } catch (error) {
      console.error('Failed to save project:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const createProject = async (data: ProjectForm) => {
    if (!user?.id) {
      throw new Error('User must be authenticated to create a project')
    }

    const projectId = id()

    await db.transact(
      db.tx.projects[projectId]
        .update({
          title: data.title,
          description: data.description || undefined,
          hourlyRate: data.hourlyRate || undefined,
          ownerId: user.id
        })
        .link({ owner: user.id })
    )

    return projectId
  }

  const deleteProject = async (projectId: string) => {
    await db.transact(db.tx.projects[projectId].delete())
  }

  const updateProject = async (projectId: string, data: Partial<ProjectForm>) => {
    const updateData: Partial<{
      title: string
      description: string | undefined
      hourlyRate: number | undefined
    }> = {}

    if (data.title !== undefined) updateData.title = data.title
    if (data.description !== undefined) updateData.description = data.description || undefined
    if (data.hourlyRate !== undefined) updateData.hourlyRate = data.hourlyRate || undefined

    await db.transact(db.tx.projects[projectId].update(updateData))
  }

  return {
    form,
    isLoading,
    handleSubmit,
    handleFormSubmit,
    createProject,
    deleteProject,
    updateProject
  }
}

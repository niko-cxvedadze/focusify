import { z } from 'zod'

export const CreateProjectFormValidator = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  hourlyRate: z.number().optional()
})

export type CreateProjectForm = z.infer<typeof CreateProjectFormValidator>
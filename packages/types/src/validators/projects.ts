import { z } from 'zod'

export const ProjectFormValidator = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  hourlyRate: z.number().optional()
})

export type ProjectForm = z.infer<typeof ProjectFormValidator>
import { z } from 'zod'

export const ReportFormValidator = z.object({
  reportedAt: z.string().min(1, 'Date is required'),
  time: z.string()
    .regex(/^\d{1,2}:[0-5][0-9]$/, 'Time must be in HH:MM format')
    .refine((time) => {
      const [hours, minutes] = time.split(':').map(Number)
      return hours >= 0 && minutes >= 0 && minutes <= 59
    }, 'Invalid time - minutes must be 00-59'),
  hourlyRate: z.number().min(0, 'Hourly rate must be 0 or greater').optional()
})

export type ReportForm = z.infer<typeof ReportFormValidator>

// Helper function to convert HH:MM to milliseconds
export const timeToMilliseconds = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number)
  return (hours * 60 + minutes) * 60 * 1000
}

// Database report creation type (matches reportedTimes schema)
export const CreateReportValidator = z.object({
  projectId: z.string(),
  ownerId: z.string(),
  duration: z.number(), // Duration in milliseconds
  reportedAt: z.string(), // Date in YYYY-MM-DD format
  hourlyRate: z.number().optional(),
  timerId: z.string().optional()
})

export type CreateReport = z.infer<typeof CreateReportValidator>
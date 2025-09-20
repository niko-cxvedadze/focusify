import React from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { id } from '@instantdb/react'
import { ReportedTime } from '@repo/types'
import { ReportForm, ReportFormValidator, timeToMilliseconds } from '@repo/types'
import { useForm } from 'react-hook-form'

import { db } from '@/lib/instant'

export function useReportsMutation(report?: ReportedTime) {
  const user = db.useUser()
  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm<ReportForm>({
    resolver: zodResolver(ReportFormValidator),
    defaultValues: report ? {
      reportedAt: report.reportedAt,
      time: millisecondsToTime(report.duration),
      hourlyRate: report.hourlyRate || undefined
    } : {
      reportedAt: new Date().toISOString().split('T')[0],
      time: '01:00',
      hourlyRate: undefined
    }
  })

  const handleFormSubmit = async (data: ReportForm, projectId: string, onSuccess?: () => void) => {
    try {
      setIsLoading(true)
      if (report) {
        // Edit mode
        await updateReport(report.id, data)
      } else {
        // Create mode
        await createReport(data, projectId)
        form.reset()
      }
      onSuccess?.()
    } catch (error) {
      console.error('Failed to save report:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const createReport = async (data: ReportForm, projectId: string) => {
    if (!user?.id) {
      throw new Error('User must be authenticated to create a report')
    }

    const reportedTimeId = id()
    const duration = timeToMilliseconds(data.time)

    await db.transact(
      db.tx.reportedTimes[reportedTimeId]
        .update({
          projectId,
          ownerId: user.id,
          duration,
          reportedAt: data.reportedAt,
          hourlyRate: data.hourlyRate || null,
          timerId: null, // Manual reports don't have a timer
          createdAt: Date.now()
        })
        .link({
          project: projectId,
          owner: user.id
        })
    )

    return reportedTimeId
  }

  const updateReport = async (reportId: string, data: Partial<ReportForm>) => {
    const updateData: Partial<{
      duration: number
      reportedAt: string
      hourlyRate: number | null
    }> = {}

    if (data.time !== undefined) updateData.duration = timeToMilliseconds(data.time)
    if (data.reportedAt !== undefined) updateData.reportedAt = data.reportedAt
    if (data.hourlyRate !== undefined) updateData.hourlyRate = data.hourlyRate || null

    await db.transact(db.tx.reportedTimes[reportId].update(updateData))
  }

  const deleteReport = async (reportId: string) => {
    await db.transact(db.tx.reportedTimes[reportId].delete())
  }

  return {
    form,
    isLoading,
    handleFormSubmit,
    createReport,
    updateReport,
    deleteReport
  }
}

// Helper function to convert milliseconds to HH:MM format for editing
export const millisecondsToTime = (milliseconds: number): string => {
  const totalMinutes = Math.floor(milliseconds / (1000 * 60))
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

// Legacy function for backward compatibility (used by timer system)
export async function createReport({
  projectId,
  ownerId,
  timerId,
  duration,
  reportedAt,
  hourlyRate
}: {
  projectId: string
  ownerId: string
  timerId: string
  duration: number
  reportedAt: string
  hourlyRate: number | null
}) {
  const reportedTimeId = id()

  await db.transact(
    db.tx.reportedTimes[reportedTimeId]
      .update({
        projectId,
        ownerId,
        timerId,
        duration,
        reportedAt,
        hourlyRate,
        createdAt: Date.now()
      })
      .link({
        project: projectId,
        owner: ownerId,
        timer: timerId
      })
  )

  return reportedTimeId
}
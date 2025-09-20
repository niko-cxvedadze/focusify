import { id } from '@instantdb/react'
import { db } from '@/lib/instant'

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
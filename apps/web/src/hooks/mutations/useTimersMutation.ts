import React from 'react'

import { id } from '@instantdb/react'
import { Timer } from '@repo/types'

import { db } from '@/lib/instant'

export function useTimersMutation() {
  const user = db.useUser()
  const [isLoading, setIsLoading] = React.useState(false)

  const startTimer = async (projectId: string) => {
    if (!user?.id) {
      throw new Error('User must be authenticated to start a timer')
    }

    setIsLoading(true)
    try {
      const timerId = id()
      const now = Date.now()

      await db.transact(
        db.tx.timers[timerId]
          .update({
            projectId,
            ownerId: user.id,
            startedAt: now,
            finishedAt: null,
            createdAt: now
          })
          .link({ project: projectId, owner: user.id })
      )

      return timerId
    } catch (error) {
      console.error('Failed to start timer:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const stopTimer = async (timerId: string, reportedAt: string) => {
    if (!user?.id) {
      throw new Error('User must be authenticated to stop a timer')
    }

    setIsLoading(true)
    try {
      const now = Date.now()

      // Get the timer and its project to calculate duration and get hourly rate
      const { data: timerData } = await db.queryOnce({
        timers: {
          $: {
            where: { id: timerId }
          },
          project: {}
        }
      })

      const timer = timerData?.timers?.[0] as Timer & { project?: { hourlyRate?: number } }
      if (!timer) {
        throw new Error('Timer not found')
      }

      const duration = now - timer.startedAt
      const hourlyRate = timer.project?.hourlyRate || null

      // Update timer with finish time
      await db.transact(
        db.tx.timers[timerId].update({
          finishedAt: now
        })
      )

      // Create reported time record with hourly rate
      const reportedTimeId = id()
      await db.transact(
        db.tx.reportedTimes[reportedTimeId]
          .update({
            projectId: timer.projectId,
            ownerId: user.id,
            timerId,
            duration,
            reportedAt,
            hourlyRate,
            createdAt: now
          })
          .link({
            project: timer.projectId,
            owner: user.id,
            timer: timerId
          })
      )

      return { timerId, reportedTimeId, duration }
    } catch (error) {
      console.error('Failed to stop timer:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const deleteTimer = async (timerId: string) => {
    if (!user?.id) {
      throw new Error('User must be authenticated to delete a timer')
    }

    setIsLoading(true)
    try {
      await db.transact(db.tx.timers[timerId].delete())
    } catch (error) {
      console.error('Failed to delete timer:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    startTimer,
    stopTimer,
    deleteTimer
  }
}
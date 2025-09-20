import React from 'react'

import { id } from '@instantdb/react'
import { Timer } from '@repo/types'

import { db } from '@/lib/instant'

import { createReport } from '@/hooks/mutations/useReportsMutation'
import { getProjectById } from '@/hooks/queries/useProjectsQuery'
import { getTimerById } from '@/hooks/queries/useTimersQuery'

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
            pausedAt: null,
            totalPausedTime: 0,
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

      // Get the timer using helper function
      const timer = await getTimerById(timerId)
      if (!timer) {
        throw new Error('Timer not found')
      }

      // Get the project using helper function
      const project = await getProjectById(timer.projectId)

      // Calculate total duration accounting for paused time
      const totalPausedTime = timer.totalPausedTime || 0
      const duration = now - timer.startedAt - totalPausedTime
      const hourlyRate = project?.hourlyRate || null

      console.log('Hourly rate:', hourlyRate)

      // Update timer with finish time
      await db.transact(db.tx.timers[timerId].update({ finishedAt: now }))

      // Create reported time record with hourly rate
      const reportedTimeId = await createReport({
        projectId: timer.projectId,
        ownerId: user.id,
        timerId,
        duration,
        reportedAt,
        hourlyRate
      })

      return { timerId, reportedTimeId, duration }
    } catch (error) {
      console.error('Failed to stop timer:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const pauseTimer = async (timerId: string) => {
    if (!user?.id) {
      throw new Error('User must be authenticated to pause a timer')
    }

    setIsLoading(true)
    try {
      const now = Date.now()
      await db.transact(
        db.tx.timers[timerId].update({
          pausedAt: now
        })
      )
    } catch (error) {
      console.error('Failed to pause timer:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const resumeTimer = async (timerId: string) => {
    if (!user?.id) {
      throw new Error('User must be authenticated to resume a timer')
    }

    setIsLoading(true)
    try {
      const now = Date.now()

      // Get current timer to calculate paused time
      const { data: timerData } = await db.queryOnce({
        timers: {
          $: {
            where: { id: timerId }
          }
        }
      })

      const timer = timerData?.timers?.[0] as Timer
      if (!timer || !timer.pausedAt) {
        throw new Error('Timer not found or not paused')
      }

      const pausedDuration = now - timer.pausedAt
      const newTotalPausedTime = (timer.totalPausedTime || 0) + pausedDuration

      await db.transact(
        db.tx.timers[timerId].update({
          pausedAt: null,
          totalPausedTime: newTotalPausedTime
        })
      )
    } catch (error) {
      console.error('Failed to resume timer:', error)
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
    pauseTimer,
    resumeTimer,
    deleteTimer
  }
}

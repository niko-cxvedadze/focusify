import React from 'react'

import { Project } from '@repo/types'
import { Clock, Pause, Play, Square } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

import { formatTime } from '@/lib/time'

import { useTimersMutation } from '@/hooks/mutations/useTimersMutation'
import { useTimersQuery } from '@/hooks/queries/useTimersQuery'

interface TimerCardProps {
  project: Project
}

export function TimerCard({ project }: TimerCardProps) {
  const { activeTimer } = useTimersQuery()
  const { isLoading, startTimer, stopTimer, pauseTimer, resumeTimer } = useTimersMutation()
  const [elapsedTime, setElapsedTime] = React.useState(0)

  // Find timer for this specific project
  const projectTimer = React.useMemo(() => {
    return activeTimer && activeTimer.projectId === project.id ? activeTimer : undefined
  }, [activeTimer, project.id])

  // Update elapsed time for active timer
  React.useEffect(() => {
    if (!projectTimer) return

    const updateElapsedTime = () => {
      const now = Date.now()
      const totalPausedTime = projectTimer.totalPausedTime || 0

      // If timer is paused, use pausedAt instead of now
      const endTime = projectTimer.pausedAt || now
      const rawElapsed = endTime - projectTimer.startedAt
      const actualElapsed = rawElapsed - totalPausedTime

      setElapsedTime(Math.max(0, actualElapsed))
    }

    // Update immediately
    updateElapsedTime()

    // Only update every second if timer is not paused
    if (!projectTimer.pausedAt) {
      const interval = setInterval(updateElapsedTime, 1000)
      return () => clearInterval(interval)
    }

    // Return empty cleanup function for paused timers
    return () => {}
  }, [projectTimer])

  const handleStart = async () => {
    try {
      await startTimer(project.id)
    } catch (error) {
      console.error('Failed to start timer:', error)
    }
  }

  const handleStop = async () => {
    if (!projectTimer) return

    try {
      const today = new Date().toISOString().split('T')[0]
      await stopTimer(projectTimer.id, today)
    } catch (error) {
      console.error('Failed to stop timer:', error)
    }
  }

  const handlePause = async () => {
    if (!projectTimer) return

    try {
      await pauseTimer(projectTimer.id)
    } catch (error) {
      console.error('Failed to pause timer:', error)
    }
  }

  const handleResume = async () => {
    if (!projectTimer) return

    try {
      await resumeTimer(projectTimer.id)
    } catch (error) {
      console.error('Failed to resume timer:', error)
    }
  }

  return (
    <Card className="w-full">
      <CardContent>
        <div className="flex items-center justify-between gap-6">
          {/* Project Info & Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <div>
                <div className="font-semibold">{project.title}</div>
                <div className="text-sm text-muted-foreground">
                  {projectTimer
                    ? projectTimer.pausedAt
                      ? 'Timer Paused'
                      : 'Active Timer'
                    : 'Ready to start'}
                </div>
              </div>
            </div>
          </div>

          {/* Timer Display */}
          <div className="flex flex-col items-center">
            <div className="text-2xl font-mono font-bold tabular-nums">
              {projectTimer ? formatTime(elapsedTime) : '00:00:00'}
            </div>
            {projectTimer && (
              <div className="text-xs text-muted-foreground">
                {projectTimer.pausedAt
                  ? `Paused at ${new Date(projectTimer.pausedAt).toLocaleTimeString()}`
                  : `Started at ${new Date(projectTimer.startedAt).toLocaleTimeString()}`}
              </div>
            )}
          </div>

          {/* Earnings Display */}
          {projectTimer && project.hourlyRate && (
            <div className="flex flex-col items-center">
              <div className="text-2xl font-mono font-bold tabular-nums text-green-600">
                ${((elapsedTime / (1000 * 60 * 60)) * project.hourlyRate).toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">Current earnings</div>
            </div>
          )}

          {/* Timer Controls */}
          <div className="flex gap-2 flex-row justify-center  items-center">
            {projectTimer ? (
              <>
                {projectTimer.pausedAt ? (
                  <Button onClick={handleResume} disabled={isLoading} size="sm">
                    <Play className="mr-1 h-3 w-3" />
                    Resume
                  </Button>
                ) : (
                  <Button onClick={handlePause} disabled={isLoading} size="sm">
                    <Pause className="mr-1 h-3 w-3" />
                    Pause
                  </Button>
                )}
                <Button onClick={handleStop} disabled={isLoading} size="sm">
                  <Square className="mr-1 h-3 w-3" />
                  Stop
                </Button>
              </>
            ) : (
              <Button onClick={handleStart} disabled={isLoading} size="sm" className="w-20 h-8">
                <Play className="mr-1 h-3 w-3" />
                Start
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

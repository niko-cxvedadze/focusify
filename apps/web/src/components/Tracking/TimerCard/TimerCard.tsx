import React from 'react'

import { Project } from '@repo/types'
import { Pause, Play, Square } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'

import { formatTime } from '@/lib/time'

import { useTimersMutation } from '@/hooks/mutations/useTimersMutation'
import { useTimersQuery } from '@/hooks/queries/useTimersQuery'

interface TimerCardProps {
  project: Project
}

export function TimerCard({ project }: TimerCardProps) {
  const { activeTimer } = useTimersQuery()
  const [elapsedTime, setElapsedTime] = React.useState(0)
  const [showStopConfirm, setShowStopConfirm] = React.useState(false)
  const { isLoading, startTimer, stopTimer, pauseTimer, resumeTimer } = useTimersMutation()

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

  const handleStopClick = () => {
    setShowStopConfirm(true)
  }

  const handleStopConfirm = async () => {
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
    <>
      <Card className="w-full">
        <CardContent>
          <div className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-6 items-center">
            {/* Project Info & Status */}
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

            {/* Timer Display */}
            <div className="flex flex-col items-center justify-center">
              <div className="text-2xl font-mono font-bold tabular-nums text-center">
                {projectTimer ? formatTime(elapsedTime) : '00:00:00'}
              </div>
              {projectTimer && (
                <div className="text-xs text-muted-foreground text-center">
                  {projectTimer.pausedAt
                    ? `Paused at ${new Date(projectTimer.pausedAt).toLocaleTimeString()}`
                    : `Started at ${new Date(projectTimer.startedAt).toLocaleTimeString()}`}
                </div>
              )}
            </div>

            {/* Earnings Display */}
            {(projectTimer || project.hourlyRate) && (
              <div className="flex flex-col items-center justify-center">
                {projectTimer && project.hourlyRate ? (
                  <>
                    <div className="text-2xl font-mono font-bold tabular-nums text-green-600 text-center">
                      ${((elapsedTime / (1000 * 60 * 60)) * project.hourlyRate).toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground text-center">
                      Current earnings
                    </div>
                  </>
                ) : (
                  <div className="h-12 w-24" />
                )}
              </div>
            )}

            {/* Timer Controls */}
            <div className="flex gap-2 justify-end">
              {projectTimer ? (
                <>
                  {projectTimer.pausedAt ? (
                    <Button
                      onClick={handleResume}
                      disabled={isLoading}
                      size="sm"
                      className="h-8"
                      variant="outline"
                    >
                      <Play className="mr-1 h-3 w-3" />
                      Resume
                    </Button>
                  ) : (
                    <Button
                      onClick={handlePause}
                      disabled={isLoading}
                      size="sm"
                      className="h-8"
                      variant="outline"
                    >
                      <Pause className="mr-1 h-3 w-3" />
                      Pause
                    </Button>
                  )}
                  <Button
                    onClick={handleStopClick}
                    disabled={isLoading}
                    size="sm"
                    className="h-8"
                    variant="destructive"
                  >
                    <Square className="mr-1 h-3 w-3" />
                    Stop Session
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
      <ConfirmDialog
        open={showStopConfirm}
        onOpenChange={setShowStopConfirm}
        onSubmit={handleStopConfirm}
        title="Stop Timer Session?"
        description="This will end your current timing session and save the recorded time to your reports."
        submitText="Stop Session"
        cancelText="Keep Running"
      />
    </>
  )
}

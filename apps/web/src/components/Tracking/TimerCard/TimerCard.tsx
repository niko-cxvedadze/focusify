import React from 'react'

import { Project } from '@repo/types'
import { Maximize2, Minimize2, Pause, Play, Square } from 'lucide-react'

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
  const [isFullscreen, setIsFullscreen] = React.useState(false)
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

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // Handle Escape key to exit fullscreen
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    if (isFullscreen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isFullscreen])

  if (isFullscreen) {
    return (
      <>
        <div className="fixed inset-0 bg-background z-50 flex flex-col">
          {/* Fullscreen Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <div className="text-2xl font-bold">{project.title}</div>
            <Button
              onClick={toggleFullscreen}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Fullscreen Timer Content */}
          <div className="flex-1 flex flex-col justify-center items-center space-y-16 p-12">
            {/* Status */}
            <div className="text-center">
              <div className="text-2xl text-muted-foreground">
                {projectTimer
                  ? projectTimer.pausedAt
                    ? 'Timer Paused'
                    : 'Active Timer'
                  : 'Ready to start'}
              </div>
            </div>

            {/* Timer Display */}
            <div className="text-center">
              <div className="text-[12rem] font-mono font-bold tabular-nums leading-none mb-8">
                {projectTimer ? formatTime(elapsedTime) : '00:00:00'}
              </div>
              {projectTimer && (
                <div className="text-2xl text-muted-foreground">
                  {projectTimer.pausedAt
                    ? `Paused at ${new Date(projectTimer.pausedAt).toLocaleTimeString()}`
                    : `Started at ${new Date(projectTimer.startedAt).toLocaleTimeString()}`}
                </div>
              )}
            </div>

            {/* Earnings Display */}
            {projectTimer && project.hourlyRate && (
              <div className="text-center">
                <div className="text-8xl font-mono font-bold tabular-nums text-green-600 mb-4">
                  ${((elapsedTime / (1000 * 60 * 60)) * project.hourlyRate).toFixed(2)}
                </div>
                <div className="text-2xl text-muted-foreground">Current earnings</div>
              </div>
            )}

            {/* Timer Controls */}
            <div className="flex gap-8">
              {projectTimer ? (
                <>
                  {projectTimer.pausedAt ? (
                    <Button
                      onClick={handleResume}
                      disabled={isLoading}
                      size="lg"
                      className="h-20 px-12 text-2xl"
                      variant="outline"
                    >
                      <Play className="mr-4 h-8 w-8" />
                      Resume
                    </Button>
                  ) : (
                    <Button
                      onClick={handlePause}
                      disabled={isLoading}
                      size="lg"
                      className="h-20 px-12 text-2xl"
                      variant="outline"
                    >
                      <Pause className="mr-4 h-8 w-8" />
                      Pause
                    </Button>
                  )}
                  <Button
                    onClick={handleStopClick}
                    disabled={isLoading}
                    size="lg"
                    className="h-20 px-12 text-2xl"
                    variant="destructive"
                  >
                    <Square className="mr-4 h-8 w-8" />
                    Stop Session
                  </Button>
                </>
              ) : (
                <Button onClick={handleStart} disabled={isLoading} size="lg" className="h-20 px-16 text-2xl">
                  <Play className="mr-4 h-8 w-8" />
                  Start Timer
                </Button>
              )}
            </div>
          </div>
        </div>
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

  return (
    <>
      <Card className="w-full h-full min-h-[60vh] relative">
        <CardContent className="h-full p-12">
          {/* Fullscreen Toggle Button */}
          <Button
            onClick={toggleFullscreen}
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 h-8 w-8 p-0"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>

          <div className="h-full flex flex-col justify-center items-center space-y-12">
            {/* Project Info & Status */}
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{project.title}</div>
              <div className="text-xl text-muted-foreground">
                {projectTimer
                  ? projectTimer.pausedAt
                    ? 'Timer Paused'
                    : 'Active Timer'
                  : 'Ready to start'}
              </div>
            </div>

            {/* Timer Display */}
            <div className="text-center">
              <div className="text-8xl font-mono font-bold tabular-nums mb-4">
                {projectTimer ? formatTime(elapsedTime) : '00:00:00'}
              </div>
              {projectTimer && (
                <div className="text-lg text-muted-foreground">
                  {projectTimer.pausedAt
                    ? `Paused at ${new Date(projectTimer.pausedAt).toLocaleTimeString()}`
                    : `Started at ${new Date(projectTimer.startedAt).toLocaleTimeString()}`}
                </div>
              )}
            </div>

            {/* Earnings Display */}
            {projectTimer && project.hourlyRate && (
              <div className="text-center">
                <div className="text-5xl font-mono font-bold tabular-nums text-green-600 mb-2">
                  ${((elapsedTime / (1000 * 60 * 60)) * project.hourlyRate).toFixed(2)}
                </div>
                <div className="text-lg text-muted-foreground">Current earnings</div>
              </div>
            )}

            {/* Timer Controls */}
            <div className="flex gap-6">
              {projectTimer ? (
                <>
                  {projectTimer.pausedAt ? (
                    <Button
                      onClick={handleResume}
                      disabled={isLoading}
                      size="lg"
                      className="h-16 px-8 text-lg"
                      variant="outline"
                    >
                      <Play className="mr-3 h-6 w-6" />
                      Resume
                    </Button>
                  ) : (
                    <Button
                      onClick={handlePause}
                      disabled={isLoading}
                      size="lg"
                      className="h-16 px-8 text-lg"
                      variant="outline"
                    >
                      <Pause className="mr-3 h-6 w-6" />
                      Pause
                    </Button>
                  )}
                  <Button
                    onClick={handleStopClick}
                    disabled={isLoading}
                    size="lg"
                    className="h-16 px-8 text-lg"
                    variant="destructive"
                  >
                    <Square className="mr-3 h-6 w-6" />
                    Stop Session
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleStart}
                  disabled={isLoading}
                  size="lg"
                  className="h-16 px-12 text-lg"
                >
                  <Play className="mr-3 h-6 w-6" />
                  Start Timer
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

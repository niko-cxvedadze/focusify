import React from 'react'

import { Project } from '@repo/types'
import { Clock, Play, Square } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { formatTime } from '@/lib/time'

import { useTimersMutation } from '@/hooks/mutations/useTimersMutation'
import { useTimersQuery } from '@/hooks/queries/useTimersQuery'

interface TimerCardProps {
  project: Project
}

export function TimerCard({ project }: TimerCardProps) {
  const [elapsedTime, setElapsedTime] = React.useState(0)
  const { startTimer, stopTimer, isLoading: mutationLoading } = useTimersMutation()
  const { activeTimer } = useTimersQuery()

  // Find timer for this specific project
  const projectTimer = React.useMemo(() => {
    return activeTimer && activeTimer.projectId === project.id ? activeTimer : undefined
  }, [activeTimer, project.id])

  // Calculate elapsed time for active timer
  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (projectTimer) {
      const updateElapsed = () => {
        const now = Date.now()
        setElapsedTime(now - projectTimer.startedAt)
      }

      updateElapsed() // Initial calculation
      interval = setInterval(updateElapsed, 1000) // Update every second
    } else {
      setElapsedTime(0)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
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
      const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD format
      await stopTimer(projectTimer.id, today)
    } catch (error) {
      console.error('Failed to stop timer:', error)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Clock className="h-5 w-5" />
          {projectTimer ? 'Active Timer' : 'Timer'}
        </CardTitle>
        <CardDescription>
          {projectTimer
            ? `Tracking time for ${project.title}`
            : `Ready to start tracking ${project.title}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        {/* Timer Display */}
        <div className="text-6xl font-mono font-bold">
          {projectTimer ? formatTime(elapsedTime) : '00:00:00'}
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center gap-3">
          {!projectTimer ? (
            <Button
              onClick={handleStart}
              disabled={mutationLoading || (activeTimer !== null && activeTimer !== undefined)}
              size="lg"
              className="px-8"
            >
              <Play className="h-5 w-5 mr-2" />
              Start Timer
            </Button>
          ) : (
            <Button
              onClick={handleStop}
              disabled={mutationLoading}
              variant="destructive"
              size="lg"
              className="px-8"
            >
              <Square className="h-5 w-5 mr-2" />
              Stop Timer
            </Button>
          )}
        </div>

        {/* Status */}
        <div className="text-sm text-muted-foreground">
          {projectTimer ? (
            <div className="flex items-center justify-center gap-2">
              <span className="text-green-600">● Active</span>
              <span>since {new Date(projectTimer.startedAt).toLocaleTimeString()}</span>
            </div>
          ) : activeTimer ? (
            <div className="text-yellow-600">
              Timer is running on a different project - stop it to start tracking this one
            </div>
          ) : (
            <span>Click start to begin tracking time</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

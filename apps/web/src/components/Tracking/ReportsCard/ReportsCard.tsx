import React from 'react'

import { Project } from '@repo/types'
import { Calendar, Clock, Plus } from 'lucide-react'

import { ReportDialog } from '@/components/Reports/ReportDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import { formatTime } from '@/lib/time'

import { useReportedTimesQuery } from '@/hooks/queries/useReportedTimesQuery'

type FilterPeriod = 'week' | 'semimonth' | 'month' | 'quarter' | 'year' | 'all'

interface ReportsCardProps {
  project: Project
}

export function ReportsCard({ project }: ReportsCardProps) {
  const [filterPeriod, setFilterPeriod] = React.useState<FilterPeriod>('all')
  const [showReportDialog, setShowReportDialog] = React.useState(false)
  const { reportedTimes, isLoading } = useReportedTimesQuery(project.id)

  // Filter reported times based on selected period
  const filteredReports = React.useMemo(() => {
    if (filterPeriod === 'all') return reportedTimes

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const getFilterDate = () => {
      switch (filterPeriod) {
        case 'week': {
          const weekStart = new Date(today)
          const dayOfWeek = today.getDay()
          // Start from Monday (1) instead of Sunday (0)
          const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
          weekStart.setDate(today.getDate() - daysToMonday)
          return weekStart
        }
        case 'semimonth': {
          const semiStart = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() <= 15 ? 1 : 16
          )
          return semiStart
        }
        case 'month': {
          return new Date(today.getFullYear(), today.getMonth(), 1)
        }
        case 'quarter': {
          const quarterMonth = Math.floor(today.getMonth() / 3) * 3
          return new Date(today.getFullYear(), quarterMonth, 1)
        }
        case 'year': {
          return new Date(today.getFullYear(), 0, 1)
        }
        default:
          return new Date(0)
      }
    }

    const filterDate = getFilterDate()
    const filterDateString = filterDate.toISOString().split('T')[0]

    return reportedTimes.filter((report) => report.reportedAt >= filterDateString)
  }, [reportedTimes, filterPeriod])

  // Group filtered reported times by date
  const groupedReports = React.useMemo(() => {
    const groups: Record<string, typeof filteredReports> = {}

    filteredReports.forEach((report) => {
      if (!groups[report.reportedAt]) {
        groups[report.reportedAt] = []
      }
      groups[report.reportedAt].push(report)
    })

    // Sort dates descending (most recent first)
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a))
  }, [filteredReports])

  // Calculate total time for a date
  const getTotalTimeForDate = (reports: typeof reportedTimes) => {
    return reports.reduce((total, report) => total + report.duration, 0)
  }

  // Calculate total earnings for a date
  const getTotalEarningsForDate = (reports: typeof reportedTimes) => {
    return reports.reduce((total, report) => {
      if (report.hourlyRate && report.hourlyRate > 0) {
        const hours = report.duration / (1000 * 60 * 60) // Convert milliseconds to hours
        return total + hours * report.hourlyRate
      }
      return total
    }, 0)
  }

  // Calculate overall total for filtered data
  const overallTotal = React.useMemo(() => {
    return filteredReports.reduce((total, report) => total + report.duration, 0)
  }, [filteredReports])

  // Calculate overall earnings for filtered data
  const overallEarnings = React.useMemo(() => {
    return filteredReports.reduce((total, report) => {
      if (report.hourlyRate && report.hourlyRate > 0) {
        const hours = report.duration / (1000 * 60 * 60) // Convert milliseconds to hours
        return total + hours * report.hourlyRate
      }
      return total
    }, 0)
  }, [filteredReports])

  // Get date range for current filter
  const getDateRange = React.useMemo(() => {
    if (filterPeriod === 'all') return null

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      })
    }

    switch (filterPeriod) {
      case 'week': {
        const weekStart = new Date(today)
        const dayOfWeek = today.getDay()
        // Start from Monday (1) instead of Sunday (0)
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
        weekStart.setDate(today.getDate() - daysToMonday)
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekStart.getDate() + 6)
        return `${formatDate(weekStart)} - ${formatDate(weekEnd)}`
      }
      case 'semimonth': {
        const isFirstHalf = today.getDate() <= 15
        const semiStart = new Date(today.getFullYear(), today.getMonth(), isFirstHalf ? 1 : 16)
        const semiEnd = isFirstHalf
          ? new Date(today.getFullYear(), today.getMonth(), 15)
          : new Date(today.getFullYear(), today.getMonth() + 1, 0) // Last day of month
        return `${formatDate(semiStart)} - ${formatDate(semiEnd)}`
      }
      case 'month': {
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        return `${formatDate(monthStart)} - ${formatDate(monthEnd)}`
      }
      case 'quarter': {
        const quarterMonth = Math.floor(today.getMonth() / 3) * 3
        const quarterStart = new Date(today.getFullYear(), quarterMonth, 1)
        const quarterEnd = new Date(today.getFullYear(), quarterMonth + 3, 0)
        return `${formatDate(quarterStart)} - ${formatDate(quarterEnd)}`
      }
      case 'year': {
        const yearStart = new Date(today.getFullYear(), 0, 1)
        const yearEnd = new Date(today.getFullYear(), 11, 31)
        return `${formatDate(yearStart)} - ${formatDate(yearEnd)}`
      }
      default:
        return null
    }
  }, [filterPeriod])

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Time Reports
          </CardTitle>
          <CardDescription>Loading reported times...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Time Reports
              {getDateRange && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({getDateRange})
                </span>
              )}
            </CardTitle>
            <CardDescription className="mt-2">
              <div className="flex items-center gap-4">
                <span>Total: {formatTime(overallTotal)}</span>
                {overallEarnings > 0 && (
                  <span className="text-green-600 font-bold text-xl">
                    ${overallEarnings.toFixed(2)}
                  </span>
                )}
              </div>
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => setShowReportDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Report
            </Button>
            <Select
              value={filterPeriod}
              onValueChange={(value: FilterPeriod) => setFilterPeriod(value)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="semimonth">Semi-month</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {groupedReports.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No time reports yet. Start tracking your work!
          </div>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {groupedReports.map(([date, reports]) => (
              <div
                key={date}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({reports.length} session{reports.length !== 1 ? 's' : ''})
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-mono font-semibold">
                    {formatTime(getTotalTimeForDate(reports))}
                  </div>
                  {(() => {
                    const earnings = getTotalEarningsForDate(reports)
                    return earnings > 0 ? (
                      <div className="text-base text-green-600 font-semibold">
                        ${earnings.toFixed(2)}
                      </div>
                    ) : null
                  })()}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <ReportDialog open={showReportDialog} onOpenChange={setShowReportDialog} project={project} />
    </Card>
  )
}

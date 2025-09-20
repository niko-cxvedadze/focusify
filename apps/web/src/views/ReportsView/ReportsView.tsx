import React from 'react'

import { ReportedTime } from '@repo/types'
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  Edit,
  MoreHorizontal,
  Plus,
  Trash2
} from 'lucide-react'

import { PageHeader } from '@/components/PageHeader/PageHeader'
import { ReportDialog } from '@/components/Reports/ReportDialog'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import { formatTime } from '@/lib/time'

import { useReportsMutation } from '@/hooks/mutations/useReportsMutation'
import { useProjectsQuery } from '@/hooks/queries/useProjectsQuery'
import { useReportedTimesQuery } from '@/hooks/queries/useReportedTimesQuery'

type FilterPeriod = 'today' | 'week' | 'semimonth' | 'month' | 'quarter' | 'year' | 'all'

// Individual Report Record Component
interface ReportRecordProps {
  report: ReportedTime
  index: number
  totalReports: number
  onEdit: (report: ReportedTime) => void
  onDelete: (report: ReportedTime) => void
}

function ReportRecord({ report, index, totalReports, onEdit, onDelete }: ReportRecordProps) {
  return (
    <div
      key={report.id}
      className={`flex items-center justify-between p-3 hover:bg-muted/30 ${
        index !== totalReports - 1 ? 'border-b' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <div className="font-mono text-sm font-medium">{formatTime(report.duration)}</div>
          {report.timerId ? (
            <div className="text-xs text-muted-foreground">From timer</div>
          ) : (
            <div className="text-xs text-muted-foreground">Manual entry</div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {report.hourlyRate && (
          <div className="font-mono text-sm text-green-600 font-medium">
            ${((report.duration / (1000 * 60 * 60)) * report.hourlyRate).toFixed(2)}
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(report)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(report)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4 text-destructive" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

// Day Section Component
interface DaySectionProps {
  date: string
  reports: ReportedTime[]
  isExpanded: boolean
  onToggleExpanded: (date: string) => void
  onEditReport: (report: ReportedTime) => void
  onDeleteReport: (report: ReportedTime) => void
  getTotalTimeForDate: (reports: ReportedTime[]) => number
  getTotalEarningsForDate: (reports: ReportedTime[]) => number
}

function DaySection({
  date,
  reports,
  isExpanded,
  onToggleExpanded,
  onEditReport,
  onDeleteReport,
  getTotalTimeForDate,
  getTotalEarningsForDate
}: DaySectionProps) {
  return (
    <div className="border rounded-lg bg-muted/50">
      {/* Day Header - Clickable to expand/collapse */}
      <div
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/70 transition-colors"
        onClick={() => onToggleExpanded(date)}
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
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
        <div className="text-right flex flex-row gap-2">
          <div className="font-mono font-semibold border-r pr-2">
            {formatTime(getTotalTimeForDate(reports))}
          </div>
          {getTotalEarningsForDate(reports) > 0 && (
            <div className="font-mono text-green-600 font-semibold">
              ${getTotalEarningsForDate(reports).toFixed(2)}
            </div>
          )}
        </div>
      </div>

      {/* Individual Reports - Show when expanded */}
      {isExpanded && (
        <div className="border-t bg-background/50">
          {reports.map((report, index) => (
            <ReportRecord
              key={report.id}
              report={report}
              index={index}
              totalReports={reports.length}
              onEdit={onEditReport}
              onDelete={onDeleteReport}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function ReportsView() {
  const { projects, isLoading: projectsLoading } = useProjectsQuery()
  const [selectedProjectId, setSelectedProjectId] = React.useState<string | null>(null)
  const [filterPeriod, setFilterPeriod] = React.useState<FilterPeriod>('week')
  const [showReportDialog, setShowReportDialog] = React.useState(false)
  const [expandedDays, setExpandedDays] = React.useState<Set<string>>(new Set())
  const [editingReport, setEditingReport] = React.useState<ReportedTime | null>(null)
  const [deletingReport, setDeletingReport] = React.useState<ReportedTime | null>(null)

  // Auto-select first project when projects load
  React.useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id)
    }
  }, [projects, selectedProjectId])

  const selectedProject = React.useMemo(() => {
    return selectedProjectId ? projects.find((p) => p.id === selectedProjectId) || null : null
  }, [selectedProjectId, projects])

  const { reportedTimes, isLoading: reportsLoading } = useReportedTimesQuery(
    selectedProject?.id || ''
  )
  const { deleteReport } = useReportsMutation()

  const handleProjectChange = (newProjectId: string) => {
    setSelectedProjectId(newProjectId)
  }

  // Filter reported times based on selected period
  const filteredReports = React.useMemo(() => {
    if (filterPeriod === 'all') return reportedTimes

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const getFilterDate = () => {
      switch (filterPeriod) {
        case 'today': {
          return today
        }
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
      case 'today': {
        return formatDate(today)
      }
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

  // Handler functions
  const toggleDayExpanded = (date: string) => {
    const newExpandedDays = new Set(expandedDays)
    if (newExpandedDays.has(date)) {
      newExpandedDays.delete(date)
    } else {
      newExpandedDays.add(date)
    }
    setExpandedDays(newExpandedDays)
  }

  const handleEditReport = (report: ReportedTime) => {
    setEditingReport(report)
    setShowReportDialog(true)
  }

  const handleDeleteClick = (report: ReportedTime) => {
    setDeletingReport(report)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingReport) return
    try {
      await deleteReport(deletingReport.id)
      setDeletingReport(null)
    } catch (error) {
      console.error('Failed to delete report:', error)
    }
  }

  const handleCloseDialog = () => {
    setShowReportDialog(false)
    setEditingReport(null)
  }

  if (projectsLoading || reportsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!selectedProject) {
    return (
      <div>
        <PageHeader title="Reports">
          <Select value={selectedProjectId || ''} onValueChange={handleProjectChange}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </PageHeader>
        <div className="p-4">
          <div className="text-center py-8 text-muted-foreground">
            Select a project to view reports
          </div>
        </div>
      </div>
    )
  }

  const headerTitle = `${selectedProject.title}${getDateRange ? ` (${getDateRange})` : ''}`

  return (
    <div>
      <PageHeader title={headerTitle}>
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
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="semimonth">Semi-month</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedProjectId || ''} onValueChange={handleProjectChange}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PageHeader>
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground border-b pb-2">
          <span className="font-medium">Total: {formatTime(overallTotal)}</span>
          {overallEarnings > 0 && (
            <span className="text-green-600 font-bold text-base">
              ${overallEarnings.toFixed(2)}
            </span>
          )}
        </div>
        <div className="space-y-2">
          {groupedReports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No time reports yet. Start tracking your work!
            </div>
          ) : (
            <div className="space-y-2">
              {groupedReports.map(([date, reports]) => (
                <DaySection
                  key={date}
                  date={date}
                  reports={reports}
                  isExpanded={expandedDays.has(date)}
                  onToggleExpanded={toggleDayExpanded}
                  onEditReport={handleEditReport}
                  onDeleteReport={handleDeleteClick}
                  getTotalTimeForDate={getTotalTimeForDate}
                  getTotalEarningsForDate={getTotalEarningsForDate}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <ReportDialog
        open={showReportDialog}
        onOpenChange={handleCloseDialog}
        project={selectedProject}
        editingReport={editingReport}
      />
      <ConfirmDialog
        open={!!deletingReport}
        onOpenChange={(open) => !open && setDeletingReport(null)}
        onSubmit={handleDeleteConfirm}
        title="Delete Report?"
        description={`Are you sure you want to delete this ${deletingReport?.duration ? formatTime(deletingReport.duration) : ''} report? This action cannot be undone.`}
        submitText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}

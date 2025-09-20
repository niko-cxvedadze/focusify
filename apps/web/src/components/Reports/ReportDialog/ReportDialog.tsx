import React from 'react'

import { Project, ReportForm } from '@repo/types'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { FormLabel } from '@/components/ui/form-label'
import { TimeInput } from '@/components/Form'

import { useReportsMutation } from '@/hooks/mutations/useReportsMutation'

interface ReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: Project
  onSuccess?: () => void
}

export function ReportDialog({
  open,
  onOpenChange,
  project,
  onSuccess
}: ReportDialogProps) {
  const { form, isLoading, handleFormSubmit } = useReportsMutation()

  // Set default values when dialog opens
  React.useEffect(() => {
    if (open) {
      form.reset({
        reportedAt: new Date().toISOString().split('T')[0],
        time: '01:00',
        hourlyRate: project.hourlyRate || undefined
      })
    }
  }, [open, form, project.hourlyRate])

  const handleSubmit = async (data: ReportForm) => {
    try {
      await handleFormSubmit(data, project.id, () => {
        onOpenChange(false)
        onSuccess?.()
      })
    } catch (error) {
      // Error is already handled in the mutation hook
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
    form.reset()
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset()
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Manual Report</DialogTitle>
          <DialogDescription>
            Manually add a time report for {project.title}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reportedAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Time (HH:MM)</FormLabel>
                  <FormControl>
                    <TimeInput field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hourlyRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel optional>Hourly Rate ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="25.00"
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => {
                        const value = e.target.value
                        field.onChange(value === '' ? undefined : parseFloat(value))
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={handleCancel} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isLoading}>
                Add Report
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

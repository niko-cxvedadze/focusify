import React from 'react'
import { ControllerRenderProps } from 'react-hook-form'

import { Input } from '@/components/ui/input'

interface TimeInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onBlur'> {
  field: ControllerRenderProps<any, any>
}

export function TimeInput({ field, ...props }: TimeInputProps) {
  return (
    <Input
      placeholder="11:00"
      {...props}
      {...field}
      onKeyDown={(e) => {
        // Allow navigation and control keys
        if (
          e.key === 'Backspace' ||
          e.key === 'Delete' ||
          e.key === 'Tab' ||
          e.key === 'Escape' ||
          e.key === 'Enter' ||
          e.key === 'ArrowLeft' ||
          e.key === 'ArrowRight' ||
          e.key === 'ArrowUp' ||
          e.key === 'ArrowDown'
        ) {
          return
        }
        // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        if ((e.key === 'a' || e.key === 'c' || e.key === 'v' || e.key === 'x') && e.ctrlKey) {
          return
        }
        // Allow only numbers and colon
        if (!/[0-9:]/.test(e.key)) {
          e.preventDefault()
        }
      }}
      onChange={(e) => {
        let value = e.target.value.replace(/[^\d:]/g, '') // Only allow digits and colon

        // Prevent multiple colons
        const colonCount = (value.match(/:/g) || []).length
        if (colonCount > 1) {
          value = value.replace(/:.*:/, ':')
        }

        // Validate minutes only when there's a colon (allow any hours)
        if (value.includes(':')) {
          const [hours, minutes] = value.split(':')

          // Validate minutes (00-59) if minutes are entered
          if (minutes && parseInt(minutes) > 59) {
            value = hours + ':59'
          }
        }

        field.onChange(value)
      }}
      onBlur={(e) => {
        let value = e.target.value

        // Ensure proper HH:MM format on blur
        if (value.length > 0) {
          // If user typed just numbers, format them
          if (!value.includes(':')) {
            if (value.length === 1) {
              value = '0' + value + ':00'
            } else if (value.length === 2) {
              value = value + ':00'
            } else if (value.length >= 3) {
              // Split into hours and minutes
              const hours = value.slice(0, -2) || '0'
              const minutes = value.slice(-2)
              value = hours.padStart(2, '0') + ':' + minutes
            }
          } else {
            // Ensure both parts are properly formatted
            const [hours, minutes] = value.split(':')
            const paddedHours = (hours || '0').padStart(2, '0')
            const paddedMinutes = (minutes || '0').padStart(2, '0')
            value = `${paddedHours}:${paddedMinutes}`
          }

          // Final validation (only check minutes, allow any hours)
          const [, minutes] = value.split(':').map(Number)
          if (minutes <= 59) {
            field.onChange(value)
          }
        }
        field.onBlur()
      }}
    />
  )
}
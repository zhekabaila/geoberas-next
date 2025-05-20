'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface DatePickerProps {
  value?: Date | undefined
  onChange?: (date: Date | undefined) => void
  type?: 'dialog' | 'dropdown' | 'popover'
  className?: string
}

export function DatePicker({ onChange, type = 'dialog', value = undefined, className }: DatePickerProps) {
  // const [date, setDate] = React.useState<Date>();
  let date = value
  const [isOpen, setIsOpen] = React.useState(false)

  const handleDateSelect = (selectedDate: Date | undefined) => {
    // setDate(selectedDate);
    date = selectedDate
    if (onChange) onChange(selectedDate)
    setIsOpen(false)
  }

  return (
    <>
      {type === 'dialog' && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start gap-2 text-left font-normal',
                !date && 'text-muted-foreground',
                className
              )}>
              <CalendarIcon className="w-4 h-4" />
              {date ? format(date, 'dd MMMM yyyy') : <span>Select a date</span>}
            </Button>
          </DialogTrigger>

          <DialogContent className="w-auto p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
            />
          </DialogContent>
        </Dialog>
      )}
      {type === 'dropdown' && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start gap-2 text-left font-normal',
                !date && 'text-muted-foreground',
                className
              )}>
              <CalendarIcon className="w-4 h-4" />
              {date ? format(date, 'dd MMMM yyyy') : <span>Select a date</span>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {type === 'popover' && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start gap-2 text-left font-normal',
                !date && 'text-muted-foreground',
                className
              )}>
              <CalendarIcon className="w-4 h-4" />
              {date ? format(date, 'dd MMMM yyyy') : <span>Select a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
          </PopoverContent>
        </Popover>
      )}
    </>
  )
}

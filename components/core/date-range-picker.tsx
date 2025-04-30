'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { DateRange } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { CalendarIcon } from 'lucide-react'

interface IProps {
  inputclassName?: string
  selected?: DateRange
  onDateChange?: (event?: DateRange) => void
  disableFutureDate?: boolean
  type?: 'popover' | 'dropdown'
  align?: 'start' | 'end' | 'center'
}

export function DateRangePicker({
  className,
  inputclassName,
  selected,
  onDateChange,
  disableFutureDate,
  type = 'popover',
  align = 'start'
}: React.HTMLAttributes<HTMLDivElement> & IProps) {
  return (
    <div className={cn('grid gap-2', className)}>
      {type === 'popover' && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={'outline'}
              className={cn(
                'w-full justify-start text-left font-normal',
                !selected && 'text-muted-foreground',
                inputclassName
              )}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selected?.from ? (
                selected.to ? (
                  <>
                    {format(selected.from, 'LLL dd, y')} - {format(selected.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(selected.from, 'LLL dd, y')
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align={align}>
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={selected?.from}
              selected={selected}
              disabled={(date) => {
                if (disableFutureDate) return date > new Date() || date < new Date('1900-01-01')
                return false
              }}
              onSelect={(range) => {
                if (onDateChange) onDateChange(range)
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      )}
      {type === 'dropdown' && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              id="date"
              variant={'outline'}
              className={cn(
                'w-full justify-start text-left font-normal',
                !selected && 'text-muted-foreground',
                inputclassName
              )}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selected?.from ? (
                selected.to ? (
                  <>
                    {format(selected.from, 'dd MMMM yyyy')} - {format(selected.to, 'dd MMMM yyyy')}
                  </>
                ) : (
                  format(selected.from, 'dd MMMM yyyy')
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={align} className="w-auto p-0">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={selected?.from}
              selected={selected}
              disabled={(date) => {
                if (disableFutureDate) return date > new Date() || date < new Date('1900-01-01')
                return false
              }}
              onSelect={(range) => {
                if (onDateChange) onDateChange(range)
              }}
              numberOfMonths={2}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}

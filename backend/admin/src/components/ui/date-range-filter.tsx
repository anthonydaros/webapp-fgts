"use client"

import * as React from "react"
import { addDays, format, isValid, parse } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

interface DateRangeFilterProps {
  dateRange: DateRange | undefined
  onDateRangeChange: (range: DateRange | undefined) => void
  align?: "start" | "center" | "end"
}

export function DateRangeFilter({
  dateRange,
  onDateRangeChange,
  align = "end",
}: DateRangeFilterProps) {
  const [inputValue, setInputValue] = React.useState("")

  // Update input field when dateRange changes
  React.useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      setInputValue(`${format(dateRange.from, "dd/MM/yyyy")} - ${format(dateRange.to, "dd/MM/yyyy")}`)
    } else {
      setInputValue("")
    }
  }, [dateRange])

  // Handle manual date input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    const [fromStr, toStr] = e.target.value.split(" - ")
    
    if (fromStr && toStr) {
      const fromDate = parse(fromStr.trim(), "dd/MM/yyyy", new Date())
      const toDate = parse(toStr.trim(), "dd/MM/yyyy", new Date())
      
      if (isValid(fromDate) && isValid(toDate)) {
        onDateRangeChange({ from: fromDate, to: toDate })
      }
    }
  }

  // Shortcut buttons
  const handleShortcut = (days: number) => {
    const to = new Date()
    const from = addDays(to, -days)
    onDateRangeChange({ from, to })
  }

  return (
    <div className="flex gap-2">
      <div className="relative">
        <Input
          placeholder="DD/MM/AAAA - DD/MM/AAAA"
          value={inputValue}
          onChange={handleInputChange}
          className="w-64 bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-400 pl-10"
        />
        <CalendarIcon className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-10 bg-slate-800/50 border-slate-700 text-slate-100 hover:bg-slate-700 hover:text-slate-100"
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align={align}
          className="w-auto p-0 bg-slate-800 border-slate-700"
        >
          <div className="p-3 border-b border-slate-700">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShortcut(7)}
                className="flex-1 bg-slate-800/50 border-slate-700 text-slate-100 hover:bg-slate-700 hover:text-slate-100"
              >
                7 dias
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShortcut(30)}
                className="flex-1 bg-slate-800/50 border-slate-700 text-slate-100 hover:bg-slate-700 hover:text-slate-100"
              >
                30 dias
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShortcut(60)}
                className="flex-1 bg-slate-800/50 border-slate-700 text-slate-100 hover:bg-slate-700 hover:text-slate-100"
              >
                60 dias
              </Button>
            </div>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={onDateRangeChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
} 
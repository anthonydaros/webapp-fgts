"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import ptBR from "date-fns/locale/pt-BR"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium text-slate-100",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-slate-700"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-slate-400 rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-slate-800/50 [&:has([aria-selected])]:bg-slate-800 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 text-slate-100 hover:bg-slate-700"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary-500 text-primary-50 hover:bg-primary-500 hover:text-primary-50 focus:bg-primary-500 focus:text-primary-50",
        day_today: "bg-slate-800 text-slate-100",
        day_outside:
          "day-outside text-slate-400 opacity-50 aria-selected:bg-slate-800/50 aria-selected:text-slate-100 aria-selected:opacity-30",
        day_disabled: "text-slate-400 opacity-50",
        day_range_middle:
          "aria-selected:bg-slate-800 aria-selected:text-slate-100",
        day_hidden: "invisible",
        ...classNames,
      }}
      locale={ptBR}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar } 
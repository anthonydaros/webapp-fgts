import * as React from "react"
import { Tooltip as RechartsTooltip, TooltipProps } from "recharts"

import { cn } from "@/lib/utils"

export type ChartConfig = Record<string, { label: string; color: string }>

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
}

export function ChartContainer({
  config,
  children,
  className,
  ...props
}: ChartContainerProps) {
  const cssProperties = React.useMemo(() => {
    return Object.entries(config).reduce((acc, [key, value]) => {
      acc[`--color-${key}`] = value.color
      return acc
    }, {} as Record<string, string>)
  }, [config])

  return (
    <div
      className={cn("h-[400px] w-full", className)}
      style={cssProperties}
      {...props}
    >
      {children}
    </div>
  )
}

interface ChartTooltipProps<TValue extends number | string | Array<number | string>, TName extends string>
  extends Omit<TooltipProps<TValue, TName>, "content"> {
  content?: React.ReactNode
  defaultIndex?: number
}

export function ChartTooltip<TValue extends number | string | Array<number | string>, TName extends string>({
  content,
  cursor = false,
  defaultIndex,
  ...props
}: ChartTooltipProps<TValue, TName>) {
  return (
    <RechartsTooltip
      content={content as TooltipProps<TValue, TName>["content"]}
      cursor={cursor}
      defaultIndex={defaultIndex}
      {...props}
    />
  )
}

interface ChartTooltipContentProps {
  active?: boolean
  payload?: any[]
  label?: string
  config?: ChartConfig
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  config,
}: ChartTooltipContentProps) {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="rounded-lg border border-slate-200/10 bg-slate-800/90 p-2 shadow-md">
      <div className="grid gap-2">
        {label && (
          <div className="flex items-center gap-2">
            <div className="font-medium text-slate-100">{label}</div>
          </div>
        )}
        <div className="grid gap-1">
          {payload.map((item: any, index: number) => {
            const color = config?.[item.dataKey]?.color ?? item.color
            const label = config?.[item.dataKey]?.label ?? item.name
            return (
              <div key={index} className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full" style={{ background: color }} />
                <span className="text-sm text-slate-300">{label}</span>
                <span className="text-sm font-medium text-slate-100">
                  {Intl.NumberFormat("pt-BR").format(item.value)}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
} 
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatPercent(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export function getPnLColor(value: number): string {
  if (value > 0) return 'text-green-400'
  if (value < 0) return 'text-red-400'
  return 'text-gray-400'
}

export function getPnLBg(value: number): string {
  if (value > 0) return 'bg-green-400/10 border-green-400/20'
  if (value < 0) return 'bg-red-400/10 border-red-400/20'
  return 'bg-gray-400/10 border-gray-400/20'
}

export function calculateWinRate(trades: { pnl: number }[]): number {
  if (trades.length === 0) return 0
  const wins = trades.filter(t => t.pnl > 0).length
  return (wins / trades.length) * 100
}

export function calculateProfitFactor(trades: { pnl: number }[]): number {
  const grossProfit = trades.filter(t => t.pnl > 0).reduce((s, t) => s + t.pnl, 0)
  const grossLoss = Math.abs(trades.filter(t => t.pnl < 0).reduce((s, t) => s + t.pnl, 0))
  if (grossLoss === 0) return grossProfit > 0 ? 999 : 0
  return grossProfit / grossLoss
}

export function calculateExpectancy(trades: { pnl: number }[]): number {
  if (trades.length === 0) return 0
  return trades.reduce((s, t) => s + t.pnl, 0) / trades.length
}

export function calculateMaxDrawdown(equity: number[]): number {
  let peak = equity[0]
  let maxDD = 0
  for (const val of equity) {
    if (val > peak) peak = val
    const dd = ((peak - val) / peak) * 100
    if (dd > maxDD) maxDD = dd
  }
  return maxDD
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

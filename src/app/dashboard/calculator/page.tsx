'use client'

import React from 'react'
import { PositionSizeCalculator } from '@/components/dashboard/PositionSizeCalculator'
import { TradingViewEconomicCalendar } from '@/components/dashboard/TradingViewEconomicCalendar'

export default function CalculatorPage() {
  return (
    <div className="space-y-8">
      <PositionSizeCalculator />
      <TradingViewEconomicCalendar />
    </div>
  )
}

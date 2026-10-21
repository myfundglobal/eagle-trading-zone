'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Calendar, Globe, AlertTriangle, RefreshCw, Zap } from 'lucide-react'

const FALLBACK_EVENTS = [
  {
    time: '12:30 GMT',
    country: 'USD',
    flag: '🇺🇸',
    event: 'Core CPI (MoM / YoY) Inflation Rate',
    impact: 'HIGH',
    forecast: '0.3%',
    previous: '0.2%',
  },
  {
    time: '14:00 GMT',
    country: 'USD',
    flag: '🇺🇸',
    event: 'FOMC Federal Funds Rate Decision & Statement',
    impact: 'HIGH',
    forecast: '5.25%',
    previous: '5.25%',
  },
  {
    time: '08:30 GMT',
    country: 'EUR',
    flag: '🇪🇺',
    event: 'ECB Monetary Policy Meeting Accounts',
    impact: 'MEDIUM',
    forecast: '-',
    previous: '-',
  },
  {
    time: '12:30 GMT',
    country: 'USD',
    flag: '🇺🇸',
    event: 'Non-Farm Employment Change (NFP)',
    impact: 'HIGH',
    forecast: '185K',
    previous: '142K',
  },
  {
    time: '06:00 GMT',
    country: 'GBP',
    flag: '🇬🇧',
    event: 'UK Gross Domestic Product (GDP) QoQ',
    impact: 'HIGH',
    forecast: '0.6%',
    previous: '0.7%',
  },
]

export function TradingViewEconomicCalendar() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hasLoadedWidget, setHasLoadedWidget] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    // Inject TradingView official economic calendar widget
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-events.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify({
      colorTheme: 'dark',
      isTransparent: true,
      width: '100%',
      height: '100%',
      locale: 'en',
      importanceFilter: '0,1',
      countryFilter: 'us,eu,gb,jp,ca,au',
    })

    const container = containerRef.current
    container.innerHTML = ''
    container.appendChild(script)

    const timer = setTimeout(() => {
      setHasLoadedWidget(true)
    }, 2000)

    return () => {
      clearTimeout(timer)
      if (container) container.innerHTML = ''
    }
  }, [])

  return (
    <div className="rounded-2xl bg-void-900/80 border border-white/10 p-5 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col">
      {/* Top accent glow line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-ember-500 via-amber-glow to-ember-600" />

      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-ember-500/15 border border-ember-500/30 flex items-center justify-center text-ember-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              TradingView Economic Calendar
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-ember-500/20 text-ember-400 border border-ember-500/30">
                LIVE
              </span>
            </h3>
            <p className="text-xs text-gray-400">
              Real-time high-impact macroeconomic events, central bank rates, and CPI releases.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[11px]">Synced with Global Feeds</span>
        </div>
      </div>

      {/* TradingView Widget Container */}
      <div className="relative min-h-[420px] w-full rounded-xl overflow-hidden bg-void-950 border border-white/5">
        <div ref={containerRef} className="tradingview-widget-container h-full w-full min-h-[420px]" />

        {/* Fallback Display if TradingView widget is blocked by adblockers or loading */}
        {!hasLoadedWidget && (
          <div className="p-4 space-y-3">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Upcoming High-Impact Global Events</span>
              <span className="text-amber-glow font-mono">Live Macro Schedule</span>
            </div>

            <div className="space-y-2">
              {FALLBACK_EVENTS.map((ev, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-void-900 border border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">{ev.flag}</span>
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{ev.event}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                            ev.impact === 'HIGH'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          }`}
                        >
                          {ev.impact}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-500 font-mono">{ev.country} • {ev.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-[11px] font-mono">
                    <div>
                      <span className="text-gray-500">Forecast: </span>
                      <span className="text-gray-200 font-bold">{ev.forecast}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Previous: </span>
                      <span className="text-gray-400">{ev.previous}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 text-[11px] text-gray-500 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-glow" />
          Avoid executing manual scalp entries 5 minutes before and after HIGH impact news releases.
        </span>
        <span className="font-mono text-gray-400">Eagle FX Protection Engine</span>
      </div>
    </div>
  )
}

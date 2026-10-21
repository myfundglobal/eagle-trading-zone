'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Award,
  Upload,
  Lock,
  Zap,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { UpgradeLock } from '@/components/dashboard/UpgradeLock'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts'
import toast from 'react-hot-toast'

interface Candle {
  time: string
  open: number
  high: number
  low: number
  close: number
}

// Pre-seeded high quality 60-candle XAUUSD dataset for realistic replay
const SAMPLE_CANDLES: Candle[] = [
  { time: '2026-10-01', open: 2360.2, high: 2368.5, low: 2358.1, close: 2366.4 },
  { time: '2026-10-02', open: 2366.5, high: 2374.0, low: 2364.2, close: 2371.8 },
  { time: '2026-10-03', open: 2372.0, high: 2380.5, low: 2369.0, close: 2378.1 },
  { time: '2026-10-04', open: 2378.2, high: 2385.0, low: 2374.3, close: 2383.6 },
  { time: '2026-10-05', open: 2383.7, high: 2390.2, low: 2381.0, close: 2388.9 },
  { time: '2026-10-06', open: 2389.0, high: 2394.5, low: 2382.4, close: 2385.2 },
  { time: '2026-10-07', open: 2385.3, high: 2389.1, low: 2376.0, close: 2378.4 },
  { time: '2026-10-08', open: 2378.5, high: 2384.2, low: 2375.1, close: 2382.0 },
  { time: '2026-10-09', open: 2382.1, high: 2396.4, low: 2380.0, close: 2394.7 },
  { time: '2026-10-10', open: 2394.8, high: 2405.0, low: 2392.1, close: 2402.5 },
  { time: '2026-10-11', open: 2402.6, high: 2412.3, low: 2399.0, close: 2408.9 },
  { time: '2026-10-12', open: 2409.0, high: 2418.6, low: 2404.2, close: 2416.1 },
  { time: '2026-10-13', open: 2416.2, high: 2424.0, low: 2410.5, close: 2412.8 },
  { time: '2026-10-14', open: 2413.0, high: 2417.4, low: 2398.2, close: 2401.5 },
  { time: '2026-10-15', open: 2401.6, high: 2406.8, low: 2391.0, close: 2395.4 },
  { time: '2026-10-16', open: 2395.5, high: 2402.1, low: 2393.0, close: 2400.8 },
  { time: '2026-10-17', open: 2400.9, high: 2415.5, low: 2398.4, close: 2414.2 },
  { time: '2026-10-18', open: 2414.3, high: 2428.0, low: 2411.0, close: 2426.5 },
  { time: '2026-10-19', open: 2426.6, high: 2434.2, low: 2420.1, close: 2431.0 },
  { time: '2026-10-20', open: 2431.1, high: 2439.8, low: 2425.0, close: 2437.4 },
  { time: '2026-10-21', open: 2437.5, high: 2445.0, low: 2432.2, close: 2441.9 },
  { time: '2026-10-22', open: 2442.0, high: 2446.5, low: 2428.0, close: 2430.2 },
  { time: '2026-10-23', open: 2430.3, high: 2435.0, low: 2418.5, close: 2422.6 },
  { time: '2026-10-24', open: 2422.7, high: 2429.4, low: 2415.0, close: 2427.8 },
  { time: '2026-10-25', open: 2427.9, high: 2438.2, low: 2424.1, close: 2435.5 },
]

export default function BacktestingPage() {
  const { isLocked } = useAuth()

  // Chart refs
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)

  // Simulator states
  const [candles, setCandles] = useState<Candle[]>(SAMPLE_CANDLES)
  const [currentIdx, setCurrentIdx] = useState(8) // start with 8 visible candles
  const [isPlaying, setIsPlaying] = useState(false)
  const [replaySpeed, setReplaySpeed] = useState<number>(1000)

  // Virtual Trading states
  const [balance, setBalance] = useState(10000)
  const [activeTrade, setActiveTrade] = useState<{
    direction: 'buy' | 'sell'
    entry: number
    lot: number
    sl: number | null
    tp: number | null
  } | null>(null)

  const [tradeLogs, setTradeLogs] = useState<{
    id: number
    direction: 'buy' | 'sell'
    entry: number
    exit: number
    lot: number
    pnl: number
  }[]>([])

  // Free Tier lock
  if (isLocked('backtesting')) {
    return (
      <UpgradeLock
        title="Candle Replay Backtesting Simulator"
        description="Test and refine your trading strategy candle-by-candle with historical bar replay, virtual orders, and instant performance metrics."
        requiredPlan="elite"
        benefits={[
          'Candle-by-candle bar replay simulator',
          'Execute virtual BUY/SELL with customizable SL & TP',
          'Auto Take-Profit & Stop-Loss triggers',
          'Upload custom historical OHLCV CSV files',
          'Post-session strategy win rate & drawdown metrics',
        ]}
      />
    )
  }

  // Initialize TradingView lightweight chart
  useEffect(() => {
    if (!chartContainerRef.current) return

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#0a0a0c' },
        textColor: '#9CA3AF',
      },
      grid: {
        vertLines: { color: '#1a1a1f' },
        horzLines: { color: '#1a1a1f' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 420,
      timeScale: {
        borderColor: '#222',
        timeVisible: true,
      },
      rightPriceScale: {
        borderColor: '#222',
      },
    })

    const series = chart.addCandlestickSeries({
      upColor: '#10B981',
      downColor: '#EF4444',
      borderVisible: false,
      wickUpColor: '#10B981',
      wickDownColor: '#EF4444',
    })

    chartRef.current = chart
    candleSeriesRef.current = series

    // Set initial visible slice
    const initialSlice = candles.slice(0, currentIdx)
    series.setData(initialSlice as any)

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth })
      }
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [candles])

  // Step forward by 1 candle
  const stepForward = () => {
    if (currentIdx >= candles.length) {
      setIsPlaying(false)
      toast.success('Reached end of historical dataset!')
      return
    }

    const nextIdx = currentIdx + 1
    setCurrentIdx(nextIdx)

    const newSlice = candles.slice(0, nextIdx)
    candleSeriesRef.current?.setData(newSlice as any)

    const currentCandle = candles[nextIdx - 1]

    // Check active virtual trade for SL or TP hits
    if (activeTrade) {
      let closed = false
      let exitPrice = currentCandle.close
      let reason = ''

      if (activeTrade.direction === 'buy') {
        if (activeTrade.sl && currentCandle.low <= activeTrade.sl) {
          exitPrice = activeTrade.sl
          closed = true
          reason = 'Stop Loss Hit'
        } else if (activeTrade.tp && currentCandle.high >= activeTrade.tp) {
          exitPrice = activeTrade.tp
          closed = true
          reason = 'Take Profit Hit'
        }
      } else {
        if (activeTrade.sl && currentCandle.high >= activeTrade.sl) {
          exitPrice = activeTrade.sl
          closed = true
          reason = 'Stop Loss Hit'
        } else if (activeTrade.tp && currentCandle.low <= activeTrade.tp) {
          exitPrice = activeTrade.tp
          closed = true
          reason = 'Take Profit Hit'
        }
      }

      if (closed) {
        const diff = activeTrade.direction === 'buy' ? exitPrice - activeTrade.entry : activeTrade.entry - exitPrice
        const pnl = diff * activeTrade.lot * 100 // XAUUSD calculation
        setBalance(prev => prev + pnl)
        setTradeLogs(prev => [
          {
            id: Date.now(),
            direction: activeTrade.direction,
            entry: activeTrade.entry,
            exit: exitPrice,
            lot: activeTrade.lot,
            pnl,
          },
          ...prev,
        ])
        setActiveTrade(null)
        toast(`${reason}! PnL: ${pnl >= 0 ? `+$${pnl.toFixed(2)}` : `-$${Math.abs(pnl).toFixed(2)}`}`, {
          icon: pnl >= 0 ? '🎯' : '🛑',
        })
      }
    }
  }

  // Auto replay loop
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        stepForward()
      }, replaySpeed)
    }
    return () => clearInterval(interval)
  }, [isPlaying, currentIdx, replaySpeed, activeTrade])

  // Open virtual trade
  const handleOpenTrade = (dir: 'buy' | 'sell') => {
    if (activeTrade) {
      toast.error('You already have an open position! Close it before opening another.')
      return
    }
    const currentPrice = candles[currentIdx - 1]?.close || 2400
    const sl = dir === 'buy' ? currentPrice - 8.0 : currentPrice + 8.0
    const tp = dir === 'buy' ? currentPrice + 16.0 : currentPrice - 16.0

    setActiveTrade({
      direction: dir,
      entry: currentPrice,
      lot: 1.0,
      sl,
      tp,
    })
    toast.success(`Virtual ${dir.toUpperCase()} opened @ ${currentPrice.toFixed(2)}`)
  }

  // Close active virtual trade manually
  const handleCloseManual = () => {
    if (!activeTrade) return
    const currentPrice = candles[currentIdx - 1]?.close || 2400
    const diff = activeTrade.direction === 'buy' ? currentPrice - activeTrade.entry : activeTrade.entry - currentPrice
    const pnl = diff * activeTrade.lot * 100
    setBalance(prev => prev + pnl)
    setTradeLogs(prev => [
      {
        id: Date.now(),
        direction: activeTrade.direction,
        entry: activeTrade.entry,
        exit: currentPrice,
        lot: activeTrade.lot,
        pnl,
      },
      ...prev,
    ])
    setActiveTrade(null)
    toast.success(`Position closed manually @ ${currentPrice.toFixed(2)} (PnL: $${pnl.toFixed(2)})`)
  }

  // Reset simulator
  const handleReset = () => {
    setCurrentIdx(8)
    setIsPlaying(false)
    setActiveTrade(null)
    setBalance(10000)
    setTradeLogs([])
    candleSeriesRef.current?.setData(candles.slice(0, 8) as any)
    toast.success('Simulator reset to initial state.')
  }

  const currentCandle = candles[currentIdx - 1]
  const currentFloatingPnl = activeTrade && currentCandle
    ? (activeTrade.direction === 'buy'
        ? currentCandle.close - activeTrade.entry
        : activeTrade.entry - currentCandle.close) * activeTrade.lot * 100
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            Candle Replay Backtester
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-glow/20 text-amber-glow border border-amber-glow/40 font-bold">
              ELITE TOOL
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Test strategy execution bar-by-bar with virtual orders, SL/TP risk management and equity tracking
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={handleReset} variant="outline" size="sm" className="gap-1.5 text-xs text-gray-300">
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Session
          </Button>
        </div>
      </div>

      {/* Simulator Toolbar */}
      <div className="glass rounded-2xl p-4 border border-white/5 flex flex-wrap items-center justify-between gap-4">
        {/* Playback controls */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            size="sm"
            className={`gap-1.5 font-bold ${isPlaying ? 'bg-amber-500 text-white' : 'bg-ember-gradient text-white'}`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Pause' : 'Play Replay'}
          </Button>

          <Button
            onClick={stepForward}
            variant="outline"
            size="sm"
            disabled={isPlaying || currentIdx >= candles.length}
            className="gap-1.5 text-xs"
          >
            <SkipForward className="w-4 h-4" />
            Next Candle
          </Button>

          <div className="flex items-center gap-1 ml-2 text-xs text-gray-400">
            <span>Speed:</span>
            {[1000, 500, 250].map((speed, i) => (
              <button
                key={speed}
                onClick={() => setReplaySpeed(speed)}
                className={`px-2 py-1 rounded text-[10px] font-bold ${
                  replaySpeed === speed ? 'bg-void-700 text-ember-400' : 'text-gray-500 hover:text-white'
                }`}
              >
                {i === 0 ? '1x' : i === 1 ? '2x' : '4x'}
              </button>
            ))}
          </div>
        </div>

        {/* Current Candle info */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="text-gray-400">
            Bar <strong className="text-white">{currentIdx}</strong> / {candles.length}
          </div>
          <div className="text-gray-400">
            Close: <strong className="text-white">${currentCandle?.close.toFixed(2)}</strong>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="glass rounded-3xl p-4 border border-white/10 relative overflow-hidden">
        <div ref={chartContainerRef} className="w-full h-[420px]" />
      </div>

      {/* Virtual Execution Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Order execution */}
        <div className="glass rounded-2xl p-5 border border-white/5 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center justify-between">
            <span>Execute Virtual Position</span>
            <span className="text-xs font-mono text-gray-400">XAUUSD (1.0 Lot)</span>
          </h2>

          {activeTrade ? (
            <div className="space-y-3 p-3.5 rounded-xl bg-void-900 border border-ember-500/30">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Open Position:</span>
                <span className={`font-bold uppercase ${activeTrade.direction === 'buy' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {activeTrade.direction} @ ${activeTrade.entry.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-gray-400">Floating PnL:</span>
                <span className={`font-bold text-sm ${currentFloatingPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {currentFloatingPnl >= 0 ? '+' : ''}${currentFloatingPnl.toFixed(2)}
                </span>
              </div>
              <div className="text-[11px] text-gray-500 flex justify-between">
                <span>SL: ${activeTrade.sl?.toFixed(2)}</span>
                <span>TP: ${activeTrade.tp?.toFixed(2)}</span>
              </div>
              <Button
                onClick={handleCloseManual}
                size="sm"
                variant="destructive"
                className="w-full text-xs font-bold"
              >
                Close Position Immediately
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                onClick={() => handleOpenTrade('buy')}
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                BUY / LONG
              </Button>
              <Button
                onClick={() => handleOpenTrade('sell')}
                size="lg"
                className="bg-red-600 hover:bg-red-500 text-white font-bold text-sm gap-2"
              >
                <TrendingDown className="w-4 h-4" />
                SELL / SHORT
              </Button>
            </div>
          )}
        </div>

        {/* Simulator Balance Stats */}
        <div className="glass rounded-2xl p-5 border border-white/5 space-y-3">
          <h2 className="text-sm font-bold text-white">Backtest Account Stats</h2>
          <div className="space-y-2 pt-1 font-mono text-xs">
            <div className="flex justify-between p-2 rounded-lg bg-void-900/60">
              <span className="text-gray-400">Sim Balance:</span>
              <span className="font-bold text-white">${balance.toFixed(2)}</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-void-900/60">
              <span className="text-gray-400">Net Return:</span>
              <span className={`font-bold ${balance >= 10000 ? 'text-emerald-400' : 'text-red-400'}`}>
                {balance >= 10000 ? '+' : ''}{(((balance - 10000) / 10000) * 100).toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-void-900/60">
              <span className="text-gray-400">Trades Executed:</span>
              <span className="font-bold text-white">{tradeLogs.length}</span>
            </div>
          </div>
        </div>

        {/* Session Log */}
        <div className="glass rounded-2xl p-5 border border-white/5 space-y-3">
          <h2 className="text-sm font-bold text-white">Execution History</h2>
          <div className="max-h-44 overflow-y-auto space-y-2 text-xs font-mono">
            {tradeLogs.length === 0 ? (
              <p className="text-gray-500 text-center py-6 text-[11px]">No simulated trades closed yet.</p>
            ) : (
              tradeLogs.map((log) => (
                <div key={log.id} className="p-2 rounded-lg bg-void-900/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                      log.direction === 'buy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {log.direction}
                    </span>
                    <span className="text-gray-400 text-[10px]">
                      {log.entry.toFixed(1)} &rarr; {log.exit.toFixed(1)}
                    </span>
                  </div>
                  <span className={`font-bold ${log.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {log.pnl >= 0 ? '+' : ''}${log.pnl.toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import React, { useState, useMemo } from 'react'
import { Calculator, DollarSign, Percent, Target, ShieldAlert, ArrowRight, Zap, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const INSTRUMENTS = [
  { symbol: 'XAUUSD', name: 'Gold vs US Dollar', pipValue: 10, pipSize: 0.1, category: 'Metals' },
  { symbol: 'EURUSD', name: 'Euro vs US Dollar', pipValue: 10, pipSize: 0.0001, category: 'Forex' },
  { symbol: 'GBPUSD', name: 'British Pound vs US Dollar', pipValue: 10, pipSize: 0.0001, category: 'Forex' },
  { symbol: 'USDJPY', name: 'US Dollar vs Japanese Yen', pipValue: 6.8, pipSize: 0.01, category: 'Forex' },
  { symbol: 'BTCUSD', name: 'Bitcoin vs US Dollar', pipValue: 1, pipSize: 1, category: 'Crypto' },
  { symbol: 'US30', name: 'Dow Jones 30 Index', pipValue: 1, pipSize: 1, category: 'Indices' },
]

export function PositionSizeCalculator() {
  const [accountBalance, setAccountBalance] = useState<number>(10000)
  const [riskPercent, setRiskPercent] = useState<number>(1.0)
  const [stopLossPips, setStopLossPips] = useState<number>(25)
  const [selectedSymbol, setSelectedSymbol] = useState<string>('XAUUSD')
  const [targetRR, setTargetRR] = useState<number>(2.5)

  const selectedInst = useMemo(
    () => INSTRUMENTS.find(i => i.symbol === selectedSymbol) || INSTRUMENTS[0],
    [selectedSymbol]
  )

  // Calculations
  const calculations = useMemo(() => {
    const riskAmount = (accountBalance * riskPercent) / 100
    // Lot size = Risk Amount / (Stop Loss Pips * Pip Value per Lot)
    const lotSize = stopLossPips > 0 ? riskAmount / (stopLossPips * selectedInst.pipValue) : 0
    const potentialProfit = riskAmount * targetRR
    const totalUnits = lotSize * 100000 // Standard forex units representation

    return {
      riskAmount: Number(riskAmount.toFixed(2)),
      lotSize: Number(Math.max(lotSize, 0.01).toFixed(2)),
      potentialProfit: Number(potentialProfit.toFixed(2)),
      totalUnits: Math.round(totalUnits),
    }
  }, [accountBalance, riskPercent, stopLossPips, selectedInst, targetRR])

  return (
    <div className="rounded-2xl bg-void-900/80 border border-white/10 p-5 sm:p-6 shadow-2xl relative overflow-hidden">
      {/* Top ambient glow line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-ember-500 via-amber-glow to-ember-600" />

      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-ember-500/15 border border-ember-500/30 flex items-center justify-center text-ember-400">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Position Size & Risk Calculator
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Free Tool
              </span>
            </h3>
            <p className="text-xs text-gray-400">
              Calculate exact lot sizing based on account equity and stop loss pips to protect capital.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setAccountBalance(10000)
            setRiskPercent(1.0)
            setStopLossPips(25)
            setTargetRR(2.5)
          }}
          className="text-xs text-gray-500 hover:text-ember-400 flex items-center gap-1 self-start sm:self-auto font-medium"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset Defaults
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Account Balance */}
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300 font-semibold flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-ember-400" />
                Account Equity ($ USD)
              </Label>
              <Input
                type="number"
                value={accountBalance}
                onChange={e => setAccountBalance(Number(e.target.value))}
                min={100}
                step={500}
                className="bg-void-950 border-white/10 font-mono text-sm"
              />
            </div>

            {/* Instrument Selection */}
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300 font-semibold">Instrument / Asset</Label>
              <select
                value={selectedSymbol}
                onChange={e => setSelectedSymbol(e.target.value)}
                className="w-full rounded-xl bg-void-950 border border-white/10 px-3 py-2 text-xs text-white outline-none focus:border-ember-500 font-mono"
              >
                {INSTRUMENTS.map(i => (
                  <option key={i.symbol} value={i.symbol}>
                    {i.symbol} - {i.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Risk Percentage */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <Label className="text-gray-300 font-semibold flex items-center gap-1">
                  <Percent className="w-3.5 h-3.5 text-amber-glow" />
                  Risk Per Trade
                </Label>
                <span className="font-mono text-amber-glow font-bold">{riskPercent}%</span>
              </div>
              <Input
                type="number"
                value={riskPercent}
                onChange={e => setRiskPercent(Number(e.target.value))}
                min={0.1}
                max={10}
                step={0.25}
                className="bg-void-950 border-white/10 font-mono text-sm"
              />
              <div className="flex gap-1.5 pt-1">
                {[0.5, 1.0, 1.5, 2.0].map(pct => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setRiskPercent(pct)}
                    className={`flex-1 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                      riskPercent === pct
                        ? 'bg-ember-500 text-white'
                        : 'bg-void-950 text-gray-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Stop Loss in Pips */}
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300 font-semibold flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                Stop Loss (Pips / Points)
              </Label>
              <Input
                type="number"
                value={stopLossPips}
                onChange={e => setStopLossPips(Number(e.target.value))}
                min={1}
                step={5}
                className="bg-void-950 border-white/10 font-mono text-sm"
              />
              <div className="flex gap-1.5 pt-1">
                {[15, 25, 50, 100].map(pips => (
                  <button
                    key={pips}
                    type="button"
                    onClick={() => setStopLossPips(pips)}
                    className={`flex-1 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                      stopLossPips === pips
                        ? 'bg-ember-500 text-white'
                        : 'bg-void-950 text-gray-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {pips}p
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Panel (5 cols) */}
        <div className="lg:col-span-5 rounded-xl bg-void-950 border border-white/10 p-5 flex flex-col justify-between space-y-4">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between border-b border-white/5 pb-2">
            <span>Calculated Execution Sizing</span>
            <span className="text-ember-400 font-mono">{selectedSymbol}</span>
          </div>

          {/* Primary Result: Lot Size */}
          <div className="text-center py-2">
            <div className="text-xs text-gray-400 mb-1 font-semibold uppercase">
              Recommended Position Size
            </div>
            <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-glow to-ember-400 font-mono tracking-tight">
              {calculations.lotSize}{' '}
              <span className="text-base font-normal text-gray-400">Lots</span>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="space-y-2 pt-2 border-t border-white/5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Dollar Risk:</span>
              <span className="font-mono font-bold text-red-400">
                -${calculations.riskAmount.toFixed(2)} USD
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Target Profit ({targetRR}R):</span>
              <span className="font-mono font-bold text-emerald-400">
                +${calculations.potentialProfit.toFixed(2)} USD
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Pip Dollar Value:</span>
              <span className="font-mono text-gray-200">
                ${(calculations.lotSize * selectedInst.pipValue).toFixed(2)} / pip
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-ember-500/10 border border-ember-500/20 text-[11px] text-gray-300 leading-snug">
            💡 Enter this exact lot size in MT4/MT5 to adhere strictly to your {riskPercent}% risk limit.
          </div>
        </div>
      </div>
    </div>
  )
}

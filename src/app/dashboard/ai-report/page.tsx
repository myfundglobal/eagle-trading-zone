'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BrainCircuit,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  RefreshCw,
} from 'lucide-react'
import { useTradesStore } from '@/lib/store'
import { useAuth } from '@/lib/auth-context'
import { UpgradeLock } from '@/components/dashboard/UpgradeLock'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import toast from 'react-hot-toast'

interface AIReportData {
  grade: string
  disciplineScore: number
  riskScore: number
  strengths: string[]
  weaknesses: string[]
  revengeTradingDetected: boolean
  revengeTradingSummary: string
  actionPlan: string[]
}

export default function AIReportPage() {
  const { trades } = useTradesStore()
  const { isLocked } = useAuth()

  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState<AIReportData | null>(null)

  // Gate check
  if (isLocked('ai_reports')) {
    return (
      <UpgradeLock
        title="AI Performance & Revenge Trading Audit"
        description="Institutional-grade AI evaluation that analyzes every journaled trade to grade your psychological composure, detect revenge trading spirals, and generate an actionable transformation plan."
        requiredPlan="pro"
        benefits={[
          'AI Trader Scorecard & Psychological Grade',
          'Automated Revenge Trading & Over-Leverage Detection',
          'Session probability & win-streak analysis',
          '30-Day Step-by-Step Strategic Action Blueprint',
          'Instant tactical blindspot identification',
        ]}
      />
    )
  }

  const handleGenerateReport = async () => {
    if (!trades || trades.length === 0) {
      toast.error('Log at least 1 trade in your journal before generating an AI audit.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/ai/analyze-trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trades }),
      })

      if (!res.ok) {
        throw new Error('Analysis failed')
      }

      const data = await res.json()
      setReport(data)
      toast.success('AI Performance Audit generated successfully!')
    } catch (err: any) {
      toast.error(err.message || 'Error generating report')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            AI Trade Auditor & Psychological Profiler
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-ember-500/20 text-ember-400 border border-ember-500/30 font-bold uppercase">
              AI Powered
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Identify emotional leaks, calculate risk discipline, and eliminate revenge trading
          </p>
        </div>

        <Button
          onClick={handleGenerateReport}
          disabled={loading}
          size="lg"
          className="w-full sm:w-auto gap-2 font-bold bg-ember-gradient text-white shadow-xl glow-ember"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Auditing {trades.length} Trades...
            </>
          ) : (
            <>
              <BrainCircuit className="w-4 h-4" />
              Generate AI Performance Audit
            </>
          )}
        </Button>
      </div>

      {/* Initial Call to Action if report not generated yet */}
      {!report && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-10 border border-white/10 text-center space-y-5"
        >
          <div className="w-20 h-20 rounded-3xl bg-ember-500/10 text-ember-400 flex items-center justify-center mx-auto border border-ember-500/30 glow-ember">
            <BrainCircuit className="w-10 h-10" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-xl font-bold text-white">Ready to Audit Your Trading Edge?</h2>
            <p className="text-xs text-gray-400">
              Our AI engine inspects your entry timing, session distributions, risk-to-reward ratios, and emotional notes across {trades.length} recorded journal trades.
            </p>
          </div>
          <Button onClick={handleGenerateReport} size="lg" className="gap-2 font-bold glow-ember">
            <Sparkles className="w-4 h-4" />
            Analyze My Trades Now
          </Button>
        </motion.div>
      )}

      {/* Report Results */}
      <AnimatePresence>
        {report && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Top Scorecard */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Overall Grade */}
              <div className="glass rounded-2xl p-5 border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Trader Grade</div>
                  <div className="text-4xl font-black text-gradient font-mono mt-1">
                    {report.grade}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1">Systematic Execution Index</div>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-ember-500/10 text-ember-400 border border-ember-500/30 flex items-center justify-center font-bold text-xl glow-ember-sm">
                  {report.grade}
                </div>
              </div>

              {/* Discipline Score */}
              <div className="glass rounded-2xl p-5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Discipline Score</span>
                  <span className="font-mono font-bold text-white text-sm">{report.disciplineScore}/100</span>
                </div>
                <Progress value={report.disciplineScore} className="h-2 bg-void-800" />
                <p className="text-[10px] text-gray-500">Based on rule adherence and consistency</p>
              </div>

              {/* Risk Management Score */}
              <div className="glass rounded-2xl p-5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Risk Score</span>
                  <span className="font-mono font-bold text-white text-sm">{report.riskScore}/100</span>
                </div>
                <Progress value={report.riskScore} className="h-2 bg-void-800" />
                <p className="text-[10px] text-gray-500">Lot sizing stability & drawdown defense</p>
              </div>
            </div>

            {/* Revenge Trading Alert Banner */}
            <div className={`p-5 rounded-2xl border ${
              report.revengeTradingDetected
                ? 'bg-red-500/10 border-red-500/40 text-red-200'
                : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
            }`}>
              <div className="flex items-start gap-3">
                {report.revengeTradingDetected ? (
                  <ShieldAlert className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {report.revengeTradingDetected ? '⚠️ High Risk: Revenge Trading Detected' : '✅ Composure Verified: No Revenge Trading'}
                  </h3>
                  <p className="text-xs mt-1 text-gray-300 leading-relaxed">
                    {report.revengeTradingSummary}
                  </p>
                </div>
              </div>
            </div>

            {/* Strengths & Weaknesses 2-Col */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tactical Strengths */}
              <div className="glass rounded-2xl p-5 border border-emerald-500/20 space-y-3">
                <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Key Tactical Strengths
                </h3>
                <div className="space-y-2 pt-1">
                  {report.strengths.map((s, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-gray-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fatal Blindspots */}
              <div className="glass rounded-2xl p-5 border border-red-500/20 space-y-3">
                <h3 className="text-sm font-bold text-red-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  Critical Execution Leaks
                </h3>
                <div className="space-y-2 pt-1">
                  {report.weaknesses.map((w, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-gray-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                      <span>{w}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 30-Day Action Plan */}
            <div className="glass rounded-2xl p-6 border border-white/5 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-glow" />
                30-Day Transformation Action Plan
              </h3>
              <p className="text-xs text-gray-400">
                Execute these prioritized steps over your next 20 trading sessions to shift your expectancy into top quartile:
              </p>
              <div className="space-y-2.5 pt-2">
                {report.actionPlan.map((action, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-void-900/80 border border-white/5">
                    <div className="w-6 h-6 rounded-full bg-ember-gradient text-white flex items-center justify-center text-xs font-bold font-mono">
                      {i + 1}
                    </div>
                    <span className="text-xs text-gray-200">{action}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

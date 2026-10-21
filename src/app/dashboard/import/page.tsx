'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Download,
  RotateCcw,
} from 'lucide-react'
import Papa from 'papaparse'
import { useTradesStore } from '@/lib/store'
import { useAuth } from '@/lib/auth-context'
import { UpgradeLock } from '@/components/dashboard/UpgradeLock'
import { Button } from '@/components/ui/button'
import { Trade } from '@/lib/mock-data'
import toast from 'react-hot-toast'

interface ColumnMapping {
  date: string
  symbol: string
  direction: string
  lots: string
  entry_price: string
  exit_price: string
  pnl: string
}

export default function CSVImportPage() {
  const router = useRouter()
  const { bulkImportTrades } = useTradesStore()
  const { isLocked } = useAuth()

  // File and parsing states
  const [file, setFile] = useState<File | null>(null)
  const [rawHeaders, setRawHeaders] = useState<string[]>([])
  const [rawRows, setRawRows] = useState<any[]>([])
  const [step, setStep] = useState<'upload' | 'map' | 'preview'>('upload')

  // Column mapping states
  const [mapping, setMapping] = useState<ColumnMapping>({
    date: '',
    symbol: '',
    direction: '',
    lots: '',
    entry_price: '',
    exit_price: '',
    pnl: '',
  })

  // Parsed trades for preview
  const [previewTrades, setPreviewTrades] = useState<Omit<Trade, 'id' | 'user_id'>[]>([])

  // Check if locked
  if (isLocked('csv_import')) {
    return (
      <UpgradeLock
        title="MT4/MT5 CSV History Import"
        description="Directly import thousands of past trades from MetaTrader 4, MetaTrader 5, or custom spreadsheets with automated column mapping."
        requiredPlan="pro"
        benefits={[
          'Instant MT4 / MT5 statement parser',
          'Automatic Buy / Sell and PnL detection',
          'Intelligent column auto-mapping algorithm',
          'Bulk import up to 10,000 trades at once',
          'Preserves dates, times, lots, and prices',
        ]}
      />
    )
  }

  // Handle file selection
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return

    setFile(selected)
    Papa.parse(selected, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          const headers = Object.keys(results.data[0] as object)
          setRawHeaders(headers)
          setRawRows(results.data)

          // Intelligent auto-mapping heuristics
          const findHeader = (patterns: string[]) => {
            return headers.find(h => patterns.some(p => h.toLowerCase().includes(p))) || ''
          }

          setMapping({
            date: findHeader(['time', 'date', 'open time', 'open_time']),
            symbol: findHeader(['item', 'symbol', 'pair', 'ticker']),
            direction: findHeader(['type', 'direction', 'side', 'action']),
            lots: findHeader(['volume', 'lots', 'size', 'lot']),
            entry_price: findHeader(['open price', 'entry', 'price', 'open']),
            exit_price: findHeader(['close price', 'exit', 'close']),
            pnl: findHeader(['profit', 'pnl', 'gain', 'net profit', 'swap']),
          })

          setStep('map')
          toast.success(`Loaded ${results.data.length} rows from ${selected.name}`)
        } else {
          toast.error('Could not detect data in this CSV file')
        }
      },
      error: (err) => {
        toast.error(`CSV parse error: ${err.message}`)
      },
    })
  }

  // Process mapping and generate preview
  const handleProceedToPreview = () => {
    if (!mapping.symbol || !mapping.entry_price) {
      toast.error('Please map at least Symbol and Entry Price')
      return
    }

    const parsed: Omit<Trade, 'id' | 'user_id'>[] = []

    rawRows.forEach((row) => {
      const symbol = (row[mapping.symbol] || 'EURUSD').toString().toUpperCase().trim()
      const rawDir = (row[mapping.direction] || 'buy').toString().toLowerCase()
      const direction: 'buy' | 'sell' = rawDir.includes('sell') || rawDir.includes('short') ? 'sell' : 'buy'
      const entry_price = parseFloat(row[mapping.entry_price]) || 1.0
      const exit_price = mapping.exit_price && row[mapping.exit_price] ? parseFloat(row[mapping.exit_price]) : null
      const lot_size = mapping.lots && row[mapping.lots] ? parseFloat(row[mapping.lots]) : 1.0
      const pnl = mapping.pnl && row[mapping.pnl] ? parseFloat(row[mapping.pnl]) : 0
      const rawDate = mapping.date && row[mapping.date] ? row[mapping.date] : new Date().toISOString()
      const trade_date = new Date(rawDate).toString() !== 'Invalid Date' ? new Date(rawDate).toISOString() : new Date().toISOString()

      parsed.push({
        symbol,
        direction,
        entry_price,
        exit_price,
        stop_loss: null,
        take_profit: null,
        lot_size,
        pnl,
        trade_date,
        close_date: exit_price ? new Date(trade_date).toISOString() : null,
        strategy_tag: 'CSV Import',
        notes: `Imported from ${file?.name || 'CSV'}`,
        emotion: 'Disciplined',
        rating: 4,
        session: 'London',
        screenshot_url: null,
        checklist: ['Imported Trade'],
        is_open: !exit_price,
      })
    })

    setPreviewTrades(parsed)
    setStep('preview')
  }

  // Confirm and Import
  const handleFinalImport = () => {
    bulkImportTrades(previewTrades)
    router.push('/dashboard/journal')
  }

  // Download Sample CSV
  const handleDownloadSample = () => {
    const csvContent =
      'Open Time,Symbol,Type,Volume,Open Price,Close Price,Profit\n' +
      '2026-10-10 09:15:00,EURUSD,buy,1.5,1.08500,1.08950,675.00\n' +
      '2026-10-11 13:30:00,XAUUSD,sell,2.0,2410.50,2395.20,3060.00\n' +
      '2026-10-12 10:00:00,GBPJPY,buy,1.0,195.400,194.800,-420.00\n'

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'eagle_sample_trades.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-black text-white">Import Trade History</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Bulk import from MetaTrader 4, MetaTrader 5, or custom CSV spreadsheets
          </p>
        </div>

        <Button
          onClick={handleDownloadSample}
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs text-gray-300"
        >
          <Download className="w-3.5 h-3.5" />
          Download Sample CSV
        </Button>
      </div>

      {/* Step 1: Upload */}
      {step === 'upload' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-8 border border-white/10 text-center space-y-6"
        >
          <div className="w-20 h-20 rounded-3xl bg-ember-500/10 text-ember-400 flex items-center justify-center mx-auto border border-ember-500/30 glow-ember-sm">
            <Upload className="w-10 h-10" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-lg font-bold text-white">Upload your Trade History CSV</h2>
            <p className="text-xs text-gray-400">
              In MT4/MT5: Go to <strong>Account History</strong> &rarr; Right Click &rarr; <strong>Save as Detailed Report</strong> or <strong>Export to CSV</strong>.
            </p>
          </div>

          <label className="inline-block cursor-pointer">
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
            <span className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-ember-gradient text-white font-bold text-sm shadow-xl glow-ember hover:opacity-90 transition-opacity">
              <FileSpreadsheet className="w-4 h-4" />
              Select CSV File from Computer
            </span>
          </label>
        </motion.div>
      )}

      {/* Step 2: Column Mapping */}
      {step === 'map' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-6 md:p-8 border border-white/10 space-y-6"
        >
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <div>
              <h2 className="text-lg font-bold text-white">Map Your Columns</h2>
              <p className="text-xs text-gray-400">
                Found {rawRows.length} rows in <strong>{file?.name}</strong>. Confirm which columns represent each trade attribute.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep('upload')}
              className="gap-1 text-xs text-gray-400"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Change File
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: 'symbol', label: 'Symbol / Pair *', required: true },
              { key: 'direction', label: 'Direction / Side (Buy/Sell)', required: true },
              { key: 'entry_price', label: 'Entry / Open Price *', required: true },
              { key: 'exit_price', label: 'Exit / Close Price', required: false },
              { key: 'lots', label: 'Volume / Lot Size', required: false },
              { key: 'pnl', label: 'Profit / Loss ($)', required: false },
              { key: 'date', label: 'Trade Date / Open Time', required: false },
            ].map(({ key, label, required }) => (
              <div key={key} className="space-y-1.5 p-3 rounded-xl bg-void-900/60 border border-white/5">
                <label className="text-xs font-semibold text-gray-300 flex items-center justify-between">
                  <span>{label}</span>
                  {required && <span className="text-[10px] text-ember-400 font-normal">Required</span>}
                </label>
                <select
                  value={(mapping as any)[key]}
                  onChange={e => setMapping(prev => ({ ...prev, [key]: e.target.value }))}
                  className="w-full h-10 rounded-xl border border-white/10 bg-void-800 text-xs text-white px-3"
                >
                  <option value="">-- Choose Column --</option>
                  {rawHeaders.map((h, i) => (
                    <option key={i} value={h}>
                      {h} (e.g. &quot;{rawRows[0]?.[h] || ''}&quot;)
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
            <Button variant="ghost" size="sm" onClick={() => setStep('upload')}>
              Cancel
            </Button>
            <Button onClick={handleProceedToPreview} size="sm" className="gap-2 font-bold glow-ember-sm">
              Review Parsed Trades ({rawRows.length})
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Preview & Confirm */}
      {step === 'preview' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-6 md:p-8 border border-white/10 space-y-6"
        >
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Ready to Import {previewTrades.length} Trades
              </h2>
              <p className="text-xs text-gray-400">
                Review a preview of the mapped trades below before saving into your journal.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep('map')}
              className="text-xs text-gray-400"
            >
              Adjust Mapping
            </Button>
          </div>

          <div className="max-h-80 overflow-y-auto border border-white/5 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-void-900 sticky top-0 border-b border-white/5 text-gray-400">
                <tr>
                  <th className="p-3">Symbol</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Lots</th>
                  <th className="p-3">Entry</th>
                  <th className="p-3">Exit</th>
                  <th className="p-3 text-right">Profit ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {previewTrades.slice(0, 15).map((t, i) => (
                  <tr key={i} className="hover:bg-white/5">
                    <td className="p-3 font-bold text-white">{t.symbol}</td>
                    <td className="p-3 uppercase font-semibold text-[10px] text-gray-300">{t.direction}</td>
                    <td className="p-3 font-mono">{t.lot_size}</td>
                    <td className="p-3 font-mono">{t.entry_price}</td>
                    <td className="p-3 font-mono">{t.exit_price || '-'}</td>
                    <td className={`p-3 font-mono text-right font-bold ${
                      (t.pnl || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {(t.pnl || 0) >= 0 ? '+' : ''}${t.pnl?.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {previewTrades.length > 15 && (
            <p className="text-xs text-gray-500 text-center italic">
              Showing first 15 of {previewTrades.length} trades. All {previewTrades.length} will be imported into your journal.
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
            <Button variant="ghost" size="sm" onClick={() => setStep('map')}>
              Back
            </Button>
            <Button onClick={handleFinalImport} size="lg" className="gap-2 font-bold glow-ember">
              Import All {previewTrades.length} Trades to Journal
              <CheckCircle2 className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

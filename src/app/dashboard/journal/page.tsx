'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Lock,
  Zap,
  Image as ImageIcon,
  CheckSquare,
  Star,
  X,
} from 'lucide-react'
import { useTradesStore } from '@/lib/store'
import { useAuth } from '@/lib/auth-context'
import { Trade } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const DEFAULT_CHECKLIST_ITEMS = [
  'Risk is <= 1-2% of account balance',
  'Higher timeframe trend confirmed (H4/D1)',
  'High-impact news event checked & avoided',
  'Stop loss & Take profit clearly defined',
]

export default function TradeJournalPage() {
  const { trades, addTrade, updateTrade, deleteTrade } = useTradesStore()
  const { user } = useAuth()

  // Modal states
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null)
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false)
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null)

  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [symbolFilter, setSymbolFilter] = useState('ALL')
  const [directionFilter, setDirectionFilter] = useState('ALL')
  const [outcomeFilter, setOutcomeFilter] = useState('ALL')

  // Form states
  const [form, setForm] = useState({
    symbol: 'XAUUSD',
    direction: 'buy' as 'buy' | 'sell',
    entry_price: '',
    exit_price: '',
    stop_loss: '',
    take_profit: '',
    lot_size: '1.0',
    pnl: '',
    trade_date: new Date().toISOString().slice(0, 16),
    strategy_tag: 'Order Block / FVG',
    notes: '',
    emotion: 'Disciplined' as Trade['emotion'],
    rating: 5,
    session: 'London' as Trade['session'],
    screenshot_url: '',
    checklist: [...DEFAULT_CHECKLIST_ITEMS],
  })

  // Open Add modal with limit check
  const handleOpenAddModal = () => {
    if (user?.plan === 'free' && user.role !== 'admin' && trades.length >= 15) {
      setUpgradeModalOpen(true)
      return
    }
    setEditingTrade(null)
    setForm({
      symbol: 'XAUUSD',
      direction: 'buy',
      entry_price: '',
      exit_price: '',
      stop_loss: '',
      take_profit: '',
      lot_size: '1.0',
      pnl: '',
      trade_date: new Date().toISOString().slice(0, 16),
      strategy_tag: 'Order Block / FVG',
      notes: '',
      emotion: 'Disciplined',
      rating: 5,
      session: 'London',
      screenshot_url: '',
      checklist: [...DEFAULT_CHECKLIST_ITEMS],
    })
    setModalOpen(true)
  }

  // Open Edit modal
  const handleOpenEditModal = (t: Trade) => {
    setEditingTrade(t)
    setForm({
      symbol: t.symbol,
      direction: t.direction,
      entry_price: t.entry_price.toString(),
      exit_price: t.exit_price ? t.exit_price.toString() : '',
      stop_loss: t.stop_loss ? t.stop_loss.toString() : '',
      take_profit: t.take_profit ? t.take_profit.toString() : '',
      lot_size: t.lot_size.toString(),
      pnl: t.pnl !== null ? t.pnl.toString() : '',
      trade_date: new Date(t.trade_date).toISOString().slice(0, 16),
      strategy_tag: t.strategy_tag || 'Standard',
      notes: t.notes || '',
      emotion: t.emotion,
      rating: t.rating || 5,
      session: t.session,
      screenshot_url: t.screenshot_url || '',
      checklist: t.checklist || [...DEFAULT_CHECKLIST_ITEMS],
    })
    setModalOpen(true)
  }

  // Auto calculate estimated PnL if entry, exit and lot size are filled and PnL is blank
  const handleCalculatePnl = () => {
    const entry = parseFloat(form.entry_price)
    const exit = parseFloat(form.exit_price)
    const lot = parseFloat(form.lot_size)
    if (!isNaN(entry) && !isNaN(exit) && !isNaN(lot)) {
      const diff = form.direction === 'buy' ? exit - entry : entry - exit
      // Simple multiplier estimation: for Gold (XAUUSD) 1 lot = 100 oz ($100 per $1 move); for FX 1 lot = $10 per pip
      const multiplier = form.symbol.toUpperCase().includes('XAU') ? 100 : form.symbol.toUpperCase().includes('JPY') ? 1000 : 100000
      const calcPnl = (diff * lot * (multiplier === 100 ? 100 : 10)).toFixed(2)
      setForm(prev => ({ ...prev, pnl: calcPnl }))
      toast.success(`Calculated PnL: $${calcPnl}`)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.symbol || !form.entry_price || !form.lot_size) {
      toast.error('Please enter Symbol, Entry Price, and Lot Size')
      return
    }

    const payload = {
      symbol: form.symbol.toUpperCase().trim(),
      direction: form.direction,
      entry_price: parseFloat(form.entry_price),
      exit_price: form.exit_price ? parseFloat(form.exit_price) : null,
      stop_loss: form.stop_loss ? parseFloat(form.stop_loss) : null,
      take_profit: form.take_profit ? parseFloat(form.take_profit) : null,
      lot_size: parseFloat(form.lot_size),
      pnl: form.pnl !== '' ? parseFloat(form.pnl) : null,
      trade_date: new Date(form.trade_date).toISOString(),
      close_date: form.exit_price ? new Date().toISOString() : null,
      strategy_tag: form.strategy_tag,
      notes: form.notes,
      emotion: form.emotion,
      rating: form.rating,
      session: form.session,
      screenshot_url: form.screenshot_url || null,
      checklist: form.checklist,
      is_open: !form.exit_price,
    }

    if (editingTrade) {
      updateTrade(editingTrade.id, payload)
    } else {
      const res = addTrade(payload)
      if (!res.success && res.error === 'LIMIT_REACHED') {
        setUpgradeModalOpen(true)
        setModalOpen(false)
        return
      }
    }
    setModalOpen(false)
  }

  // Filtered trades
  const filteredTrades = useMemo(() => {
    return trades.filter(t => {
      if (searchTerm) {
        const query = searchTerm.toLowerCase()
        const matchesSym = t.symbol.toLowerCase().includes(query)
        const matchesNotes = (t.notes || '').toLowerCase().includes(query)
        const matchesTag = (t.strategy_tag || '').toLowerCase().includes(query)
        if (!matchesSym && !matchesNotes && !matchesTag) return false
      }
      if (symbolFilter !== 'ALL' && t.symbol !== symbolFilter) return false
      if (directionFilter !== 'ALL' && t.direction !== directionFilter) return false
      if (outcomeFilter === 'WIN' && (t.pnl || 0) <= 0) return false
      if (outcomeFilter === 'LOSS' && (t.pnl || 0) >= 0) return false
      return true
    })
  }, [trades, searchTerm, symbolFilter, directionFilter, outcomeFilter])

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-black text-white">Trade Journal</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Log, tag, reflect and systematically review every trade execution
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button onClick={handleOpenAddModal} size="sm" className="w-full sm:w-auto gap-1.5 font-bold glow-ember-sm">
            <Plus className="w-4 h-4" />
            Log New Trade
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass rounded-2xl p-4 border border-white/5 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search by symbol, strategy tag, or notes..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9 h-10 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Symbol Quick Pills */}
          <select
            value={symbolFilter}
            onChange={e => setSymbolFilter(e.target.value)}
            className="h-10 text-xs rounded-xl border border-white/10 bg-void-800 text-white px-3"
          >
            <option value="ALL">All Symbols</option>
            <option value="XAUUSD">XAUUSD (Gold)</option>
            <option value="EURUSD">EURUSD</option>
            <option value="GBPUSD">GBPUSD</option>
            <option value="USDJPY">USDJPY</option>
            <option value="BTCUSD">BTCUSD</option>
          </select>

          {/* Direction */}
          <select
            value={directionFilter}
            onChange={e => setDirectionFilter(e.target.value)}
            className="h-10 text-xs rounded-xl border border-white/10 bg-void-800 text-white px-3"
          >
            <option value="ALL">All Types</option>
            <option value="buy">BUY Only</option>
            <option value="sell">SELL Only</option>
          </select>

          {/* Outcome */}
          <select
            value={outcomeFilter}
            onChange={e => setOutcomeFilter(e.target.value)}
            className="h-10 text-xs rounded-xl border border-white/10 bg-void-800 text-white px-3"
          >
            <option value="ALL">All Outcomes</option>
            <option value="WIN">Winners Only</option>
            <option value="LOSS">Losses Only</option>
          </select>
        </div>
      </div>

      {/* Journal Table / Cards */}
      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-void-900/60 text-gray-400">
                <th className="py-3 px-4">Date & Session</th>
                <th className="py-3 px-4">Pair</th>
                <th className="py-3 px-4">Side</th>
                <th className="py-3 px-4">Lots</th>
                <th className="py-3 px-4">Entry / Exit</th>
                <th className="py-3 px-4">SL / TP</th>
                <th className="py-3 px-4">Strategy & Tag</th>
                <th className="py-3 px-4">Emotion</th>
                <th className="py-3 px-4 text-right">PnL ($)</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTrades.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-gray-500">
                    No trades match the selected criteria. Click &quot;Log New Trade&quot; to begin.
                  </td>
                </tr>
              ) : (
                filteredTrades.map((t) => (
                  <tr key={t.id} className="hover:bg-white/5 transition-colors group">
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-white">{format(new Date(t.trade_date), 'MMM dd, yyyy')}</div>
                      <div className="text-[10px] text-gray-500 flex items-center gap-1.5 mt-0.5">
                        <span>{format(new Date(t.trade_date), 'HH:mm')}</span>
                        {t.session && <span className="px-1.5 py-0.2 rounded bg-void-700 text-gray-400">{t.session}</span>}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white text-sm">
                      {t.symbol}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider ${
                        t.direction === 'buy' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {t.direction}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-gray-300">
                      {t.lot_size}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-gray-300">
                      <div>{t.entry_price}</div>
                      <div className="text-[10px] text-gray-500">&rarr; {t.exit_price || 'Open'}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-gray-400">
                      <div>SL: {t.stop_loss || '-'}</div>
                      <div>TP: {t.take_profit || '-'}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-void-700 text-gray-300">
                        {t.strategy_tag || 'Standard'}
                      </span>
                      {t.notes && (
                        <p className="text-[10px] text-gray-500 truncate max-w-[140px] mt-1" title={t.notes}>
                          {t.notes}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-semibold ${
                        t.emotion === 'Disciplined' ? 'text-emerald-400' : t.emotion === 'Revenge' ? 'text-red-400 font-bold' : 'text-amber-400'
                      }`}>
                        {t.emotion || 'Neutral'}
                      </span>
                      {t.rating && (
                        <div className="flex items-center gap-0.5 text-amber-glow mt-0.5">
                          {Array.from({ length: t.rating }).map((_, i) => (
                            <Star key={i} className="w-2.5 h-2.5 fill-amber-glow" />
                          ))}
                        </div>
                      )}
                    </td>
                    <td className={`py-3.5 px-4 text-right font-mono font-bold text-sm ${
                      (t.pnl || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {(t.pnl || 0) >= 0 ? '+' : ''}${t.pnl !== null ? t.pnl.toFixed(2) : '0.00'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {t.screenshot_url && (
                          <button
                            onClick={() => setScreenshotPreview(t.screenshot_url)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-ember-400 hover:bg-white/5"
                            title="View Screenshot"
                          >
                            <ImageIcon className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEditModal(t)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteTrade(t.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/5"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Trade Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass rounded-3xl p-6 max-w-2xl w-full border border-white/10 my-8 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-ember-500 glow-ember-sm" />
                  {editingTrade ? 'Edit Trade' : 'Log New Trade'}
                </h2>
                <button onClick={() => setModalOpen(false)} className="p-1 text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="symbol" className="text-xs">Symbol / Pair *</Label>
                    <Input
                      id="symbol"
                      placeholder="e.g. XAUUSD, EURUSD"
                      value={form.symbol}
                      onChange={e => setForm(p => ({ ...p, symbol: e.target.value }))}
                      required
                      className="text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="direction" className="text-xs">Direction *</Label>
                    <select
                      id="direction"
                      value={form.direction}
                      onChange={e => setForm(p => ({ ...p, direction: e.target.value as 'buy' | 'sell' }))}
                      className="w-full h-10 rounded-xl border border-white/10 bg-void-800 text-xs text-white px-3"
                    >
                      <option value="buy">BUY / LONG</option>
                      <option value="sell">SELL / SHORT</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="lot_size" className="text-xs">Lot Size *</Label>
                    <Input
                      id="lot_size"
                      type="number"
                      step="0.01"
                      placeholder="1.0"
                      value={form.lot_size}
                      onChange={e => setForm(p => ({ ...p, lot_size: e.target.value }))}
                      required
                      className="text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="entry_price" className="text-xs">Entry Price *</Label>
                    <Input
                      id="entry_price"
                      type="number"
                      step="any"
                      placeholder="2380.50"
                      value={form.entry_price}
                      onChange={e => setForm(p => ({ ...p, entry_price: e.target.value }))}
                      required
                      className="text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="exit_price" className="text-xs">Exit Price</Label>
                    <Input
                      id="exit_price"
                      type="number"
                      step="any"
                      placeholder="2405.00"
                      value={form.exit_price}
                      onChange={e => setForm(p => ({ ...p, exit_price: e.target.value }))}
                      className="text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="stop_loss" className="text-xs">Stop Loss</Label>
                    <Input
                      id="stop_loss"
                      type="number"
                      step="any"
                      placeholder="2370.00"
                      value={form.stop_loss}
                      onChange={e => setForm(p => ({ ...p, stop_loss: e.target.value }))}
                      className="text-xs font-mono text-red-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="take_profit" className="text-xs">Take Profit</Label>
                    <Input
                      id="take_profit"
                      type="number"
                      step="any"
                      placeholder="2410.00"
                      value={form.take_profit}
                      onChange={e => setForm(p => ({ ...p, take_profit: e.target.value }))}
                      className="text-xs font-mono text-emerald-400"
                    />
                  </div>
                </div>

                {/* PnL and Calculation button */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                  <div className="space-y-1.5">
                    <Label htmlFor="pnl" className="text-xs">Net PnL ($)</Label>
                    <Input
                      id="pnl"
                      type="number"
                      step="any"
                      placeholder="e.g. 1250.00 or -450.00"
                      value={form.pnl}
                      onChange={e => setForm(p => ({ ...p, pnl: e.target.value }))}
                      className="text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCalculatePnl}
                      className="w-full text-xs"
                    >
                      Auto-Calculate from Prices
                    </Button>
                  </div>
                </div>

                {/* Strategy, Emotion, Session */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="strategy_tag" className="text-xs">Strategy Tag</Label>
                    <Input
                      id="strategy_tag"
                      placeholder="e.g. FVG, Breakout, OrderBlock"
                      value={form.strategy_tag}
                      onChange={e => setForm(p => ({ ...p, strategy_tag: e.target.value }))}
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="emotion" className="text-xs">Emotion</Label>
                    <select
                      id="emotion"
                      value={form.emotion || 'Disciplined'}
                      onChange={e => setForm(p => ({ ...p, emotion: e.target.value as Trade['emotion'] }))}
                      className="w-full h-10 rounded-xl border border-white/10 bg-void-800 text-xs text-white px-3"
                    >
                      <option value="Disciplined">Disciplined</option>
                      <option value="Confident">Confident</option>
                      <option value="FOMO">FOMO (Chasing)</option>
                      <option value="Revenge">Revenge Trading</option>
                      <option value="Fearful">Fearful</option>
                      <option value="Greedy">Greedy</option>
                      <option value="Neutral">Neutral</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="session" className="text-xs">Session</Label>
                    <select
                      id="session"
                      value={form.session || 'London'}
                      onChange={e => setForm(p => ({ ...p, session: e.target.value as Trade['session'] }))}
                      className="w-full h-10 rounded-xl border border-white/10 bg-void-800 text-xs text-white px-3"
                    >
                      <option value="London">London Session</option>
                      <option value="New York">New York Session</option>
                      <option value="Asian">Asian Session</option>
                      <option value="Overlap">London / NY Overlap</option>
                    </select>
                  </div>
                </div>

                {/* Screenshot URL */}
                <div className="space-y-1.5">
                  <Label htmlFor="screenshot_url" className="text-xs">Chart Screenshot URL (TradingView or direct image)</Label>
                  <Input
                    id="screenshot_url"
                    placeholder="https://www.tradingview.com/x/..."
                    value={form.screenshot_url}
                    onChange={e => setForm(p => ({ ...p, screenshot_url: e.target.value }))}
                    className="text-xs"
                  />
                </div>

                {/* Notes */}
                <div className="space-y-1.5">
                  <Label htmlFor="notes" className="text-xs">Trade Notes & Retrospective</Label>
                  <Textarea
                    id="notes"
                    placeholder="Why did you take this trade? Did you follow your rules? What did you learn?"
                    value={form.notes}
                    onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                    className="h-20 text-xs"
                  />
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" className="font-bold glow-ember-sm">
                    {editingTrade ? 'Save Changes' : 'Save Trade to Journal'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Free Limit Exceeded Modal */}
      <AnimatePresence>
        {upgradeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass rounded-3xl p-6 sm:p-8 max-w-md w-full border border-ember-500/40 text-center space-y-4 shadow-2xl relative"
            >
              <div className="w-16 h-16 rounded-2xl bg-ember-500/20 text-ember-400 mx-auto flex items-center justify-center border border-ember-500/40 glow-ember">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-white">Monthly Free Limit Reached!</h3>
              <p className="text-xs text-gray-300">
                You have reached your 15 trade limit for this month on the Free Plan. 
                Upgrade to <strong className="text-ember-400">Pro Trader</strong> to unlock unlimited trades, CSV imports, and AI reports!
              </p>
              <div className="flex flex-col gap-2 pt-2">
                <Link href="/dashboard/subscription" onClick={() => setUpgradeModalOpen(false)}>
                  <Button size="lg" className="w-full gap-2 font-bold bg-ember-gradient text-white">
                    <Zap className="w-4 h-4" />
                    Upgrade to Pro Plan ($19/mo)
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => setUpgradeModalOpen(false)} className="text-xs text-gray-500">
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Screenshot Preview Modal */}
      <AnimatePresence>
        {screenshotPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative max-w-4xl w-full glass rounded-3xl p-4 border border-white/10">
              <button
                onClick={() => setScreenshotPreview(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-void-800 text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden mt-2">
                <Image
                  src={screenshotPreview}
                  alt="Chart Screenshot"
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

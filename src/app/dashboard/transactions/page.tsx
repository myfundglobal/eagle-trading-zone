'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CreditCard,
  Search,
  Download,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTransactionsStore } from '@/lib/store'
import { Transaction } from '@/lib/mock-data'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export default function TransactionHistoryPage() {
  const { transactions } = useTransactionsStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedReceipt, setSelectedReceipt] = useState<Transaction | null>(null)

  const filtered = transactions.filter(t => {
    const matchesSearch =
      t.product_title.toLowerCase().includes(search.toLowerCase()) ||
      t.receipt_number.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase())

    if (statusFilter === 'ALL') return matchesSearch
    return matchesSearch && t.payment_status === statusFilter
  })

  const totalSpent = transactions
    .filter(t => t.payment_status === 'Completed')
    .reduce((acc, t) => acc + t.amount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <CreditCard className="w-7 h-7 text-ember-400" />
            Transaction History & Payment Logs
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Official ledger of your product purchases, memberships, and downloadable invoices.
          </p>
        </div>

        {/* Total stats card */}
        <div className="flex items-center gap-4 p-3 px-4 rounded-xl bg-void-900 border border-white/10 shrink-0">
          <div>
            <div className="text-[10px] text-gray-500 uppercase font-semibold">Total Invested</div>
            <div className="text-lg font-black text-white font-mono">${totalSpent.toFixed(2)} USD</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div>
            <div className="text-[10px] text-gray-500 uppercase font-semibold">Transactions</div>
            <div className="text-lg font-black text-ember-400 font-mono">{transactions.length}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Input
            placeholder="Search transactions or receipt #..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-void-900 border-white/10 text-xs"
          />
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="flex gap-2">
          {['ALL', 'Completed', 'Pending', 'Failed'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-ember-gradient text-white'
                  : 'bg-void-900 text-gray-400 hover:text-white border border-white/10'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-2xl bg-void-900/60 border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-void-950/60 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Product / Item</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-gray-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500">
                    No transactions match the selected filter.
                  </td>
                </tr>
              ) : (
                filtered.map(t => {
                  const statusColors = {
                    Completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
                    Pending: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
                    Failed: 'bg-red-500/10 text-red-400 border-red-500/30',
                  }[t.payment_status]

                  return (
                    <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-gray-200">
                        {t.id}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-white">
                        {t.product_title}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 text-gray-300 border border-white/10">
                          {t.product_type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        ${t.amount.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-gray-400">
                        {t.payment_method}
                      </td>
                      <td className="py-3.5 px-4 text-gray-400 font-mono text-[11px]">
                        {format(new Date(t.date), 'MMM dd, yyyy')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusColors}`}
                        >
                          {t.payment_status === 'Completed' && <CheckCircle2 className="w-3 h-3" />}
                          {t.payment_status === 'Pending' && <Clock className="w-3 h-3" />}
                          {t.payment_status === 'Failed' && <XCircle className="w-3 h-3" />}
                          {t.payment_status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedReceipt(t)}
                          className="h-7 text-xs text-ember-400 hover:text-white hover:bg-ember-500/10 gap-1 font-semibold"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Receipt
                        </Button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice / Receipt Modal */}
      <AnimatePresence>
        {selectedReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl bg-void-900 border border-white/10 p-6 sm:p-7 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Official Tax Invoice / Receipt
                </div>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 rounded-xl bg-void-950 border border-white/5 space-y-3 mb-6 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-500">Receipt No:</span>
                  <span className="text-white font-bold">{selectedReceipt.receipt_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Transaction ID:</span>
                  <span className="text-white">{selectedReceipt.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Item:</span>
                  <span className="text-white font-sans font-bold text-right max-w-[200px]">
                    {selectedReceipt.product_title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Gateway:</span>
                  <span className="text-white">{selectedReceipt.payment_method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date:</span>
                  <span className="text-white">{format(new Date(selectedReceipt.date), 'PPP p')}</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between text-sm">
                  <span className="text-gray-300 font-bold">Total Paid:</span>
                  <span className="text-ember-400 font-black">${selectedReceipt.amount.toFixed(2)} USD</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedReceipt(null)}
                  className="flex-1 text-xs border-white/10"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    toast.success('Invoice PDF generated and downloaded!')
                    setSelectedReceipt(null)
                  }}
                  className="flex-1 gap-1.5 bg-ember-gradient text-white text-xs font-bold"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download PDF
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

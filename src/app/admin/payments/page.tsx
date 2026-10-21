'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Eye,
  Check,
  X,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react'
import { usePaymentRequestsStore } from '@/lib/store'
import { PaymentRequest } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export default function AdminPaymentsPage() {
  const { requests, approveRequest, rejectRequest } = usePaymentRequestsStore()

  // Filter tabs
  const [tab, setTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [search, setSearch] = useState('')

  // Review modal
  const [selectedReq, setSelectedReq] = useState<PaymentRequest | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [isRejecting, setIsRejecting] = useState(false)
  const [screenshotZoom, setScreenshotZoom] = useState(false)

  // Filtered requests
  const filteredRequests = useMemo(() => {
    return requests.filter(r => {
      if (tab !== 'all' && r.status !== tab) return false
      if (search) {
        const q = search.toLowerCase()
        const matchesTx = r.transaction_id.toLowerCase().includes(q)
        const matchesEmail = r.user_email.toLowerCase().includes(q)
        const matchesName = r.user_name.toLowerCase().includes(q)
        if (!matchesTx && !matchesEmail && !matchesName) return false
      }
      return true
    })
  }, [requests, tab, search])

  const handleApprove = (req: PaymentRequest) => {
    approveRequest(req.id, 'Payment verified manually by administrator. Plan activated.')
    setSelectedReq(null)
  }

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedReq) return
    rejectRequest(selectedReq.id, rejectReason || 'Transaction ID not verified on bank/wallet records.')
    setIsRejecting(false)
    setRejectReason('')
    setSelectedReq(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            Payment Verification Hub
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold uppercase">
              Manual System
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Inspect screenshots, cross-reference UTR / TxID, and approve Pro & Elite memberships
          </p>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="glass rounded-2xl p-4 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-void-900 border border-white/10 text-xs font-bold w-full md:w-auto">
          {[
            { id: 'pending', label: 'Pending', count: requests.filter(r => r.status === 'pending').length },
            { id: 'approved', label: 'Approved', count: requests.filter(r => r.status === 'approved').length },
            { id: 'rejected', label: 'Rejected', count: requests.filter(r => r.status === 'rejected').length },
            { id: 'all', label: 'All Requests', count: requests.length },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`flex-1 md:flex-initial px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 justify-center ${
                tab === t.id ? 'bg-ember-gradient text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>{t.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                tab === t.id ? 'bg-white/20 text-white' : 'bg-void-800 text-gray-500'
              }`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search TxID, email, name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-10 text-xs"
          />
        </div>
      </div>

      {/* Requests Table */}
      <div className="glass rounded-3xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-void-900/60 text-gray-400">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Trader</th>
                <th className="py-3 px-4">Plan & Billing</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Transaction / UTR ID</th>
                <th className="py-3 px-4">Proof</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-gray-500">
                    No requests found in this view.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 text-gray-400">{req.payment_date}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{req.user_name}</div>
                      <div className="text-[10px] text-gray-500 font-mono">{req.user_email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                        req.plan_slug === 'elite'
                          ? 'bg-amber-glow/20 text-amber-glow border-amber-glow/40'
                          : 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                      }`}>
                        {req.plan_slug}
                      </span>
                      <span className="text-[10px] text-gray-500 block capitalize mt-0.5">{req.billing_period}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white text-sm">
                      ${req.amount}
                    </td>
                    <td className="py-3.5 px-4 text-gray-300 max-w-[140px] truncate" title={req.payment_method}>
                      {req.payment_method}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-gray-300 font-semibold select-all">
                      {req.transaction_id}
                    </td>
                    <td className="py-3.5 px-4">
                      {req.screenshot_url ? (
                        <button
                          onClick={() => {
                            setSelectedReq(req)
                            setScreenshotZoom(true)
                          }}
                          className="flex items-center gap-1 text-[11px] text-ember-400 hover:underline"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                      ) : (
                        <span className="text-gray-600">None</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {req.status === 'pending' && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          Pending
                        </span>
                      )}
                      {req.status === 'approved' && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Approved
                        </span>
                      )}
                      {req.status === 'rejected' && (
                        <div>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                            Rejected
                          </span>
                          {req.admin_note && (
                            <span className="block text-[9px] text-red-400 truncate max-w-[120px] mt-0.5" title={req.admin_note}>
                              {req.admin_note}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {req.status === 'pending' ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(req)}
                            className="h-7 px-2.5 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white gap-1"
                          >
                            <Check className="w-3 h-3" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setSelectedReq(req)
                              setIsRejecting(true)
                            }}
                            className="h-7 px-2 text-[11px] font-bold gap-1"
                          >
                            <X className="w-3 h-3" />
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedReq(req)}
                          className="h-7 text-[11px] text-gray-400 hover:text-white"
                        >
                          Details
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal / Reject Modal */}
      <AnimatePresence>
        {selectedReq && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass rounded-3xl p-6 md:p-8 max-w-xl w-full border border-white/10 shadow-2xl space-y-5 relative my-8"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-ember-400" />
                  Payment Verification Details
                </h2>
                <button onClick={() => { setSelectedReq(null); setIsRejecting(false); }} className="p-1 text-gray-400 hover:text-white">
                  &times;
                </button>
              </div>

              {/* Data list */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 rounded-lg bg-void-900">
                  <span className="text-gray-400">Trader:</span>
                  <span className="font-bold text-white">{selectedReq.user_name} ({selectedReq.user_email})</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-void-900">
                  <span className="text-gray-400">Target Plan:</span>
                  <span className="font-bold uppercase text-amber-glow">{selectedReq.plan_slug} ({selectedReq.billing_period})</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-void-900">
                  <span className="text-gray-400">Amount Paid:</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">${selectedReq.amount}</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-void-900">
                  <span className="text-gray-400">Method Used:</span>
                  <span className="font-semibold text-white">{selectedReq.payment_method}</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-void-900">
                  <span className="text-gray-400">Transaction ID / UTR:</span>
                  <span className="font-mono font-bold text-ember-400 select-all">{selectedReq.transaction_id}</span>
                </div>
                {selectedReq.note && (
                  <div className="p-2 rounded-lg bg-void-900">
                    <span className="text-gray-400 block mb-1">Trader Note:</span>
                    <span className="text-gray-200">{selectedReq.note}</span>
                  </div>
                )}
              </div>

              {/* Screenshot Preview */}
              {selectedReq.screenshot_url && (
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-gray-300">Payment Screenshot:</span>
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-void-950">
                    <Image
                      src={selectedReq.screenshot_url}
                      alt="Proof"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              )}

              {/* If in Rejection mode */}
              {isRejecting ? (
                <form onSubmit={handleConfirmReject} className="space-y-3 pt-2 border-t border-white/5">
                  <Label htmlFor="reason" className="text-xs text-red-400 font-bold">
                    Rejection Reason (Displayed to Trader):
                  </Label>
                  <Textarea
                    id="reason"
                    placeholder="e.g. Transaction ID not found in Federal Bank statement. Please re-check UTR."
                    value={rejectReason}
                    onChange={e => setRejectReason(e.target.value)}
                    required
                    className="h-20 text-xs"
                  />
                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="ghost" size="sm" onClick={() => setIsRejecting(false)}>
                      Back
                    </Button>
                    <Button type="submit" variant="destructive" size="sm" className="font-bold">
                      Confirm Rejection
                    </Button>
                  </div>
                </form>
              ) : selectedReq.status === 'pending' ? (
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => setIsRejecting(true)}
                  >
                    Reject with Reason
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    onClick={() => handleApprove(selectedReq)}
                    className="font-bold bg-emerald-600 hover:bg-emerald-500 text-white gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve & Activate Plan Now
                  </Button>
                </div>
              ) : (
                <div className="flex justify-end pt-3 border-t border-white/5">
                  <Button size="sm" variant="ghost" onClick={() => setSelectedReq(null)}>
                    Close
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

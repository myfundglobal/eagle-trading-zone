export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-void-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-ember-500/5 blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-ember-400/5 blur-2xl" />
      </div>
      <div className="w-full max-w-md relative z-10">{children}</div>
    </div>
  )
}

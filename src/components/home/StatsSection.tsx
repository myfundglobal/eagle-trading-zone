'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

function AnimatedNumber({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = target / 60
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

const stats = [
  { label: 'Trades Logged', value: 250000, suffix: '+' },
  { label: 'Active Traders', value: 5000, suffix: '+' },
  { label: 'Avg Win Rate Improvement', value: 23, suffix: '%' },
  { label: 'Countries', value: 40, suffix: '+' },
]

export function StatsSection() {
  return (
    <section className="py-16 bg-void-900 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl lg:text-5xl font-black text-gradient mb-2">
                <AnimatedNumber target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

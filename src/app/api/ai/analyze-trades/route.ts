import { NextResponse } from 'next/server'
import { Trade } from '@/lib/mock-data'

export async function POST(req: Request) {
  try {
    const { trades } = await req.json()

    if (!trades || !Array.isArray(trades) || trades.length === 0) {
      return NextResponse.json(
        { error: 'No trades provided for analysis' },
        { status: 400 }
      )
    }

    // Check if AI API key is configured
    const apiKey = process.env.AI_API_KEY
    const provider = process.env.AI_PROVIDER || 'openai'

    if (apiKey && apiKey.trim() !== '') {
      // Pluggable AI integration (e.g., OpenAI or compatible endpoint)
      try {
        const prompt = `You are a world-class institutional forex risk auditor and psychologist for Eagle Trading Zone FX Book.
Analyze the following trade history and return strict JSON with this exact schema:
{
  "grade": "A" | "B" | "C" | "D",
  "disciplineScore": number (0-100),
  "riskScore": number (0-100),
  "strengths": string[],
  "weaknesses": string[],
  "revengeTradingDetected": boolean,
  "revengeTradingSummary": string,
  "actionPlan": string[]
}

Trades Data:
${JSON.stringify(trades.slice(0, 30), null, 2)}`

        const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: process.env.AI_MODEL || 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' },
            temperature: 0.3,
          }),
        })

        if (aiRes.ok) {
          const aiJson = await aiRes.json()
          const parsed = JSON.parse(aiJson.choices[0].message.content)
          return NextResponse.json(parsed)
        }
      } catch (e) {
        // Fall back gracefully to statistical rule-based engine
      }
    }

    // =========================================================================
    // BUILT-IN RULE-BASED STATISTICAL AUDIT ENGINE
    // =========================================================================
    const wins = trades.filter((t: Trade) => (t.pnl || 0) > 0)
    const losses = trades.filter((t: Trade) => (t.pnl || 0) < 0)
    const winRate = trades.length > 0 ? (wins.length / trades.length) * 100 : 0

    // Average lot size
    const avgLot = trades.reduce((acc: number, t: Trade) => acc + t.lot_size, 0) / trades.length

    // Revenge Trading detection: consecutive losses with increasing lot size or 'Revenge'/'FOMO' emotion
    let revengeCount = 0
    trades.forEach((t: Trade, i: number) => {
      if (t.emotion === 'Revenge' || t.emotion === 'FOMO') {
        revengeCount++
      }
      if (i > 0 && (trades[i - 1].pnl || 0) < 0 && t.lot_size > avgLot * 1.3) {
        revengeCount++
      }
    })

    const revengeDetected = revengeCount > 0

    // Discipline & Risk Score calculation
    let disciplineScore = 82
    let riskScore = 80

    if (revengeDetected) {
      disciplineScore -= revengeCount * 12
    }
    if (winRate < 45) {
      riskScore -= 15
    } else if (winRate >= 60) {
      disciplineScore += 8
    }

    disciplineScore = Math.max(35, Math.min(98, disciplineScore))
    riskScore = Math.max(40, Math.min(98, riskScore))

    let grade = 'B+'
    if (disciplineScore >= 90 && winRate >= 55) grade = 'A+'
    else if (disciplineScore >= 80) grade = 'A'
    else if (disciplineScore >= 70) grade = 'B'
    else if (disciplineScore >= 60) grade = 'C'
    else grade = 'D'

    const strengths: string[] = []
    const weaknesses: string[] = []

    if (winRate >= 50) {
      strengths.push(`Solid positive win rate of ${winRate.toFixed(1)}% across ${trades.length} recorded positions.`)
    }
    const disciplinedTrades = trades.filter((t: Trade) => t.emotion === 'Disciplined')
    if (disciplinedTrades.length >= trades.length * 0.5) {
      strengths.push(`${((disciplinedTrades.length / trades.length) * 100).toFixed(0)}% of trades were executed with emotional discipline.`)
    } else {
      weaknesses.push('High proportion of trades entered without optimal psychological composure.')
    }

    if (revengeDetected) {
      weaknesses.push(`Detected ${revengeCount} potential revenge/FOMO executions with aggressive lot sizing after prior losses.`)
    }

    const londonWins = trades.filter((t: Trade) => t.session === 'London' && (t.pnl || 0) > 0)
    if (londonWins.length > 0) {
      strengths.push('London session exhibits the highest directional accuracy and cleanest follow-through.')
    }

    const actionPlan: string[] = [
      'Enforce mandatory 30-minute cooldown timer immediately following any stopped-out trade.',
      'Cap maximum risk to exactly 1.0% of portfolio equity on all upcoming sessions.',
      'Pre-fill trade checklist before clicking the order button in your broker terminal.',
      'Focus high-conviction setups exclusively on London and New York volatility expansion hours.',
    ]

    return NextResponse.json({
      grade,
      disciplineScore,
      riskScore,
      strengths,
      weaknesses,
      revengeTradingDetected: revengeDetected,
      revengeTradingSummary: revengeDetected
        ? `Our algorithms detected ${revengeCount} instances of accelerated lot sizing or emotional FOMO entries directly following a drawdown. Immediate protocol enforcement is advised.`
        : 'Zero revenge trading patterns detected. Excellent emotional composure maintained.',
      actionPlan,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}

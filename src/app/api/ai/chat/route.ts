import { NextResponse } from 'next/server'

const SYSTEM_INSTRUCTION = `You are the official Eagle Trading Zone AI Assistant.
Eagle Trading Zone is an elite trading platform, digital product marketplace (courses & MT5 software), and professional trade journal.

Your primary duties are:
1. TRADING BASICS & STRATEGY:
   - Explain Price Action, Support & Resistance, and Market Structure (Higher Highs / Lower Lows).
   - Explain Smart Money Concepts: Liquidity Pools, Fair Value Gaps (FVG), Order Blocks, and Session Timings (London Open, New York Open).
   - Reinforce Strict Risk Management: The 1% risk rule, 1:2 or 1:3 Risk-to-Reward ratio, and emotional discipline (preventing FOMO and revenge trading).
   - Gold (XAUUSD) and Forex Volatility: Sizing precautions during high-impact news (CPI, NFP, FOMC).

2. PLATFORM NAVIGATION:
   - "Trade Journal": Users can log trades with entry price, exit price, P&L, emotion tags, checklists, and chart screenshots to track win rate and equity curves.
   - "My Purchases": Access purchased trading courses (video modules) and download licensed MT5 Expert Advisors (.ex5 bots, set files, and license keys).
   - "Digital Marketplace": Browse and enroll in courses or download algorithmic trading software.
   - "Community Q&A": Any user can submit questions. Official answers, chart markups, and attachments are strictly authored by Eagle Trading Zone Admins to guarantee accuracy.
   - "Position Size Calculator": Free tool on the dashboard to calculate exact lot sizes based on account balance, risk %, and stop loss pips.
   - "Economic Calendar": Real-time TradingView calendar on the dashboard tracking global macroeconomic events.

Tone: Professional, disciplined, institutional, and supportive. Always remind traders that capital preservation precedes profit.`

// Fallback rule-based mentor engine if no API key is present
function getBuiltinMentorResponse(userMsg: string): string {
  const query = userMsg.toLowerCase()

  if (query.includes('position size') || query.includes('calculate') || query.includes('lot size') || query.includes('lots')) {
    return `📊 **Position Sizing & Lot Calculation Guide:**\n\nTo calculate your exact lot size on Eagle Trading Zone:\n1. Open your **Dashboard** or **Position Size Calculator** widget.\n2. Enter your **Account Balance** (e.g. $10,000) and your **Risk %** (we recommend strictly 0.5% to 1.0%).\n3. Input your **Stop Loss in pips** based on your technical invalidation level.\n\n*Formula:*  \n\`Lot Size = Dollar Risk / (Stop Loss Pips × Pip Value)\`  \nFor example, risking $100 with a 25-pip stop loss on EUR/USD ($10/pip) yields exactly **0.40 Lots**.\n\nNever trade with arbitrary lot sizes — let the math protect your capital!`
  }

  if (query.includes('journal') || query.includes('log trade') || query.includes('record')) {
    return `🦅 **How to Log Trades in Eagle Trading Journal:**\n\n1. Go to the **Trade Journal** tab on your dashboard.\n2. Click the **"+ Log New Trade"** button.\n3. Fill in the **Asset/Pair** (e.g. XAUUSD, EURUSD), Direction (Buy/Sell), Entry Price, Exit Price, and P&L.\n4. Attach a chart screenshot URL or upload to document your setup visually.\n5. Select your emotional state (Disciplined, FOMO, etc.) and complete your pre-execution checklist.\n\nYour stats, Win Rate %, Profit Factor, and Equity Curve will automatically update!`
  }

  if (query.includes('purchase') || query.includes('course') || query.includes('software') || query.includes('ea') || query.includes('download')) {
    return `📦 **Accessing Courses & Software:**\n\n- Navigate to the **"My Purchases"** tab in your dashboard navigation.\n- **Courses:** Click *"Access Course & Watch"* to open the video portal with 18+ institutional modules.\n- **Software / EAs:** Click *"Download Software (.ex5)"* to get the executable bot, preset configuration files, and your unique MT5 license key.\n- To browse more institutional tools, visit our **Digital Product Marketplace** on the main page!`
  }

  if (query.includes('community') || query.includes('question') || query.includes('reply') || query.includes('admin')) {
    return `💬 **Admin-Controlled Community Forum:**\n\n- Head to the **Community Q&A** page on your dashboard.\n- Any registered trader can click **"Ask Question"** to submit a market scenario or setup query.\n- **Important Rule:** To protect the community from retail bad advice, only **Eagle Trading Zone Admins** have permission to publish replies and attach chart breakdowns.\n- Admins review questions continuously and post high-resolution chart analysis.`
  }

  if (query.includes('fvg') || query.includes('fair value') || query.includes('liquidity') || query.includes('order block')) {
    return `📈 **Fair Value Gaps (FVG) & Smart Money:**\n\n- **Fair Value Gap:** An imbalance created across a 3-candle sequence where Candle 1's wick and Candle 3's wick do not overlap, leaving Candle 2 as a large displacement candle.\n- **Trading Concept:** Markets tend to gravitate back into this imbalance to rebalance liquidity before continuing in the direction of the institutional displacement.\n- Always look for FVGs that align with higher timeframe market structure (H4/D1) and session open expansions (London/NY).`
  }

  if (query.includes('gold') || query.includes('xauusd')) {
    return `🏆 **Gold (XAUUSD) Trading Strategy:**\n\n- Gold is an institutional volatility vehicle with daily ranges often exceeding 200–350 pips.\n- **Key Session Times:** 07:00–09:00 GMT (Frankfurt/London Open) and 12:30–15:00 GMT (New York Open).\n- **Golden Rule:** Never enter market orders during high-impact US CPI or NFP prints. Wait for the 15-minute candle to close after the initial algorithmic liquidity sweep.`
  }

  if (query.includes('risk') || query.includes('drawdown') || query.includes('psychology')) {
    return `🛡️ **Eagle Risk Management Principles:**\n\n1. **1% Maximum Risk Rule:** Never risk more than 1% of your total account equity on any single trade.\n2. **Minimum 1:2 Risk-to-Reward:** Always ensure your Take Profit is at least double your Stop Loss distance.\n3. **Daily Loss Circuit Breaker:** If you lose 2 consecutive trades in one day, close MetaTrader and review your journal to stop revenge trading.`
  }

  return `🦅 **Eagle Trading Assistant:**\n\nI can assist you with:\n- **Trading Basics:** Candlestick patterns, Fair Value Gaps (FVG), support/resistance, and gold scalping.\n- **Risk Management:** Calculating position size and 1% risk rules.\n- **Platform Navigation:** Using the Trade Journal, accessing "My Purchases", submitting Community Q&A questions, or using the Economic Calendar.\n\nWhat would you like to explore?`
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Check Gemini API key from environment
    const geminiApiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY

    if (geminiApiKey && geminiApiKey.trim() !== '') {
      try {
        // Direct call to Google Gemini REST API
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: SYSTEM_INSTRUCTION }],
            },
            contents: [
              {
                role: 'user',
                parts: [{ text: message }],
              },
            ],
            generationConfig: {
              temperature: 0.4,
              maxOutputTokens: 1000,
            },
          }),
        })

        if (response.ok) {
          const data = await response.json()
          const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text
          if (replyText && replyText.trim()) {
            return NextResponse.json({ reply: replyText })
          }
        }
      } catch (geminiError) {
        console.error('Gemini API call error, falling back to mentor engine:', geminiError)
      }
    }

    // Built-in intelligent mentor response
    const fallbackReply = getBuiltinMentorResponse(message)
    return NextResponse.json({ reply: fallbackReply })
  } catch (error) {
    console.error('AI chat endpoint error:', error)
    return NextResponse.json(
      { reply: 'I am here to help you trade with precision. Feel free to ask about lot sizing, trading journal, community questions, or Smart Money Concepts.' },
      { status: 200 }
    )
  }
}

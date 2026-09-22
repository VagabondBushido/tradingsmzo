import React, { useEffect, useId, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import Admin from './Admin.jsx'
import { Disclaimer, Privacy, Terms } from './Legal.jsx'
import Seo, { bootAnalytics, trackPurchase } from './seo.js'
import { SITE } from './site.js'
import { ASSETS, Btc, Eth, Nft, Sol, Usdt } from './icons.jsx'
import './styles.css'

const topics = [
  ['01', 'Blockchain & Crypto Foundations'],
  ['02', 'Crypto Market Mechanics'],
  ['03', 'Trading Concepts'],
  ['04', 'Liquidity & Volume'],
  ['05', 'Price Movement'],
  ['06', 'Risk Management'],
  ['07', 'Trading Psychology'],
  ['08', 'Practical Market & Project Analysis'],
]

const without = ['Random tips', 'Social-media hype', 'Coin recommendations', 'Emotional decisions', 'Misunderstood charts']
const withUnderstanding = ['Research', 'Market mechanics', 'Context', 'Risk awareness', 'Structured decision-making']

const forces = ['Technology', 'Market Participants', 'Supply & Demand', 'Liquidity', 'Trading Volume', 'Market Sentiment', 'News & Events', 'Macroeconomic Conditions', 'Risk']

const curriculum = [
  ['THE FOUNDATION', ['What is Money?', 'Evolution of Money', 'What Banks Actually Do', 'Why Bitcoin Exists', 'How Blockchain Works']],
  ['THE CRYPTO ECOSYSTEM', ['Bitcoin & Ethereum', 'Crypto Wallets', 'CEX vs DEX', 'Trading Pairs', 'How People Interact With Crypto']],
  ['HOW MARKETS WORK', ['Buyers vs Sellers', 'Bid & Ask', 'Order Book', 'Market Orders', 'Liquidity', 'Trading Volume', 'Spread & Slippage']],
  ['WHY PRICES MOVE', ['Supply & Demand', 'Buying & Selling Pressure', 'Liquidity', 'Market Sentiment', 'News & Events', 'Macroeconomic Factors']],
  ['TRADING', ['How Crypto Trading Works', 'Market Structure', 'Price Action', 'Trade Execution', 'Leverage']],
  ['RISK & PSYCHOLOGY', ['Risk Management', 'Stop Loss', 'Position Sizing', 'Risk-to-Reward', 'Fear', 'Greed', 'FOMO', 'Revenge Trading', 'Overtrading', 'Discipline']],
]

const journey = ['Money', 'Blockchain', 'Crypto', 'Markets', 'Price Movement', 'Trading', 'Risk', 'Psychology', 'Analysis']

const outcomes = [
  ['01', 'A Strong Crypto Foundation', 'Understand the technology and ecosystem.'],
  ['02', 'Market Understanding', 'Understand how buyers, sellers, liquidity, and volume interact.'],
  ['03', 'A Market Analysis Framework', 'Learn what factors to examine when studying price movement.'],
  ['04', 'Risk Management Principles', 'Understand risk, position size, Stop Loss, leverage, and capital protection.'],
  ['05', 'Trading Psychology Framework', 'Recognize emotional and behavioral patterns that can affect decisions.'],
  ['06', 'A Crypto Research Approach', 'Learn how to investigate a project instead of simply following its popularity.'],
  ['07', 'Practical Knowledge', 'See concepts explained through real-world examples and market scenarios.'],
]

const practice = ['Order Book', 'Liquidity', 'Volume', 'Spread & Slippage', 'Price Movement', 'Market Conditions', 'Trading Concepts', 'Risk Scenarios', 'Practical Crypto Research']

const audience = [
  ['Beginners', 'You want to understand crypto from the foundation.'],
  ['Aspiring Traders', 'You want to understand the market before actively trading.'],
  ['Existing Traders', 'You want a deeper understanding of market mechanics and risk.'],
  ['Crypto Investors', 'You want a research-oriented approach.'],
  ['Students & Learners', 'You want structured knowledge about blockchain and crypto markets.'],
]

const notFor = [
  'People looking for guaranteed profits.',
  'People looking for “100% accurate” signals.',
  'People expecting guaranteed coin calls.',
  'People looking for a magic trading strategy.',
  'People looking for overnight wealth.',
]

const betterQuestions = [
  'What does this project actually do?',
  'What is the token used for?',
  'How does its market work?',
  'What’s happening with liquidity and volume?',
  'What is influencing the price?',
  'What are the risks?',
  'What do I need to understand before taking action?',
]

const included = [
  'Live webinar access',
  'Structured learning roadmap',
  'Crypto & blockchain fundamentals',
  'Market mechanics',
  'Trading concepts',
  'Risk management',
  'Trading psychology',
  'Practical examples',
  'Crypto research framework',
]

const priceBenefits = [
  'One-time registration',
  'Live webinar access',
  'Complete learning roadmap',
  'Practical market concepts',
  'Crypto research framework',
  'Trading, risk & psychology concepts',
]

function Arrow() { return <span className="arrow" aria-hidden="true">↗</span> }

const MARKET_VIEWS = [
  {
    candles: [[24, 88, 58, 118], [56, 70, 48, 104], [88, 54, 40, 78], [120, 66, 50, 96], [152, 46, 32, 72], [184, 78, 56, 108], [216, 50, 36, 80], [248, 86, 64, 118], [280, 58, 42, 90]],
    bids: [88, 74, 61, 48, 34],
    asks: [36, 52, 68, 82, 94],
  },
  {
    candles: [[24, 76, 52, 102], [56, 60, 42, 84], [88, 82, 62, 112], [120, 50, 36, 74], [152, 68, 48, 94], [184, 42, 28, 70], [216, 74, 54, 100], [248, 56, 40, 86], [280, 70, 50, 98]],
    bids: [70, 62, 50, 41, 28],
    asks: [44, 58, 72, 86, 96],
  },
  {
    candles: [[24, 58, 40, 84], [56, 86, 62, 118], [88, 44, 30, 70], [120, 72, 50, 98], [152, 36, 24, 62], [184, 64, 44, 90], [216, 92, 68, 120], [248, 50, 34, 78], [280, 68, 46, 94]],
    bids: [96, 80, 66, 44, 30],
    asks: [32, 48, 64, 78, 90],
  },
  {
    candles: [[24, 70, 50, 96], [56, 52, 36, 80], [88, 76, 54, 104], [120, 42, 28, 68], [152, 84, 60, 114], [184, 58, 40, 86], [216, 38, 24, 64], [248, 66, 46, 92], [280, 48, 32, 74]],
    bids: [60, 52, 44, 36, 24],
    asks: [50, 62, 74, 84, 94],
  },
]

function Candles({ className, bars = MARKET_VIEWS[0].candles }) {
  const uid = useId().replace(/:/g, '')
  return (
    <svg className={className} viewBox="0 0 320 150" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <linearGradient id={`chartGlow-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3dd68c" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#3dd68c" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path className="grid" d="M0 38H320M0 75H320M0 112H320" />
      <path className="chart-wash" d="M16 150 L16 88 L52 70 L88 96 L124 58 L160 74 L196 48 L232 80 L268 42 L304 64 L304 150 Z" fill={`url(#chartGlow-${uid})`} />
      {bars.map(([x, open, high, low], index) => {
        const up = index % 3 !== 1
        const color = up ? '#3dd68c' : '#f0616d'
        const bodyH = Math.max(Math.abs(open - (up ? open - 18 : open + 18)), 10)
        const y = Math.min(Math.max(up ? open - bodyH : open, 12), 118)
        return (
          <g key={`${x}-${index}`} className="candle" style={{ animationDelay: `${80 + index * 55}ms` }}>
            <line x1={x} x2={x} y1={high} y2={low} stroke={color} strokeWidth="2" strokeLinecap="round" />
            <rect x={x - 5} y={y} width="10" height={bodyH} fill={color} rx="2" />
          </g>
        )
      })}
    </svg>
  )
}

function OrderBook({ bids, asks }) {
  return (
    <div className="book">
      <div className="book-col">
        <span>Bid</span>
        {bids.map((width, index) => <b key={`b${index}`} className="bid" style={{ width: `${width}%`, animationDelay: `${index * 0.08}s` }} />)}
      </div>
      <div className="book-col">
        <span>Ask</span>
        {asks.map((width, index) => <b key={`a${index}`} className="ask" style={{ width: `${width}%`, animationDelay: `${index * 0.08}s` }} />)}
      </div>
    </div>
  )
}

function HeroDesk() {
  const [pair, setPair] = useState(0)
  const asset = ASSETS[pair]
  const view = MARKET_VIEWS[pair]
  return (
    <div className="hero-art">
      <div className="desk">
        <div className="desk-pair">
          <asset.Icon className="desk-logo" />
          <div>
            <strong>{asset.pair}</strong>
            <small>Illustrative structure</small>
          </div>
          <span className="sim-tag">SIM</span>
        </div>
        <div className="desk-stage">
          <Candles key={pair} className="desk-chart" bars={view.candles} />
        </div>
        <div className="pair-tabs" role="tablist" aria-label="Illustrative market pairs">
          {ASSETS.slice(0, 4).map((item, index) => (
            <button type="button" role="tab" aria-selected={pair === index} key={item.ticker} className={pair === index ? 'on' : ''} onClick={() => setPair(index)}>
              <item.Icon className="mini-asset" /> {item.ticker}
            </button>
          ))}
        </div>
        <OrderBook key={`book-${pair}`} bids={view.bids} asks={view.asks} />
      </div>
      <div className="float-stack" aria-hidden="true">
        <div className="float-pill pill-one"><Btc className="mini-asset" /> BTC · store of value</div>
        <div className="float-pill pill-two"><Eth className="mini-asset" /> ETH · smart contracts</div>
        <div className="float-pill pill-three"><Sol className="mini-asset" /> SOL · high throughput</div>
      </div>
    </div>
  )
}

function ScrollCanvas() {
  const trackRef = useRef(null)
  const deviceRef = useRef(null)
  const orbitRef = useRef(null)
  const captionRef = useRef(null)
  const titleRef = useRef(null)
  const dotsRef = useRef([])
  const layersRef = useRef([])
  const lastStage = useRef(-1)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const captions = [
      ['The chart', 'Price is what you see last.'],
      ['The chain', 'Underneath is technology and flow.'],
      ['The decision', 'Then you act with a process — and risk in view.'],
    ]
    const apply = (progress) => {
      const phone = window.matchMedia('(max-width: 760px)').matches
      if (deviceRef.current) {
        if (phone) {
          const lift = 12 - progress * 24
          const scale = 0.96 + progress * 0.04
          deviceRef.current.style.transform = `translateY(${lift}px) scale(${scale})`
        } else {
          const rotateY = -26 + progress * 52
          const rotateX = 12 - progress * 20
          const scale = 0.92 + progress * 0.08
          deviceRef.current.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`
        }
      }
      if (orbitRef.current) {
        orbitRef.current.style.transform = phone ? 'none' : `rotate(${progress * 28}deg)`
      }
      const stage = progress < 0.34 ? 0 : progress < 0.67 ? 1 : 2
      layersRef.current.forEach((layer, index) => {
        if (!layer) return
        const active = index === stage
        layer.style.opacity = active ? '1' : '0'
        layer.style.visibility = active ? 'visible' : 'hidden'
        layer.style.pointerEvents = active ? 'auto' : 'none'
        layer.setAttribute('aria-hidden', active ? 'false' : 'true')
      })
      if (lastStage.current !== stage) {
        lastStage.current = stage
        if (titleRef.current) titleRef.current.textContent = captions[stage][0]
        if (captionRef.current) captionRef.current.textContent = captions[stage][1]
        dotsRef.current.forEach((dot, index) => {
          if (dot) dot.classList.toggle('on', index === stage)
        })
      }
    }

    if (reduced) {
      apply(0.5)
      return undefined
    }

    let frame = 0
    const update = () => {
      const el = trackRef.current
      if (!el) return
      const total = Math.max(el.offsetHeight - window.innerHeight, 1)
      const scrolled = Math.min(Math.max(-el.getBoundingClientRect().top, 0), total)
      apply(scrolled / total)
    }
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section className="scroll-stage" ref={trackRef} aria-label="How the market sits together">
      <div className="scroll-stage-sticky">
        <p className="section-label">Watch the pieces turn</p>
        <div className="orbit" ref={orbitRef} aria-hidden="true">
          <Btc className="orbit-icon orbit-a" />
          <Eth className="orbit-icon orbit-b" />
          <Sol className="orbit-icon orbit-c" />
          <Nft className="orbit-icon orbit-d" />
          <Usdt className="orbit-icon orbit-e" />
        </div>
        <div className="flip-device" ref={deviceRef}>
          <div className="flip-face">
            <div className="card-top"><span ref={titleRef}>The chart</span><span className="green">Illustrative</span></div>
            <div className="flip-stack">
              <div className="flip-layer is-on" ref={(node) => { layersRef.current[0] = node }}>
                <Candles className="flip-chart" />
              </div>
              <div className="flip-layer" ref={(node) => { layersRef.current[1] = node }}>
                <div className="chain-row">
                  <div className="block-chip"><Btc className="mini-asset" /> Block</div>
                  <i />
                  <div className="block-chip"><Eth className="mini-asset" /> Ledger</div>
                  <i />
                  <div className="block-chip"><Sol className="mini-asset" /> Wallet</div>
                </div>
                <div className="node-map">
                  {['On-chain', 'CEX / DEX', 'NFT', 'Order', 'Fill', 'Risk'].map((node) => (
                    <span key={node}>{node}</span>
                  ))}
                </div>
              </div>
              <div className="flip-layer" ref={(node) => { layersRef.current[2] = node }}>
                <div className="risk-board">
                  <div className="size-bar"><span style={{ width: '28%' }} /><label>Position size</label></div>
                  <div className="size-bar stop"><span style={{ width: '18%' }} /><label>Stop loss</label></div>
                  <div className="size-bar rr"><span style={{ width: '62%' }} /><label>Risk-to-reward</label></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="flip-caption" ref={captionRef}>Price is what you see last.</p>
        <div className="flip-dots" aria-hidden="true">
          {[0, 1, 2].map((index) => (
            <b key={index} ref={(node) => { dotsRef.current[index] = node }} className={index === 0 ? 'on' : ''} />
          ))}
        </div>
      </div>
    </section>
  )
}

function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = resolve
    script.onerror = () => reject(new Error('Could not load Razorpay Checkout'))
    document.body.appendChild(script)
  })
}

function App() {
  const [modalOpen, setModalOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [checkoutReady, setCheckoutReady] = useState(false)
  const [priceLabel, setPriceLabel] = useState('₹499')
  const [priceValue, setPriceValue] = useState(499)
  const [form, setForm] = useState({ name: '', email: '', contact: '' })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [receipt, setReceipt] = useState(null)
  const [disclaimerOpen, setDisclaimerOpen] = useState(false)

  useEffect(() => {
    bootAnalytics()
    const closeOnEscape = (event) => {
      if (event.key !== 'Escape') return
      setModalOpen(false)
      setMenuOpen(false)
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('modal-open', modalOpen)
    return () => document.body.classList.remove('modal-open')
  }, [modalOpen])

  useEffect(() => {
    const nodes = document.querySelectorAll('.reveal-on-scroll')
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (motion) {
      nodes.forEach((node) => node.classList.add('in'))
      return undefined
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('in') })
    }, { threshold: 0.01, rootMargin: '80px 0px -8% 0px' })
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    fetch('/api/checkout-config', { cache: 'no-store' })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          setCheckoutReady(true)
          if (data.priceLabel) setPriceLabel(data.priceLabel)
          if (data.amount) setPriceValue(Number(data.amount) / 100)
        }
      })
      .catch(() => setCheckoutReady(false))
  }, [])

  const updateField = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }))
  const enroll = () => { setMenuOpen(false); setModalOpen(true) }
  const cta = `Reserve your seat — ${priceLabel}`

  const openCheckout = async (event) => {
    event.preventDefault()
    setError('')
    setStatus('creating')
    try {
      const orderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const order = await orderResponse.json()
      if (!order.ok) throw new Error(order.error || 'Could not start checkout')
      await loadRazorpay()
      setStatus('paying')
      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: SITE.name,
        image: '/favicon.svg',
        description: `Live webinar · ${priceLabel}`,
        order_id: order.orderId,
        prefill: order.prefill,
        notes: { product: 'crypto-webinar' },
        theme: { color: '#f7931a' },
        handler: async (response) => {
          try {
            setStatus('verifying')
            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            })
            const result = await verifyResponse.json()
            if (!result.ok) throw new Error(result.error || 'Payment verification failed')
            setReceipt(result)
            setStatus('success')
            trackPurchase({ paymentId: result.paymentId, value: Number(order.amount) / 100 })
          } catch (verifyError) {
            setError(verifyError.message)
            setStatus('idle')
          }
        },
        modal: { ondismiss: () => setStatus('idle') },
      })
      checkout.on('payment.failed', (failed) => {
        setError(failed.error?.description || 'Payment failed. Try again.')
        setStatus('idle')
      })
      checkout.open()
    } catch (checkoutError) {
      setError(checkoutError.message)
      setStatus('idle')
    }
  }

  const busy = status === 'creating' || status === 'paying' || status === 'verifying'
  const buttonLabel = status === 'creating'
    ? 'Creating secure order…'
    : status === 'paying'
      ? 'Waiting for Razorpay…'
      : status === 'verifying'
        ? 'Verifying payment…'
        : `Pay ${priceLabel} securely`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationEvent',
    name: SITE.course,
    description: SITE.description,
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    organizer: { '@type': 'Organization', name: SITE.name, url: SITE.url, email: SITE.email, telephone: SITE.phone },
    performer: { '@type': 'Person', name: SITE.educator },
    offers: { '@type': 'Offer', price: String(priceValue), priceCurrency: 'INR', availability: 'https://schema.org/InStock', url: SITE.url },
  }

  return <>
    <Seo title="Understanding Crypto Before You Trade | Live Webinar" description={SITE.description} jsonLd={jsonLd} />
    <div className="ambient ambient-one" />
    <div className="ambient ambient-two" />
    <header className="nav-shell">
    <div className="nav wrap">
      <a href="#top" className="brand" aria-label={`${SITE.name} home`}><span className="brand-mark">S</span> {SITE.name.toUpperCase()}</a>
      <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="site-nav" aria-label="Toggle menu">{menuOpen ? '×' : '☰'}</button>
      <nav id="site-nav" className={menuOpen ? 'nav-links open' : 'nav-links'}>
        <a href="#overview" onClick={() => setMenuOpen(false)}>Overview</a>
        <a href="#curriculum" onClick={() => setMenuOpen(false)}>Curriculum</a>
        <a href="#outcomes" onClick={() => setMenuOpen(false)}>What you’ll learn</a>
        <a href="#who" onClick={() => setMenuOpen(false)}>Who it’s for</a>
        <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
        <a href="#disclaimer" onClick={() => setMenuOpen(false)}>Disclaimer</a>
        <button className="text-button" onClick={enroll}>Join — {priceLabel}</button>
      </nav>
    </div>
    </header>

    <main id="top">
      <section className="hero wrap">
        <div className="hero-copy reveal">
          <p className="eyebrow"><span /> Live educational webinar</p>
          <h1>Understanding crypto<br /><em>before</em> you trade.</h1>
          <p className="hero-lede">Read the market the way a desk does — pairs, order books, and risk — not just a green line.</p>
          <p className="hero-text">A practical webinar on Bitcoin, Ethereum, Solana, NFTs, blockchain, CEX vs DEX, trading mechanics, and the psychology that sits behind a click.</p>
          <div className="hero-actions">
            <button className="primary-button" onClick={enroll}>{cta} <Arrow /></button>
            <a className="watch-link" href="#curriculum"><span className="play">▶</span> Explore the curriculum</a>
          </div>
          <div className="trust-row">
            <span>Razorpay checkout</span>
            <i />
            <span>Education only</span>
            <i />
            <span>India support</span>
          </div>
          <p className="hero-note">No financial advice. No guaranteed profits or returns. Charts on this page are illustrative.</p>
        </div>
        <HeroDesk />
      </section>

      <section className="ticker" aria-label="Markets studied">
        <div>
          {['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'NFT', 'CEX', 'DEX', 'ORDER BOOK', 'LIQUIDITY', 'RISK', 'PSYCHOLOGY'].concat(['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'NFT', 'CEX', 'DEX']).map((item, index) => (
            <span key={`${item}-${index}`}>{item}<b>·</b></span>
          ))}
        </div>
      </section>

      <section className="tape" aria-hidden="true">
        <div>
          {['BTC fill', 'ETH bid', 'SOL ask', 'USDT settle', 'NFT mint', 'CEX order', 'DEX swap', 'Stop placed', 'Size checked'].concat(['BTC fill', 'ETH bid', 'SOL ask', 'USDT settle']).map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </section>

      <ScrollCanvas />

      <section id="overview" className="wrap section reveal-on-scroll">
        <p className="section-label">01 — The foundation</p>
        <h2>Understanding crypto before you trade</h2>
        <p className="lead">A practical webinar to understand the technology, ecosystem, market mechanics, trading concepts, risk management, and psychology behind crypto markets.</p>
        <div className="asset-row" aria-hidden="true">
          {ASSETS.map((asset) => (
            <span key={asset.ticker}><asset.Icon className="mini-asset" /> {asset.ticker}</span>
          ))}
        </div>
        <div className="topic-grid">
          {topics.map(([number, title]) => (
            <article className="topic-card" key={title}><span>{number}</span><h3>{title}</h3></article>
          ))}
        </div>
      </section>

      <section className="wrap section reveal-on-scroll">
        <p className="section-label">02 — Why attend</p>
        <h2>You don’t need another coin call.</h2>
        <p className="lead">You need a better understanding of the market.</p>
        <p className="body-copy">Because entering crypto without understanding how it works can leave you relying on random tips, social-media hype, coin recommendations, emotional decisions, or misunderstood charts. The webinar gives you a structured way to understand the crypto ecosystem and the market before making decisions.</p>
        <div className="contrast">
          <article>
            <p className="section-label dim">Without understanding</p>
            <ul>{without.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
          <article className="contrast-on">
            <p className="section-label">With understanding</p>
            <ul>{withUnderstanding.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
        </div>
      </section>

      <section className="wrap section reveal-on-scroll">
        <p className="section-label">03 — Why it matters</p>
        <h2>Crypto isn’t just a chart.</h2>
        <p className="lead">Behind every market move are multiple forces and mechanisms.</p>
        <div className="force-grid">
          {forces.map((item) => <article key={item}><span className="force-dot" />{item}</article>)}
        </div>
        <blockquote className="statement">Don’t just look at what price is doing. Understand what is happening underneath it.</blockquote>
      </section>

      <section id="curriculum" className="curriculum section">
        <div className="wrap">
          <p className="section-label">04 — What you will learn</p>
          <h2>From the foundations to the market</h2>
          <ol className="journey reveal-on-scroll">
            {journey.map((step, index) => (
              <li key={step}><span>{String(index + 1).padStart(2, '0')}</span>{step}</li>
            ))}
          </ol>
          <div className="curr-grid">
            {curriculum.map(([title, items]) => (
              <article className="curr-card" key={title}>
                <h3>{title}</h3>
                <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
            ))}
          </div>
          <div className="mid-cta"><button className="secondary-button" onClick={enroll}>{cta} <Arrow /></button></div>
        </div>
      </section>

      <section id="outcomes" className="wrap section reveal-on-scroll">
        <p className="section-label">05 — What you’ll walk away with</p>
        <h2>What you’ll walk away with</h2>
        <div className="outcome-grid">
          {outcomes.map(([number, title, text], index) => (
            <article className={index === 0 ? 'outcome-card featured' : 'outcome-card'} key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>
          ))}
        </div>
          <div className="mid-cta"><button className="secondary-button" onClick={enroll}>{cta} <Arrow /></button></div>
      </section>

      <section className="band section">
        <div className="wrap reveal-on-scroll">
          <p className="section-label">06 — What makes this different</p>
        <h2>The pieces connect.</h2>
        <p className="lead">This is not designed to be another collection of disconnected crypto definitions. The webinar connects the concepts into one learning journey.</p>
        <div className="connect-flow">{journey.map((step) => <span key={step}>{step}</span>)}</div>
        <ol className="life-line" aria-label="How a decision is studied">
          {['Idea', 'Research', 'Order book', 'Fill', 'Risk review'].map((step, index) => (
            <li key={step}><b>{String(index + 1).padStart(2, '0')}</b>{step}</li>
          ))}
        </ol>
        <p className="large-line">You learn how the pieces connect.</p>
        </div>
      </section>

      <section className="wrap section tight reveal-on-scroll">
        <p className="section-label">07 — Is it just theory?</p>
        <h2>Learn the concept. See it in context.</h2>
        <p className="lead">The webinar goes beyond definitions and explains concepts through practical examples.</p>
        <div className="practice-grid">
          {practice.map((item) => <article key={item}>{item}</article>)}
        </div>
      </section>

      <section id="who" className="wrap section reveal-on-scroll">
        <p className="section-label">08 — Audience</p>
        <h2>Who is this for?</h2>
        <div className="who-grid">
          {audience.map(([title, text]) => (
            <article key={title}><h3>{title}</h3><p>{text}</p></article>
          ))}
        </div>
      </section>

      <section className="not-for section">
        <div className="wrap reveal-on-scroll">
          <p className="section-label">09 — Who this is not for</p>
          <h2>This is not a get-rich-quick webinar.</h2>
          <ul className="not-list">{notFor.map((item) => <li key={item}>{item}</li>)}</ul>
          <p className="large-line">This webinar is for people who want to understand before they act.</p>
        </div>
      </section>

      <section className="wrap section reveal-on-scroll">
        <p className="section-label">10 — After the webinar</p>
        <h2>Ask better questions.</h2>
        <p className="swap">Instead of only asking: <em>“Which coin should I buy?”</em></p>
        <div className="psyche" aria-hidden="true">
          <span>Fear</span>
          <div className="psyche-track"><i /></div>
          <span>Discipline</span>
        </div>
        <p className="psyche-note">Emotions sit on a spectrum. The webinar maps them — it does not score you.</p>
        <ol className="questions">{betterQuestions.map((item) => <li key={item}>{item}</li>)}</ol>
        <blockquote className="statement">The goal isn’t to make decisions for you. It’s to help you build a better process for making your own decisions.</blockquote>
      </section>

      <section className="now wrap section reveal-on-scroll cinematic">
        <p className="section-label">11 — Why now</p>
        <h2>The market changes.<br />The need to understand doesn’t.</h2>
        <p className="lead">The crypto ecosystem is constantly evolving. New projects emerge, technologies develop, market conditions change, narratives shift, regulations evolve, and information moves quickly. The ability to research and understand what you’re seeing matters more than simply following what’s trending.</p>
      </section>

      <section className="wrap section reveal-on-scroll">
        <p className="section-label">12 — What’s included</p>
        <h2>Your webinar access includes</h2>
        <ul className="included">{included.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>

      <section id="about" className="wrap section split reveal-on-scroll">
        <p className="section-label">13 — Who is behind this?</p>
        <div className="educator">
          <div>
            <h2>{SITE.educator}</h2>
            <p className="lead">Focused on crypto education, market research, trading concepts, risk management, and practical learning.</p>
          </div>
          <p className="educator-line">Learn the Technology.<br />Understand the Market.<br />Analyze Before You Act.<br />Manage the Risk.</p>
        </div>
      </section>

      <section id="pricing" className="pricing wrap section reveal-on-scroll">
        <p className="section-label">14 — Register</p>
        <div className="price-layout">
          <div>
            <h2>Ready to understand crypto?</h2>
            <ul className="included">{priceBenefits.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <aside className="price-card">
            <p className="section-label">Live webinar</p>
            <p className="price-amount">{priceLabel}</p>
            <p className="price-note">INR · one-time registration</p>
            <button className="primary-button modal-button" onClick={enroll}>{cta} <Arrow /></button>
            <p className="support-line">Support: <a href={SITE.phoneHref}>{SITE.phone}</a><br /><a href={`mailto:${SITE.email}`}>{SITE.email}</a></p>
            <small>Educational webinar only. No financial advice. No guaranteed profits or returns.</small>
          </aside>
        </div>
      </section>

      <section className="enroll wrap">
        <div className="enroll-content">
          <p className="eyebrow"><span /> Understand before you trade</p>
          <h2>Stop chasing<br />the next coin.</h2>
          <p>Start understanding the market. Learn · Research · Analyze · Manage Risk</p>
          <button className="primary-button light" onClick={enroll}>Join the webinar — {priceLabel} <Arrow /></button>
          <p className="support-line dark">Rights &amp; support · <a href={SITE.phoneHref}>{SITE.phone}</a> · <a href={`mailto:${SITE.email}`}>{SITE.email}</a></p>
        </div>
      </section>

      <section id="disclaimer" className="wrap section disc-block">
        <button type="button" className="disc-toggle" onClick={() => setDisclaimerOpen(!disclaimerOpen)} aria-expanded={disclaimerOpen}>
          <span>
            <span className="section-label">Important disclaimer</span>
            <strong>Educational Content Only</strong>
          </span>
          <span>{disclaimerOpen ? '–' : '+'}</span>
        </button>
        {disclaimerOpen && (
          <div className="disc-body">
            <p>This webinar and all materials provided during or after the webinar are for educational and informational purposes only. They are intended to help participants understand blockchain technology, crypto markets, trading concepts, market mechanics, risk management, and related topics. They do not constitute investment advice, financial advice, trading advice, a recommendation, an offer, or a solicitation to buy, sell, or hold any cryptocurrency, security, derivative, or other financial product.</p>
            <h3>No Guaranteed Results</h3>
            <p>There are no guarantees of profit, returns, accuracy, or future performance. Market outcomes are uncertain.</p>
            <h3>Trading &amp; Investment Risk</h3>
            <p>Cryptocurrency and leveraged trading can involve substantial risk, including the possible loss of some or all of the capital committed.</p>
            <h3>Do Your Own Research</h3>
            <p>Participants should conduct their own research and, where appropriate, seek advice from a qualified financial professional before making financial decisions.</p>
            <h3>No Personalized Advice</h3>
            <p>The webinar is general education and does not take into account an individual participant’s financial situation, goals, risk tolerance, or circumstances.</p>
            <h3>Examples Are Illustrative</h3>
            <p>Market examples, charts, scenarios, and case studies are for educational purposes and should not be treated as predictions or instructions to trade.</p>
            <h3>Regulatory &amp; Tax Considerations</h3>
            <p>Rules, taxes, and restrictions relating to crypto and financial products may vary by jurisdiction and can change. Participants are responsible for understanding the rules that apply to them.</p>
            <h3>Participant Responsibility</h3>
            <p>Any decision to trade, invest, use leverage, or otherwise act on information discussed in the webinar is made solely by the participant at their own risk and responsibility.</p>
            <p>By registering for or attending the webinar, participants acknowledge that they understand and accept the educational nature of the webinar. Full text also on the <a href="/disclaimer">disclaimer page</a>.</p>
          </div>
        )}
      </section>
    </main>

    <footer className="wrap">
      <a className="brand" href="#top"><span className="brand-mark">S</span> {SITE.name.toUpperCase()}</a>
      <nav className="footer-links">
        <a href="/disclaimer">Disclaimer</a>
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
        <a href={SITE.phoneHref}>{SITE.phone}</a>
      </nav>
      <p>© {new Date().getFullYear()} {SITE.name}. Educational webinar only. Not financial advice. Cryptocurrency trading involves substantial risk of loss. Support: {SITE.phone} · {SITE.email}</p>
    </footer>

    <div className={`sticky-cta${modalOpen ? ' hide' : ''}`}>
      <span>Live webinar · {priceLabel}</span>
      <button className="primary-button" onClick={enroll}>Join <Arrow /></button>
    </div>

    {modalOpen && <div className="modal-backdrop" role="presentation" onMouseDown={() => setModalOpen(false)}>
      <section className="checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="close-modal" onClick={() => setModalOpen(false)} aria-label="Close">×</button>
        {status === 'success' ? <>
          <div className="modal-icon">✓</div>
          <p className="section-label">PAYMENT VERIFIED</p>
          <h2 id="checkout-title">You’re registered.</h2>
          <p>Payment is verified. Join the WhatsApp group for webinar access. Save your payment ID.</p>
          <div className="receipt">{receipt?.paymentId}</div>
          {receipt?.accessUrl
            ? <a className="primary-button modal-button" href={receipt.accessUrl} target="_blank" rel="noreferrer">Join WhatsApp group <Arrow /></a>
            : <p className="success-note">We’ll send access to {form.email}. Screenshot this payment ID if you need help.</p>}
        </> : <>
          <div className="modal-icon">✦</div>
          <p className="section-label">Live webinar · {priceLabel}</p>
          <h2 id="checkout-title">Reserve your seat</h2>
          <p>Pay with Razorpay. UPI, cards, net banking, and wallets. Access unlocks after signature verification.</p>
          {checkoutReady ? (
            <form className="checkout-form" onSubmit={openCheckout}>
              <label>Full name<input required minLength={2} value={form.name} onChange={updateField('name')} autoComplete="name" autoFocus /></label>
              <label>Email<input required type="email" value={form.email} onChange={updateField('email')} autoComplete="email" /></label>
              <label>Mobile<input required inputMode="numeric" pattern="[0-9]{10}" maxLength={10} value={form.contact} onChange={updateField('contact')} autoComplete="tel" placeholder="10-digit Indian mobile" /></label>
              {error && <div className="pay-error">{error}</div>}
              <button className="primary-button modal-button" type="submit" disabled={busy}>{buttonLabel} <Arrow /></button>
            </form>
          ) : (
            <div className="setup-note">
              <strong>Checkout is connecting</strong>
              <span>If this stays here, payment keys are not live on the server yet.</span>
            </div>
          )}
        </>}
        <small>Educational webinar only. No financial advice. No guaranteed profits or returns. <a href="/disclaimer">Read the disclaimer</a>.</small>
      </section>
    </div>}
  </>
}

function Root() {
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  if (path === '/admin') return <Admin />
  if (path === '/privacy') return <Privacy />
  if (path === '/terms') return <Terms />
  if (path === '/disclaimer') return <Disclaimer />
  return <App />
}

createRoot(document.getElementById('root')).render(<Root />)

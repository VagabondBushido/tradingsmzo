import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const modules = [
  ['01', 'Build your foundation', 'Learn market structure, trading terminology and how to read a chart without the noise.'],
  ['02', 'Find high-quality setups', 'Use a simple framework to identify trend, key levels and entries worth waiting for.'],
  ['03', 'Protect your capital', 'Position sizing, stop-loss placement and risk rules designed to keep one trade from defining you.'],
  ['04', 'Trade with consistency', 'Create a pre-trade checklist, journal your decisions and review your process every week.'],
]

const promises = [
  ['⌁', 'Clear process', 'A repeatable framework—not random calls or hype.'],
  ['◌', 'Beginner friendly', 'Plain-English lessons that start at the beginning.'],
  ['↗', 'Practical focus', 'Learn the habits and tools you can actually use.'],
]

function Arrow() { return <span className="arrow" aria-hidden="true">↗</span> }

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
  const [priceLabel, setPriceLabel] = useState('₹500')
  const [form, setForm] = useState({ name: '', email: '', contact: '' })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [receipt, setReceipt] = useState(null)

  useEffect(() => {
    const closeOnEscape = (event) => event.key === 'Escape' && setModalOpen(false)
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [])

  useEffect(() => {
    fetch('/api/checkout-config')
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          setCheckoutReady(true)
          if (data.priceLabel) setPriceLabel(data.priceLabel)
        }
      })
      .catch(() => setCheckoutReady(false))
  }, [])

  const updateField = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }))

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
        name: 'Crypto Clarity',
        description: `Full course · ${priceLabel}`,
        order_id: order.orderId,
        prefill: order.prefill,
        notes: { product: 'crypto-clarity-course' },
        theme: { color: '#c5ff42' },
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
          } catch (verifyError) {
            setError(verifyError.message)
            setStatus('idle')
          }
        },
        modal: {
          ondismiss: () => setStatus('idle'),
        },
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

  return <>
    <div className="ambient ambient-one" />
    <div className="ambient ambient-two" />
    <header className="nav wrap">
      <a href="#top" className="brand" aria-label="Crypto Clarity home"><span className="brand-mark">C</span> CRYPTO CLARITY</a>
      <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle menu">{menuOpen ? '×' : '☰'}</button>
      <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
        <a href="#curriculum" onClick={() => setMenuOpen(false)}>Curriculum</a>
        <a href="#outcomes" onClick={() => setMenuOpen(false)}>Why this course</a>
        <button className="text-button" onClick={() => { setMenuOpen(false); setModalOpen(true) }}>Enroll now · {priceLabel} <Arrow /></button>
      </nav>
    </header>

    <main id="top">
      <section className="hero wrap">
        <div className="hero-copy reveal">
          <p className="eyebrow"><span /> A practical crypto trading course</p>
          <h1>Trade with a <em>process.</em><br />Not a guess.</h1>
          <p className="hero-text">Stop chasing every move. Build the calm, repeatable skills to read markets, manage risk and make better trading decisions.</p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => setModalOpen(true)}>Start learning · {priceLabel} <Arrow /></button>
            <a className="watch-link" href="#curriculum"><span className="play">▶</span> Explore the course</a>
          </div>
          <div className="trust-row"><span>Built for beginners</span><i /> <span>Lifetime access</span><i /> <span>{priceLabel} one-time</span></div>
        </div>
        <div className="hero-art" aria-label="Abstract rising market chart">
          <div className="orb" />
          <div className="chart-card">
            <div className="card-top"><span>BTC / USDT</span><span className="green">+4.82%</span></div>
            <svg viewBox="0 0 430 210" role="img" aria-label="Upward trading chart">
              <defs><linearGradient id="fill" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#c5ff42" stopOpacity=".35"/><stop offset="1" stopColor="#c5ff42" stopOpacity="0"/></linearGradient></defs>
              <path className="grid" d="M0 42H430M0 105H430M0 168H430M54 0V210M162 0V210M270 0V210M378 0V210" />
              <path d="M0 178 L27 164 L46 173 L70 143 L94 151 L113 125 L137 138 L158 107 L181 119 L208 84 L235 99 L262 61 L281 73 L304 48 L327 57 L350 28 L375 40 L400 13 L430 21 V210 H0Z" fill="url(#fill)" />
              <path className="chart-line" d="M0 178 L27 164 L46 173 L70 143 L94 151 L113 125 L137 138 L158 107 L181 119 L208 84 L235 99 L262 61 L281 73 L304 48 L327 57 L350 28 L375 40 L400 13 L430 21" />
              <circle cx="400" cy="13" r="6" fill="#c5ff42" />
            </svg>
            <div className="card-bottom"><span>Simple setup</span><span>Risk first</span><span>Clear execution</span></div>
          </div>
          <div className="float-pill pill-one"><span className="dot" /> Live learning</div>
          <div className="float-pill pill-two">↗ &nbsp; Build your edge</div>
        </div>
      </section>

      <section className="ticker" aria-label="Course benefits"><div>DISCIPLINE <b>✦</b> CLARITY <b>✦</b> RISK MANAGEMENT <b>✦</b> EXECUTION <b>✦</b> DISCIPLINE <b>✦</b> CLARITY <b>✦</b> RISK MANAGEMENT <b>✦</b></div></section>

      <section id="outcomes" className="outcomes wrap section">
        <div className="section-label">THE DIFFERENCE</div>
        <div className="outcomes-heading"><h2>Everything you need<br />to trade <em>smarter.</em></h2><p>Designed to help you build a grounded trading practice—one decision at a time.</p></div>
        <div className="promise-grid">
          {promises.map(([symbol, title, text]) => <article className="promise" key={title}><span className="promise-icon">{symbol}</span><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section id="curriculum" className="curriculum section">
        <div className="wrap curriculum-inner">
          <div><div className="section-label">INSIDE THE COURSE</div><h2>A framework you<br />can come back to.</h2><p className="curriculum-intro">Four focused modules. No information overload—just the core skills that make a real difference.</p><button className="secondary-button" onClick={() => setModalOpen(true)}>Get full access · {priceLabel} <Arrow /></button></div>
          <div className="module-list">{modules.map(([number, title, text]) => <article className="module" key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div><Arrow /></article>)}</div>
        </div>
      </section>

      <section className="quote-section wrap section"><div className="quote-mark">“</div><blockquote>The goal isn't to predict every move. It's to have a plan for the moves that matter.</blockquote><p>— THE CRYPTO CLARITY APPROACH</p></section>

      <section className="enroll wrap"><div className="enroll-content"><p className="eyebrow"><span /> Start with the fundamentals</p><h2>Your next trade<br />can start with <em>clarity.</em></h2><p>Get the complete course today for {priceLabel} and start building a trading process you can trust.</p><button className="primary-button light" onClick={() => setModalOpen(true)}>Enroll in the course <Arrow /></button></div><div className="enroll-shape">✦</div></section>
    </main>

    <footer className="wrap"><a className="brand" href="#top"><span className="brand-mark">C</span> CRYPTO CLARITY</a><p>© {new Date().getFullYear()} Crypto Clarity. For educational purposes only.</p><a href="mailto:hello@yourdomain.com">Contact</a></footer>

    {modalOpen && <div className="modal-backdrop" role="presentation" onMouseDown={() => setModalOpen(false)}>
      <section className="checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="close-modal" onClick={() => setModalOpen(false)} aria-label="Close">×</button>
        {status === 'success' ? <>
          <div className="modal-icon">✓</div>
          <p className="section-label">PAYMENT VERIFIED</p>
          <h2 id="checkout-title">You’re in.</h2>
          <p>Razorpay confirmed this payment on the server. Keep this ID for your records.</p>
          <div className="receipt">{receipt?.paymentId}</div>
          {receipt?.accessUrl
            ? <a className="primary-button modal-button" href={receipt.accessUrl} target="_blank" rel="noreferrer">Open course access <Arrow /></a>
            : <p className="success-note">We’ll send course access to {form.email}. Screenshot this payment ID if you need help.</p>}
        </> : <>
          <div className="modal-icon">✦</div>
          <p className="section-label">CRYPTO CLARITY · {priceLabel}</p>
          <h2 id="checkout-title">Ready to build your edge?</h2>
          <p>Pay securely with Razorpay. UPI, cards, net banking and wallets are supported. Access unlocks after signature verification.</p>
          {checkoutReady ? (
            <form className="checkout-form" onSubmit={openCheckout}>
              <label>Full name<input required minLength={2} value={form.name} onChange={updateField('name')} autoComplete="name" /></label>
              <label>Email<input required type="email" value={form.email} onChange={updateField('email')} autoComplete="email" /></label>
              <label>Mobile<input required inputMode="numeric" pattern="[0-9]{10}" maxLength={10} value={form.contact} onChange={updateField('contact')} autoComplete="tel" placeholder="10-digit number" /></label>
              {error && <div className="pay-error">{error}</div>}
              <button className="primary-button modal-button" type="submit" disabled={busy}>{buttonLabel} <Arrow /></button>
            </form>
          ) : (
            <div className="setup-note">
              <strong>Add Razorpay keys to go live</strong>
              <span>Put your test (or live) key ID and secret in <code>.env</code>, restart the app, then this checkout will open.</span>
            </div>
          )}
        </>}
        <small>Educational content only. Crypto assets are volatile and involve risk. Payments are verified server-side before access is granted.</small>
      </section>
    </div>}
  </>
}

createRoot(document.getElementById('root')).render(<App />)

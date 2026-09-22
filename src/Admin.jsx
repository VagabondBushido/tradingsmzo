import React, { useEffect, useState } from 'react'
import Seo from './seo.js'

function Arrow() { return <span className="arrow" aria-hidden="true">↗</span> }

export default function Admin() {
  const [password, setPassword] = useState('')
  const [priceInr, setPriceInr] = useState(499)
  const [accessUrl, setAccessUrl] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/checkout-config', { cache: 'no-store' })
      .then((response) => response.json())
      .then((data) => {
        if (!data.ok) return
        if (data.amount) setPriceInr(Math.round(Number(data.amount) / 100))
        if (data.accessUrl) setAccessUrl(data.accessUrl)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const save = async (event) => {
    event.preventDefault()
    setError('')
    setStatus('Saving…')
    const response = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, priceInr, accessUrl }),
    })
    const data = await response.json()
    if (!data.ok) {
      setStatus('')
      setError(data.error || 'Could not save')
      return
    }
    setPriceInr(data.priceInr)
    setAccessUrl(data.accessUrl)
    setStatus(`Saved. The course price is now ₹${data.priceInr}.`)
  }

  return (
    <div className="admin-page">
      <Seo title="Admin | Trading Samzo" description="Private course admin." noIndex />
      <div className="ambient ambient-one" />
      <header className="nav wrap">
        <a href="/" className="brand"><span className="brand-mark">C</span> CRYPTO CLARITY</a>
        <a className="watch-link" href="/">Back to site</a>
      </header>
      <section className="checkout-modal admin-card">
        <p className="section-label">ADMIN</p>
        <h2>Change course price</h2>
        <p>Update the live checkout amount and the WhatsApp group shown after payment. After saving, refresh the homepage to see the new price.</p>
        {loading ? <p>Loading current price…</p> : (
          <form className="checkout-form" onSubmit={save}>
            <label>Course price (INR)
              <input type="number" min="1" max="100000" required value={priceInr} onChange={(event) => setPriceInr(event.target.value)} />
            </label>
            <label>WhatsApp group link after purchase
              <input type="url" required value={accessUrl} onChange={(event) => setAccessUrl(event.target.value)} />
            </label>
            <label>Password
              <input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" />
            </label>
            {error && <div className="pay-error">{error}</div>}
            {status && <div className="admin-ok">{status}</div>}
            <button className="primary-button modal-button" type="submit">Save price <Arrow /></button>
          </form>
        )}
      </section>
    </div>
  )
}

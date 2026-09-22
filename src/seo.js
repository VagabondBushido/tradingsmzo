import { useEffect } from 'react'
import { SITE } from './site.js'

export default function Seo({ title, description, noIndex = false, jsonLd }) {
  const serialized = jsonLd ? JSON.stringify(jsonLd) : ''
  useEffect(() => {
    document.title = title
    const set = (name, content, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`
      let tag = document.querySelector(selector)
      if (!tag) {
        tag = document.createElement('meta')
        if (property) tag.setAttribute('property', name)
        else tag.setAttribute('name', name)
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', content)
    }
    set('description', description)
    set('robots', noIndex ? 'noindex,nofollow' : 'index,follow')
    set('og:title', title, true)
    set('og:description', description, true)
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', noIndex ? `${SITE.url}/admin` : SITE.url)

    const existing = document.getElementById('course-jsonld')
    if (existing) existing.remove()
    if (jsonLd) {
      const script = document.createElement('script')
      script.id = 'course-jsonld'
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(jsonLd)
      document.head.appendChild(script)
    }
  }, [title, description, noIndex, serialized])
  return null
}

export function bootAnalytics() {
  const ga = import.meta.env.VITE_GA_MEASUREMENT_ID
  const ads = import.meta.env.VITE_GOOGLE_ADS_ID
  const id = ga || ads
  if (!id || window.gtag) return
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`
  document.head.appendChild(script)
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() { window.dataLayer.push(arguments) }
  window.gtag('js', new Date())
  if (ga) window.gtag('config', ga)
  if (ads) window.gtag('config', ads)
}

export function trackPurchase({ paymentId, value, currency = 'INR' }) {
  if (typeof window.gtag !== 'function') return
  window.gtag('event', 'purchase', {
    transaction_id: paymentId,
    value,
    currency,
    items: [{ item_name: SITE.course, price: value, quantity: 1 }],
  })
  const sendTo = import.meta.env.VITE_GOOGLE_ADS_CONVERSION
  if (sendTo) window.gtag('event', 'conversion', { send_to: sendTo, value, currency, transaction_id: paymentId })
}

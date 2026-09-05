import nodemailer from 'nodemailer'

function leadInbox() {
  return process.env.LEAD_EMAIL || 'pratikpathak2004@gmail.com'
}

function getTransport() {
  const user = process.env.GMAIL_USER
  const pass = String(process.env.GMAIL_APP_PASSWORD || '').replaceAll(' ', '')
  if (!user || !pass) return null
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  })
}

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function leadMarkup(rows) {
  const items = rows
    .filter(([, value]) => value)
    .map(([label, value]) => `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`)
    .join('')
  return `<div style="font-family:sans-serif;line-height:1.5">${items}</div>`
}

export async function notifyLead(details) {
  const transport = getTransport()
  const inbox = leadInbox()
  if (!transport) {
    console.warn('Lead email skipped: set GMAIL_USER and GMAIL_APP_PASSWORD in .env')
    return { sent: false }
  }

  const paid = details.status === 'paid'
  const subject = paid
    ? `Payment received · ${details.name || details.email || 'Crypto Clarity'}`
    : `New checkout · ${details.name || details.email || 'Crypto Clarity'}`

  const rows = [
    ['Status', paid ? 'PAID ₹500' : 'Started checkout (₹500)'],
    ['Name', details.name],
    ['Email', details.email],
    ['Phone', details.contact],
    ['Order ID', details.orderId],
    ['Payment ID', details.paymentId],
    ['Time', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })],
  ]

  await transport.sendMail({
    from: `"Crypto Clarity" <${process.env.GMAIL_USER}>`,
    to: inbox,
    replyTo: details.email || undefined,
    subject,
    text: rows.filter(([, value]) => value).map(([label, value]) => `${label}: ${value}`).join('\n'),
    html: leadMarkup(rows),
  })
  console.log(`Lead email sent to ${inbox} (${paid ? 'paid' : 'checkout'})`)
  return { sent: true }
}

export function notifyLeadSafe(details) {
  notifyLead(details).catch((error) => {
    console.error('Lead email failed:', error.message)
  })
}

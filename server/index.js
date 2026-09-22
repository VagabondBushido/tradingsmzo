import path from 'node:path'
import { fileURLToPath } from 'node:url'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { notifyLeadSafe } from '../lib/notify.js'
import { checkPassword } from '../lib/admin.js'
import { getSettings, saveSettings } from '../lib/settings.js'
import {
  confirmCapturedPayment,
  createCourseOrder,
  fetchCourseOrder,
  getCheckoutConfig,
  isValidCheckoutDetails,
  verifyCheckoutSignature,
  verifyWebhookSignature,
} from '../lib/payments.js'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
dotenv.config({ path: path.join(rootDir, '.env') })

const app = express()
const isProd = process.env.NODE_ENV === 'production'
const port = Number(process.env.PORT) || (isProd ? 3000 : 8787)

app.use(cors({ origin: isProd ? true : ['http://localhost:5173', 'http://127.0.0.1:5173'], credentials: true }))
app.post('/api/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-razorpay-signature']
  const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from(JSON.stringify(req.body || {}))
  if (!verifyWebhookSignature(rawBody, signature)) {
    return res.status(400).json({ ok: false, error: 'Invalid webhook signature' })
  }
  const payload = JSON.parse(rawBody.toString('utf8'))
  if (payload.event === 'payment.captured') {
    console.log('Razorpay payment captured', payload.payload?.payment?.entity?.id)
  }
  return res.json({ ok: true })
})
app.use(express.json({ limit: '32kb' }))

app.get('/api/checkout-config', async (_req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate')
    return res.json({ ok: true, ...(await getCheckoutConfig()) })
  } catch (error) {
    return res.status(error.status || 500).json({ ok: false, error: error.message })
  }
})

app.post('/api/create-order', async (req, res) => {
  try {
    const details = isValidCheckoutDetails(req.body || {})
    if (!details.ok) {
      return res.status(400).json({ ok: false, error: 'Enter a valid name, email and 10-digit mobile number.' })
    }
    const order = await createCourseOrder(details)
    notifyLeadSafe({
      status: 'checkout_started',
      name: details.name,
      email: details.email,
      contact: details.contact,
      orderId: order.id,
    })
    const { keyId } = await getCheckoutConfig()
    return res.json({
      ok: true,
      keyId,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      prefill: { name: details.name, email: details.email, contact: details.contact },
    })
  } catch (error) {
    return res.status(error.status || 500).json({ ok: false, error: error.message || 'Could not create order' })
  }
})

app.post('/api/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {}
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ ok: false, error: 'Missing payment details' })
    }
    if (!verifyCheckoutSignature({ razorpay_order_id, razorpay_payment_id, razorpay_signature })) {
      return res.status(400).json({ ok: false, error: 'Payment signature verification failed' })
    }
    const order = await fetchCourseOrder(razorpay_order_id)
    const payment = await confirmCapturedPayment(razorpay_payment_id, order.amount)
    notifyLeadSafe({
      status: 'paid',
      name: order.notes?.customer_name,
      email: order.notes?.customer_email || payment.email,
      contact: order.notes?.customer_contact || payment.contact,
      orderId: razorpay_order_id,
      paymentId: payment.id,
    })
    return res.json({
      ok: true,
      paymentId: payment.id,
      orderId: razorpay_order_id,
      accessUrl: (await getSettings()).accessUrl,
    })
  } catch (error) {
    return res.status(error.status || 500).json({ ok: false, error: error.message || 'Payment verification failed' })
  }
})

app.post('/api/admin/settings', async (req, res) => {
  if (!checkPassword(req.body?.password)) {
    return res.status(401).json({ ok: false, error: 'Wrong password' })
  }
  try {
    const settings = await saveSettings({
      priceInr: req.body?.priceInr,
      accessUrl: req.body?.accessUrl,
    })
    return res.json({ ok: true, priceInr: settings.priceInr, accessUrl: settings.accessUrl, priceLabel: settings.priceLabel })
  } catch (error) {
    return res.status(error.status || 500).json({ ok: false, error: error.message || 'Could not save settings' })
  }
})

if (isProd) {
  const distDir = path.join(rootDir, 'dist')
  app.use(express.static(distDir))
  app.get('*', (_req, res) => res.sendFile(path.join(distDir, 'index.html')))
}

app.listen(port, () => {
  console.log(`Payments API listening on http://127.0.0.1:${port}`)
})

import { verifyWebhookSignature } from '../lib/payments.js'

export const config = {
  api: { bodyParser: false },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' })
    return
  }
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const rawBody = Buffer.concat(chunks)
  const signature = req.headers['x-razorpay-signature']
  if (!verifyWebhookSignature(rawBody, signature)) {
    res.status(400).json({ ok: false, error: 'Invalid webhook signature' })
    return
  }
  res.status(200).json({ ok: true })
}

import crypto from 'node:crypto'
import Razorpay from 'razorpay'
import { getSettings } from './settings.js'

export const COURSE_CURRENCY = 'INR'

function getKeys() {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keyId || !keySecret) {
    const error = new Error('Razorpay keys are not configured')
    error.status = 503
    throw error
  }
  return { keyId, keySecret }
}

export function getRazorpay() {
  const { keyId, keySecret } = getKeys()
  return { keyId, client: new Razorpay({ key_id: keyId, key_secret: keySecret }) }
}

export async function getCheckoutConfig() {
  const { keyId } = getKeys()
  const settings = await getSettings()
  return {
    keyId,
    amount: settings.amountPaise,
    currency: COURSE_CURRENCY,
    priceLabel: settings.priceLabel,
    courseTitle: 'Crypto Clarity — Full course',
    accessUrl: settings.accessUrl,
  }
}

export async function createCourseOrder({ name, email, contact }) {
  const { client } = getRazorpay()
  const settings = await getSettings()
  const order = await client.orders.create({
    amount: settings.amountPaise,
    currency: COURSE_CURRENCY,
    receipt: `cc_${Date.now()}`,
    notes: {
      product: 'crypto-clarity-course',
      customer_name: name,
      customer_email: email,
      customer_contact: contact,
    },
  })
  return order
}

export function verifyCheckoutSignature({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
  const { keySecret } = getKeys()
  const expected = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  const expectedBuffer = Buffer.from(expected)
  const actualBuffer = Buffer.from(String(razorpay_signature || ''))
  if (expectedBuffer.length !== actualBuffer.length) return false
  return crypto.timingSafeEqual(expectedBuffer, actualBuffer)
}

export async function confirmCapturedPayment(paymentId, expectedAmountPaise) {
  const { client } = getRazorpay()
  const payment = await client.payments.fetch(paymentId)
  const paid = payment.status === 'captured' || payment.status === 'authorized'
  const amountOk = Number(payment.amount) === Number(expectedAmountPaise)
  const currencyOk = payment.currency === COURSE_CURRENCY
  if (!paid || !amountOk || !currencyOk) {
    const error = new Error('Payment could not be confirmed')
    error.status = 400
    throw error
  }
  return payment
}

export async function fetchCourseOrder(orderId) {
  const { client } = getRazorpay()
  return client.orders.fetch(orderId)
}

export function verifyWebhookSignature(rawBody, signature) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (!secret || !signature) return false
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
  const expectedBuffer = Buffer.from(expected)
  const actualBuffer = Buffer.from(signature)
  if (expectedBuffer.length !== actualBuffer.length) return false
  return crypto.timingSafeEqual(expectedBuffer, actualBuffer)
}

export function isValidCheckoutDetails({ name, email, contact }) {
  const cleanName = String(name || '').trim()
  const cleanEmail = String(email || '').trim().toLowerCase()
  const cleanContact = String(contact || '').replace(/\D/g, '')
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
  const contactOk = cleanContact.length === 10
  return {
    ok: cleanName.length >= 2 && emailOk && contactOk,
    name: cleanName,
    email: cleanEmail,
    contact: cleanContact,
  }
}

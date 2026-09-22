import { checkPassword, sendJson } from '../lib/admin.js'
import { notifyLeadSafe } from '../lib/notify.js'
import { getSettings, saveSettings } from '../lib/settings.js'
import {
  confirmCapturedPayment,
  createCourseOrder,
  fetchCourseOrder,
  getCheckoutConfig,
  isValidCheckoutDetails,
  verifyCheckoutSignature,
} from '../lib/payments.js'

function send(res, status, payload) {
  sendJson(res, status, payload)
}

export async function handleCheckoutConfig(_req, res) {
  try {
    send(res, 200, { ok: true, ...(await getCheckoutConfig()) })
  } catch (error) {
    send(res, error.status || 500, { ok: false, error: error.message })
  }
}

export async function handleAdminLogin(req, res) {
  if (req.method !== 'POST') return send(res, 405, { ok: false, error: 'Method not allowed' })
  if (!checkPassword(req.body?.password)) {
    return send(res, 401, { ok: false, error: 'Wrong password' })
  }
  const settings = await getSettings()
  send(res, 200, { ok: true, priceInr: settings.priceInr, accessUrl: settings.accessUrl, priceLabel: settings.priceLabel })
}

export async function handleAdminLogout(req, res) {
  if (req.method !== 'POST') return send(res, 405, { ok: false, error: 'Method not allowed' })
  send(res, 200, { ok: true })
}

export async function handleAdminSettings(req, res) {
  try {
    if (req.method === 'GET') {
      const settings = await getSettings()
      return send(res, 200, { ok: true, priceInr: settings.priceInr, accessUrl: settings.accessUrl, priceLabel: settings.priceLabel })
    }
    if (req.method !== 'POST') return send(res, 405, { ok: false, error: 'Method not allowed' })
    if (!checkPassword(req.body?.password)) {
      return send(res, 401, { ok: false, error: 'Wrong password' })
    }
    const settings = await saveSettings({
      priceInr: req.body?.priceInr,
      accessUrl: req.body?.accessUrl,
    })
    send(res, 200, { ok: true, priceInr: settings.priceInr, accessUrl: settings.accessUrl, priceLabel: settings.priceLabel })
  } catch (error) {
    send(res, error.status || 500, { ok: false, error: error.message || 'Could not save settings' })
  }
}

export async function handleCreateOrder(req, res) {
  if (req.method !== 'POST') return send(res, 405, { ok: false, error: 'Method not allowed' })
  try {
    const details = isValidCheckoutDetails(req.body || {})
    if (!details.ok) {
      return send(res, 400, { ok: false, error: 'Enter a valid name, email and 10-digit mobile number.' })
    }
    const order = await createCourseOrder(details)
    await notifyLeadSafe({
      status: 'checkout_started',
      name: details.name,
      email: details.email,
      contact: details.contact,
      orderId: order.id,
    })
    const { keyId } = await getCheckoutConfig()
    send(res, 200, {
      ok: true,
      keyId,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      prefill: { name: details.name, email: details.email, contact: details.contact },
    })
  } catch (error) {
    send(res, error.status || 500, { ok: false, error: error.message || 'Could not create order' })
  }
}

export async function handleVerifyPayment(req, res) {
  if (req.method !== 'POST') return send(res, 405, { ok: false, error: 'Method not allowed' })
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {}
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return send(res, 400, { ok: false, error: 'Missing payment details' })
    }
    if (!verifyCheckoutSignature({ razorpay_order_id, razorpay_payment_id, razorpay_signature })) {
      return send(res, 400, { ok: false, error: 'Payment signature verification failed' })
    }
    const order = await fetchCourseOrder(razorpay_order_id)
    const payment = await confirmCapturedPayment(razorpay_payment_id, order.amount)
    await notifyLeadSafe({
      status: 'paid',
      name: order.notes?.customer_name,
      email: order.notes?.customer_email || payment.email,
      contact: order.notes?.customer_contact || payment.contact,
      orderId: razorpay_order_id,
      paymentId: payment.id,
    })
    send(res, 200, {
      ok: true,
      paymentId: payment.id,
      orderId: razorpay_order_id,
      accessUrl: (await getSettings()).accessUrl,
    })
  } catch (error) {
    send(res, error.status || 500, { ok: false, error: error.message || 'Payment verification failed' })
  }
}

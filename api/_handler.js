import { notifyLeadSafe } from '../lib/notify.js'
import {
  confirmCapturedPayment,
  createCourseOrder,
  fetchCourseOrder,
  getCheckoutConfig,
  isValidCheckoutDetails,
  verifyCheckoutSignature,
} from '../lib/payments.js'

function send(res, status, payload) {
  res.status(status).json(payload)
}

export async function handleCheckoutConfig(_req, res) {
  try {
    send(res, 200, { ok: true, ...getCheckoutConfig() })
  } catch (error) {
    send(res, error.status || 500, { ok: false, error: error.message })
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
    notifyLeadSafe({
      status: 'checkout_started',
      name: details.name,
      email: details.email,
      contact: details.contact,
      orderId: order.id,
    })
    const { keyId } = getCheckoutConfig()
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
    const payment = await confirmCapturedPayment(razorpay_payment_id)
    const order = await fetchCourseOrder(razorpay_order_id)
    notifyLeadSafe({
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
      accessUrl: process.env.COURSE_ACCESS_URL || '',
    })
  } catch (error) {
    send(res, error.status || 500, { ok: false, error: error.message || 'Payment verification failed' })
  }
}

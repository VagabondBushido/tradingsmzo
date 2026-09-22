import crypto from 'node:crypto'

function adminPassword() {
  return process.env.ADMIN_PASSWORD || 'pratikpathak2004'
}

function safeEqual(left, right) {
  const a = Buffer.from(String(left))
  const b = Buffer.from(String(right))
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}

export function checkPassword(password) {
  return safeEqual(String(password || ''), adminPassword())
}

export function sendJson(res, status, payload) {
  const body = JSON.stringify(payload)
  if (typeof res.setHeader === 'function') {
    res.setHeader('Content-Type', 'application/json')
    res.statusCode = status
    if (typeof res.json === 'function' && typeof res.status === 'function') {
      res.status(status).json(payload)
      return
    }
    res.end(body)
    return
  }
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(body)
}

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const DEFAULT_ACCESS_URL = 'https://chat.whatsapp.com/HkrD3kiOGiT8nC5Vgsr6kx?s=cl&p=a&mlu=4&ilr=4'
const filePath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../data/settings.json')
const tmpPath = '/tmp/crypto-clarity-settings.json'
const SETTINGS_KEY = 'course-settings'

function defaults() {
  const priceInr = Number(process.env.COURSE_PRICE_INR) || 499
  return {
    priceInr,
    accessUrl: process.env.COURSE_ACCESS_URL || DEFAULT_ACCESS_URL,
  }
}

export function normalize(raw = {}) {
  const fallback = defaults()
  const priceInr = Math.round(Number(raw.priceInr ?? fallback.priceInr))
  const accessUrl = String(raw.accessUrl ?? fallback.accessUrl).trim()
  if (!Number.isFinite(priceInr) || priceInr < 1 || priceInr > 100000) {
    const error = new Error('Enter a course price between ₹1 and ₹1,00,000.')
    error.status = 400
    throw error
  }
  if (accessUrl && !/^https:\/\//i.test(accessUrl)) {
    const error = new Error('Access link must start with https://')
    error.status = 400
    throw error
  }
  return {
    priceInr,
    accessUrl: accessUrl || DEFAULT_ACCESS_URL,
    amountPaise: priceInr * 100,
    priceLabel: `₹${priceInr}`,
  }
}

function readJson(target) {
  try {
    return JSON.parse(fs.readFileSync(target, 'utf8'))
  } catch {
    return null
  }
}

function githubRepo() {
  const owner = process.env.VERCEL_GIT_REPO_OWNER || 'VagabondBushido'
  const name = process.env.VERCEL_GIT_REPO_SLUG || 'tradingsmzo'
  return `${owner}/${name}`
}

function githubToken() {
  return process.env.GITHUB_TOKEN || process.env.GH_TOKEN || ''
}

function kvConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return { url: url.replace(/\/$/, ''), token }
}

async function saveToKv(settings) {
  const kv = kvConfig()
  if (!kv) return false
  const response = await fetch(kv.url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${kv.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(['SET', SETTINGS_KEY, JSON.stringify({ priceInr: settings.priceInr, accessUrl: settings.accessUrl })]),
  })
  return response.ok
}

async function loadFromKv() {
  const kv = kvConfig()
  if (!kv) return null
  const response = await fetch(kv.url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${kv.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(['GET', SETTINGS_KEY]),
  })
  if (!response.ok) return null
  const data = await response.json()
  if (!data?.result) return null
  return typeof data.result === 'string' ? JSON.parse(data.result) : data.result
}

async function loadFromGithub() {
  const token = githubToken()
  const headers = { 'User-Agent': 'crypto-clarity', Accept: 'application/vnd.github+json' }
  if (token) headers.Authorization = `Bearer ${token}`
  const response = await fetch(`https://api.github.com/repos/${githubRepo()}/contents/data/settings.json?ref=main`, { headers })
  if (!response.ok) return null
  const data = await response.json()
  if (!data.content) return null
  const parsed = JSON.parse(Buffer.from(data.content, 'base64').toString('utf8'))
  parsed._sha = data.sha
  return parsed
}

async function saveToGithub(settings) {
  const token = githubToken()
  if (!token) return false
  const headers = {
    Authorization: `Bearer ${token}`,
    'User-Agent': 'crypto-clarity',
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
  }
  const current = await fetch(`https://api.github.com/repos/${githubRepo()}/contents/data/settings.json?ref=main`, { headers })
  const meta = current.ok ? await current.json() : {}
  const body = {
    message: `Update course price to ₹${settings.priceInr}`,
    content: Buffer.from(JSON.stringify({ priceInr: settings.priceInr, accessUrl: settings.accessUrl }, null, 2) + '\n').toString('base64'),
    branch: 'main',
  }
  if (meta.sha) body.sha = meta.sha
  const response = await fetch(`https://api.github.com/repos/${githubRepo()}/contents/data/settings.json`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  })
  return response.ok
}

function writeLocal(settings) {
  const payload = `${JSON.stringify({ priceInr: settings.priceInr, accessUrl: settings.accessUrl }, null, 2)}\n`
  for (const target of [filePath, tmpPath]) {
    try {
      fs.mkdirSync(path.dirname(target), { recursive: true })
      fs.writeFileSync(target, payload)
    } catch {
      // Ignore read-only filesystem on Vercel.
    }
  }
}

export async function getSettings() {
  const now = Date.now()
  if (globalThis.__courseSettings && now - (globalThis.__courseSettingsAt || 0) < 15_000) {
    return globalThis.__courseSettings
  }
  try {
    const remote = (await loadFromKv()) || (githubToken() ? await loadFromGithub() : null)
    if (remote) {
      globalThis.__courseSettings = normalize(remote)
      globalThis.__courseSettingsAt = now
      return globalThis.__courseSettings
    }
  } catch {
    // Fall through to local files.
  }
  globalThis.__courseSettings = normalize(readJson(tmpPath) || readJson(filePath) || defaults())
  globalThis.__courseSettingsAt = now
  return globalThis.__courseSettings
}

export async function saveSettings(input) {
  const next = normalize({ ...(await getSettings()), ...input })
  globalThis.__courseSettings = next
  globalThis.__courseSettingsAt = Date.now()
  writeLocal(next)
  await saveToKv(next).catch(() => false)
  await saveToGithub(next).catch(() => false)
  return next
}

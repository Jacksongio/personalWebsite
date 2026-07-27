import { createHmac } from "node:crypto"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { NextResponse } from "next/server"

import { validateContact } from "@/lib/contact-validation"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const redisConfigured = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
)

const rateLimit = redisConfigured
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(3, "24 h"),
      prefix: "portfolio:contact",
      analytics: false,
    })
  : null

function jsonError(error: string, status: number, headers?: HeadersInit) {
  return NextResponse.json({ error }, { status, headers })
}

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin")
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host")
  if (!origin || !host) return false

  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

function getClientIp(request: Request) {
  const forwarded =
    request.headers.get("x-vercel-forwarded-for") ?? request.headers.get("x-forwarded-for")
  return forwarded?.split(",")[0]?.trim() || null
}

function isFormspreeEndpoint(endpoint: string) {
  try {
    const url = new URL(endpoint)
    return url.protocol === "https:" && url.hostname === "formspree.io" && /^\/f\/[\w-]+$/.test(url.pathname)
  } catch {
    return false
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return jsonError("This form only accepts requests from this website.", 403)
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0)
  if (contentLength > 12_000) {
    return jsonError("That message is too large for the contact form.", 413)
  }

  const formData = await request.formData().catch(() => null)
  if (!formData) return jsonError("That submission could not be read.", 400)

  // Quietly accept honeypot submissions so automated senders receive no useful signal.
  if (String(formData.get("_gotcha") ?? "")) {
    return NextResponse.json({ ok: true })
  }

  const values = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
  }
  const errors = validateContact(values)
  if (Object.keys(errors).length) {
    return NextResponse.json({ error: "Please check the highlighted fields.", errors }, { status: 400 })
  }

  const endpoint = process.env.FORMSPREE_ENDPOINT
  const salt = process.env.CONTACT_RATE_LIMIT_SALT
  const ip = getClientIp(request)

  if (!endpoint || !isFormspreeEndpoint(endpoint) || !rateLimit || !salt) {
    return jsonError("The contact form is temporarily unavailable. Please use the email link.", 503)
  }
  if (!ip) {
    return jsonError("Your network address could not be verified. Please use the email link.", 400)
  }

  // Hash the address before using it as a Redis key so raw visitor IPs are not stored.
  const identifier = createHmac("sha256", salt).update(ip).digest("hex")
  const limit = await rateLimit.limit(identifier)
  const limitHeaders = {
    "X-RateLimit-Limit": String(limit.limit),
    "X-RateLimit-Remaining": String(limit.remaining),
    "X-RateLimit-Reset": String(limit.reset),
  }

  if (!limit.success) {
    const retryAfter = Math.max(1, Math.ceil((limit.reset - Date.now()) / 1000))
    return jsonError(
      "Three messages in one day? I admire the enthusiasm. Try again tomorrow.",
      429,
      { ...limitHeaders, "Retry-After": String(retryAfter) },
    )
  }

  const outgoing = new FormData()
  outgoing.set("name", values.name)
  outgoing.set("email", values.email)
  outgoing.set("message", values.message)
  outgoing.set("_subject", "New portfolio contact")

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body: outgoing,
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8_000),
      cache: "no-store",
    })

    if (!response.ok) {
      return jsonError("The message service is having a moment. Please try again shortly.", 502)
    }

    return NextResponse.json({ ok: true }, { headers: limitHeaders })
  } catch {
    return jsonError("The message service is having a moment. Please try again shortly.", 502)
  }
}

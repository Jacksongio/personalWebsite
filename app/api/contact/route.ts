import { NextResponse } from "next/server"

import { validateContact } from "@/lib/contact-validation"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

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

  if (!endpoint || !isFormspreeEndpoint(endpoint)) {
    return jsonError("The contact form is temporarily unavailable. Please use the email link.", 503)
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

    return NextResponse.json({ ok: true })
  } catch {
    return jsonError("The message service is having a moment. Please try again shortly.", 502)
  }
}

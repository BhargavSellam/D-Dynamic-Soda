import type { IncomingMessage, ServerResponse } from "node:http"

type EnquiryPayload = {
  formType?: string
  fullName?: string
  businessName?: string
  contactPerson?: string
  email?: string
  phone?: string
  location?: string
  enquiryType?: string
  product?: string
  message?: string
  privacy?: boolean
  website?: string
  startedAt?: number
}

const attempts = new Map<string, number[]>()
const WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 5

function clean(value: unknown, max = 500) {
  return typeof value === "string"
    ? value.replace(/[<>]/g, "").trim().slice(0, max)
    : ""
}

function sendJson(res: ServerResponse, status: number, body: object) {
  res.statusCode = status
  res.setHeader("Content-Type", "application/json; charset=utf-8")
  res.setHeader("Cache-Control", "no-store")
  res.end(JSON.stringify(body))
}

function clientIp(req: IncomingMessage) {
  const forwarded = req.headers["x-forwarded-for"]
  return (
    (Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(",")[0]) ||
    req.socket.remoteAddress ||
    "unknown"
  )
}

function isRateLimited(ip: string) {
  const now = Date.now()
  const recent = (attempts.get(ip) || []).filter(
    (timestamp) => now - timestamp < WINDOW_MS,
  )
  recent.push(now)
  attempts.set(ip, recent)
  return recent.length > MAX_ATTEMPTS
}

export async function handleEnquiry(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    return sendJson(res, 405, { error: "Method not allowed." })
  }

  if (isRateLimited(clientIp(req))) {
    return sendJson(res, 429, {
      error: "Too many enquiries. Please wait before trying again.",
    })
  }

  let raw = ""
  for await (const chunk of req) {
    raw += chunk
    if (raw.length > 20_000) {
      return sendJson(res, 413, { error: "Submission is too large." })
    }
  }

  let body: EnquiryPayload
  try {
    body = (JSON.parse(raw) as EnquiryPayload)
  } catch {
    return sendJson(res, 400, { error: "Invalid submission." })
  }

  if (
    body.website ||
    !body.startedAt ||
    Date.now() - Number(body.startedAt) < 2_000
  ) {
    return sendJson(res, 400, { error: "Submission could not be verified." })
  }

  const fullName = clean(body.fullName || body.contactPerson, 100)
  const email = clean(body.email, 150)
  const phone = clean(body.phone, 40)
  const message = clean(body.message, 2_000)
  const enquiryType = clean(body.enquiryType, 60)

  if (
    !fullName ||
    !email ||
    !phone ||
    !message ||
    !enquiryType ||
    !body.privacy
  ) {
    return sendJson(res, 422, {
      error:
        "Please complete all required fields and accept the privacy notice.",
    })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return sendJson(res, 422, { error: "Enter a valid email address." })
  }

  const apiKey = process.env.RESEND_API_KEY
  const businessEmail = process.env.BUSINESS_EMAIL
  const fromEmail = process.env.ENQUIRY_FROM_EMAIL

  if (!apiKey || !businessEmail || !fromEmail) {
    return sendJson(res, 503, {
      error:
        "Email delivery is not configured yet. Your information has not been sent. Please contact the business directly.",
    })
  }

  const details = [
    `Form: ${clean(body.formType, 40) || "Contact"}`,
    `Name: ${fullName}`,
    `Business: ${clean(body.businessName, 120) || "Not supplied"}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Location: ${clean(body.location, 150) || "Not supplied"}`,
    `Enquiry type: ${enquiryType}`,
    `Product: ${clean(body.product, 120) || "Not supplied"}`,
    "",
    message,
  ].join("\n")

  try {
    const delivery = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [businessEmail],
        reply_to: email,
        subject: `D Dynamic Soda enquiry — ${enquiryType}`,
        text: details,
      }),
    })

    if (!delivery.ok) {
      console.error(
        "Enquiry email delivery failed with status",
        delivery.status,
      )
      return sendJson(res, 502, {
        error:
          "Delivery failed. Your details are still in the form; please try again.",
      })
    }

    return sendJson(res, 202, { accepted: true })
  } catch (error) {
    console.error("Enquiry delivery error", error)
    return sendJson(res, 502, {
      error: "Delivery is temporarily unavailable. Please try again.",
    })
  }
}

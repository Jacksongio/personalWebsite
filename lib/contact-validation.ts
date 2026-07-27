export type ContactField = "name" | "email" | "message"
export type ContactFieldErrors = Partial<Record<ContactField, string>>

const FAKE_VALUES = new Set(["qwerty", "asdf", "asdfgh", "fake", "test", "none", "n/a", "123"])
const BLOCKED_EMAIL_DOMAINS = new Set([
  "example.com",
  "test.com",
  "mailinator.com",
  "yopmail.com",
  "tempmail.com",
])

export function validateContactField(field: ContactField, rawValue: string) {
  const value = rawValue.trim()
  const normalized = value.toLowerCase().replace(/\s+/g, "")

  if (!value) {
    return field === "message"
      ? "Blank page energy. Give me a little plot."
      : `No ${field}? Even mysterious strangers need one.`
  }

  if (field === "name") {
    const letters = value.match(/\p{L}/gu) ?? []
    if (letters.length < 2) return "One letter? Give me at least two to work with."
    if (FAKE_VALUES.has(normalized)) return "Your keyboard works. Now try your actual name."
    if (value.length > 80) return "That name needs an editor. Keep it under 80 characters."
  }

  if (field === "email") {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    if (!emailPattern.test(value)) return "That email looks like it took a wrong turn."

    const [localPart, domain] = normalized.split("@")
    if (
      FAKE_VALUES.has(localPart) ||
      BLOCKED_EMAIL_DOMAINS.has(domain) ||
      domain.endsWith(".test") ||
      domain.endsWith(".invalid")
    ) {
      return "That inbox looks imaginary. Try one you actually check."
    }
    if (value.length > 254) return "That email is doing too much. Keep it under 254 characters."
  }

  if (field === "message") {
    if (value.length < 20) return "Give me a little more plot. Twenty characters should do it."
    if (/^(.)\1{9,}$/i.test(normalized) || FAKE_VALUES.has(normalized)) {
      return "Strong keyboard test. Now tell me what you actually have in mind."
    }
    if (value.length > 2000) return "I love context, but 2,000 characters is plenty for round one."
  }

  return ""
}

export function validateContact(values: Record<ContactField, string>) {
  const errors: ContactFieldErrors = {
    name: validateContactField("name", values.name),
    email: validateContactField("email", values.email),
    message: validateContactField("message", values.message),
  }

  for (const field of Object.keys(errors) as ContactField[]) {
    if (!errors[field]) delete errors[field]
  }

  return errors
}

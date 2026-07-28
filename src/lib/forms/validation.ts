/** Adapted from signalworks-modules/forms */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  return EMAIL_RE.test(trimmed);
}

export function normalizePhoneDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function isValidUsPhone(value: string): boolean {
  const digits = normalizePhoneDigits(value);
  return digits.length === 10 || (digits.length === 11 && digits.startsWith("1"));
}

export function formatPhoneDisplay(value: string): string {
  const digits = normalizePhoneDigits(value);
  const ten = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  if (ten.length !== 10) return value;
  return `(${ten.slice(0, 3)}) ${ten.slice(3, 6)}-${ten.slice(6)}`;
}

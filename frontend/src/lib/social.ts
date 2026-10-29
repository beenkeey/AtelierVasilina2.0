import { catalog } from "./site-data";

function telegramRaw(): string {
  return (process.env.NEXT_PUBLIC_TELEGRAM || catalog.site.telegram).trim();
}

/** База чата: и username, и полная ссылка https://t.me/... */
export function telegramChatUrl(): string {
  const raw = telegramRaw();
  if (/^https?:\/\//i.test(raw)) {
    const url = new URL(raw);
    return `${url.origin}${url.pathname}`;
  }
  const user = raw.replace(/^@/, "");
  return `https://t.me/${user}`;
}

export function instagramProfileUrl(raw?: string): string | null {
  const value = raw?.trim();
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) {
    const url = new URL(value);
    url.search = "";
    return url.toString();
  }
  const user = value.replace(/^@/, "").replace(/^instagram\.com\//i, "");
  return `https://www.instagram.com/${user}`;
}

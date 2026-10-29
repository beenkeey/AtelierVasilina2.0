import type { CatalogWork } from "./catalog";
import { telegramChatUrl } from "./social";

export function telegramOrderUrl(work?: Pick<CatalogWork, "id" | "title">): string {
  const text = work
    ? `Здравствуйте! Хочу заказать «${work.title}» (№${work.id}).`
    : "Здравствуйте! Хочу обсудить заказ.";
  const base = telegramChatUrl();
  const join = base.includes("?") ? "&" : "?";
  return `${base}${join}text=${encodeURIComponent(text)}`;
}

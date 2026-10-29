import type { PaintingMedium, WorkCategory } from "./catalog";

export const CATEGORIES: { id: "all" | WorkCategory; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "painting", label: "Картины" },
  { id: "wearable", label: "Одежда" },
  { id: "embroidery", label: "Вышивка" },
  { id: "custom", label: "Кастом" },
];

export const PAINTING_MEDIA: { id: PaintingMedium; label: string }[] = [
  { id: "acrylic", label: "Акрил" },
  { id: "pastel", label: "Пастель" },
  { id: "marker", label: "Фломастер / маркер" },
  { id: "ink", label: "Ручка / тушь" },
  { id: "pencil", label: "Карандаш" },
  { id: "mixed", label: "Смешанная техника" },
];

export function categoryLabel(id: WorkCategory | string): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

export function mediumLabel(id?: PaintingMedium): string | null {
  if (!id) return null;
  return PAINTING_MEDIA.find((m) => m.id === id)?.label ?? id;
}

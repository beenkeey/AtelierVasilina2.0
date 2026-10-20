export const CATEGORIES = [
  { id: "all", label: "Все работы" },
  { id: "embroidery", label: "Вышивка" },
  { id: "paint", label: "Роспись" },
  { id: "custom", label: "Кастом" },
  { id: "other", label: "Другое" },
] as const;

export function categoryLabel(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

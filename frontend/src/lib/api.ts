export type Work = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number | null;
  image_url: string;
  featured: boolean;
  sort_order: number;
  created_at: string;
};

export type OrderPayload = {
  customer_name: string;
  contact: string;
  message: string;
  work_id?: number | null;
};

const base =
  typeof window === "undefined"
    ? (process.env.API_URL ?? "http://127.0.0.1:8000")
    : "";

export async function fetchWorks(params?: {
  category?: string;
  featured_only?: boolean;
}): Promise<Work[]> {
  const q = new URLSearchParams();
  if (params?.category) q.set("category", params.category);
  if (params?.featured_only) q.set("featured_only", "true");
  const suffix = q.toString() ? `?${q}` : "";
  const res = await fetch(`${base}/api/works${suffix}`, { next: { revalidate: 30 } });
  if (!res.ok) throw new Error("Не удалось загрузить работы");
  return res.json();
}

export async function submitOrder(payload: OrderPayload): Promise<void> {
  const res = await fetch(`${base}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail ?? "Не удалось отправить заявку");
  }
}

export function workImageSrc(imageUrl: string): string {
  if (imageUrl.startsWith("http")) return imageUrl;
  return imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
}

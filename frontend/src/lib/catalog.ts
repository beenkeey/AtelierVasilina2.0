export type WorkCategory =
  | "painting"
  | "embroidery"
  | "wearable"
  | "custom";

export type PaintingMedium =
  | "acrylic"
  | "pastel"
  | "marker"
  | "ink"
  | "pencil"
  | "mixed";

export type CatalogWork = {
  id: string;
  title: string;
  description: string;
  category: WorkCategory;
  medium?: PaintingMedium;
  price: number | null;
  featured: boolean;
  image: string;
  available: boolean;
};

export type Catalog = {
  site: {
    name: string;
    tagline: string;
    telegram: string;
    instagram?: string;
  };
  works: CatalogWork[];
};

export function workImagePath(image: string, basePath = ""): string {
  if (image.startsWith("http")) return image;
  const path = image.startsWith("/") ? image : `/${image}`;
  return `${basePath}${path}`;
}

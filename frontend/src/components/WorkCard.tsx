"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { CatalogWork } from "@/lib/catalog";
import { categoryLabel, mediumLabel } from "@/lib/categories";
import { workImagePath } from "@/lib/catalog";

type Props = {
  work: CatalogWork;
  index: number;
  basePath?: string;
  onSelect: (work: CatalogWork) => void;
};

export function WorkCard({ work, index, basePath = "", onSelect }: Props) {
  return (
    <motion.button
      type="button"
      layout
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: (index % 6) * 0.06, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      onClick={() => onSelect(work)}
      className="group w-full text-left"
    >
      <div className="product-stage relative aspect-[4/5] overflow-hidden rounded-3xl border border-snow/10 shadow-md shadow-black/40 transition group-hover:shadow-xl group-hover:shadow-wine/20">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
        <Image
          src={workImagePath(work.image, basePath)}
          alt={work.title}
          fill
          className="object-contain p-2 transition duration-500 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
        {!work.available && (
          <span className="absolute right-4 top-4 rounded-full bg-black/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-snow">
            Продано
          </span>
        )}
        {work.featured && work.available && (
          <span className="absolute left-4 top-4 rounded-full bg-wine/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-snow backdrop-blur">
            В витрине
          </span>
        )}
      </div>
      <div className="mt-4 px-1">
        <p className="text-[11px] font-medium uppercase tracking-widest text-sage">
          {categoryLabel(work.category)}
          {mediumLabel(work.medium) ? ` · ${mediumLabel(work.medium)}` : ""}
        </p>
        <h3 className="mt-1 font-serif text-xl text-espresso">{work.title}</h3>
        {work.price != null && (
          <p className="mt-1 text-sm text-espresso/60">{work.price.toLocaleString("ru-RU")} ₽</p>
        )}
      </div>
    </motion.button>
  );
}

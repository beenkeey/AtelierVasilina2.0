"use client";

import { motion } from "framer-motion";
import type { Work } from "@/lib/api";
import { categoryLabel } from "@/lib/categories";
import { workImageSrc } from "@/lib/api";
import Image from "next/image";

type Props = {
  work: Work;
  index: number;
  onSelect: (work: Work) => void;
};

export function WorkCard({ work, index, onSelect }: Props) {
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
      <div className="product-stage relative aspect-[4/5] overflow-hidden rounded-3xl border border-espresso/5 shadow-md shadow-espresso/5 transition group-hover:shadow-xl group-hover:shadow-rose/10">
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/10 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
        <Image
          src={workImageSrc(work.image_url)}
          alt={work.title}
          fill
          className="object-contain p-6 transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
        {work.featured && (
          <span className="absolute left-4 top-4 rounded-full bg-cream/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-rose backdrop-blur">
            Избранное
          </span>
        )}
      </div>
      <div className="mt-4 px-1">
        <p className="text-[11px] font-medium uppercase tracking-widest text-sage">
          {categoryLabel(work.category)}
        </p>
        <h3 className="mt-1 font-serif text-xl text-espresso">{work.title}</h3>
        {work.price != null && (
          <p className="mt-1 text-sm text-espresso/60">от {work.price.toLocaleString("ru-RU")} ₽</p>
        )}
      </div>
    </motion.button>
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import type { CatalogWork } from "@/lib/catalog";
import { CATEGORIES } from "@/lib/categories";
import { WorkCard } from "./WorkCard";
import { WorkModal } from "./WorkModal";

type Props = {
  works: CatalogWork[];
  basePath?: string;
};

export function Gallery({ works, basePath = "" }: Props) {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]["id"]>("all");
  const [selected, setSelected] = useState<CatalogWork | null>(null);

  const filtered = useMemo(() => {
    if (category === "all") return works;
    return works.filter((w) => w.category === category);
  }, [works, category]);

  return (
    <section id="works" className="scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-rose">Витрина</p>
          <h2 className="mt-3 font-serif text-4xl text-espresso md:text-5xl">Работы в наличии и на заказ</h2>
          <p className="mt-4 text-espresso/65">
            Картины на рамах, одежда с росписью и вышивкой. Нажми на карточку — откроется описание и
            кнопка заказа в Telegram.
          </p>
        </motion.div>

        <div className="mt-10 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                category === cat.id
                  ? "bg-wine text-snow shadow-md shadow-wine/25"
                  : "bg-charcoal text-espresso/70 ring-1 ring-snow/10 hover:bg-slate/80 hover:text-espresso"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <motion.div layout className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((work, index) => (
              <WorkCard
                key={work.id}
                work={work}
                index={index}
                basePath={basePath}
                onSelect={setSelected}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <p className="mt-16 text-center text-espresso/50">
            В этой категории пока пусто — загляни позже или напиши в Telegram.
          </p>
        )}
      </div>

      <WorkModal work={selected} basePath={basePath} onClose={() => setSelected(null)} />
    </section>
  );
}

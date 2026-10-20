"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import type { Work } from "@/lib/api";
import { CATEGORIES } from "@/lib/categories";
import { WorkCard } from "./WorkCard";
import { WorkModal } from "./WorkModal";

type Props = {
  works: Work[];
};

export function Gallery({ works }: Props) {
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState<Work | null>(null);

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
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-rose">Портфолио</p>
          <h2 className="mt-3 font-serif text-4xl text-espresso md:text-5xl">Готовые работы</h2>
          <p className="mt-4 text-espresso/65">
            Нажми на карточку, чтобы рассмотреть детали и отправить заявку на похожий заказ.
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
                  ? "bg-espresso text-cream shadow-md"
                  : "bg-white/60 text-espresso/70 hover:bg-cream-deep"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <motion.div layout className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((work, index) => (
              <WorkCard key={work.id} work={work} index={index} onSelect={setSelected} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <p className="mt-16 text-center text-espresso/50">
            В этой категории пока нет работ — скоро добавим новинки.
          </p>
        )}
      </div>

      <WorkModal work={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";
import type { CatalogWork } from "@/lib/catalog";
import { categoryLabel, mediumLabel } from "@/lib/categories";
import { workImagePath } from "@/lib/catalog";
import { telegramOrderUrl } from "@/lib/telegram";

type Props = {
  work: CatalogWork | null;
  basePath?: string;
  onClose: () => void;
};

export function WorkModal({ work, basePath = "", onClose }: Props) {
  useEffect(() => {
    if (!work) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [work, onClose]);

  const orderUrl = work ? telegramOrderUrl(work) : "#";

  return (
    <AnimatePresence>
      {work && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Закрыть"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl border border-snow/10 bg-charcoal shadow-2xl shadow-black/60 sm:rounded-3xl md:flex-row"
          >
            <div className="product-stage relative h-72 shrink-0 md:h-auto md:min-h-[420px] md:w-1/2">
              <Image
                src={workImagePath(work.image, basePath)}
                alt={work.title}
                fill
                className="object-contain p-8"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="flex flex-1 flex-col p-6 md:p-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-sage">
                {categoryLabel(work.category)}
                {mediumLabel(work.medium) ? ` · ${mediumLabel(work.medium)}` : ""}
              </p>
              <h3 className="mt-2 font-serif text-3xl text-espresso">{work.title}</h3>
              {work.price != null && (
                <p className="mt-2 text-lg text-rose">
                  {work.available ? "" : "Продано · "}
                  {work.price.toLocaleString("ru-RU")} ₽
                </p>
              )}
              {work.description && (
                <p className="mt-4 flex-1 text-sm leading-relaxed text-espresso/70">
                  {work.description}
                </p>
              )}
              <div className="mt-8 flex flex-wrap gap-3">
                {work.available ? (
                  <a
                    href={orderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-[#2AABEE] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#229ED9]"
                  >
                    Заказать в Telegram
                  </a>
                ) : (
                  <a
                    href={telegramOrderUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-wine px-6 py-3 text-sm font-medium text-snow transition hover:bg-rose"
                  >
                    Похожее на заказ
                  </a>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-snow/15 px-6 py-3 text-sm text-espresso/70"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

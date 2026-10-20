"use client";

import { motion } from "framer-motion";
import type { Work } from "@/lib/api";
import { workImageSrc } from "@/lib/api";
import Image from "next/image";

type Props = {
  featured: Work[];
};

export function Hero({ featured }: Props) {
  const items = featured.slice(0, 3);

  return (
    <section className="relative min-h-[92vh] overflow-hidden pt-28 pb-16 md:pt-32">
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-rose-light/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-96 w-96 rounded-full bg-sage/25 blur-3xl" />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-2 md:px-8">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-rose"
          >
            Ручная работа · Роспись · Вышивка
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="font-serif text-5xl leading-[1.05] text-espresso md:text-7xl"
          >
            Вещи, которые
            <br />
            <span className="italic text-rose">живут с тобой</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="mt-6 max-w-md text-base leading-relaxed text-espresso/70 md:text-lg"
          >
            Авторский кастом: футболки, худи и аксессуары с росписью и вышивкой. Каждая
            работа — единственная в своём роде.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <a
              href="#works"
              className="rounded-full bg-espresso px-7 py-3.5 text-sm font-medium text-cream shadow-lg shadow-espresso/15 transition hover:-translate-y-0.5 hover:bg-rose"
            >
              Смотреть работы
            </a>
            <a
              href="#order"
              className="rounded-full border border-espresso/15 bg-white/40 px-7 py-3.5 text-sm font-medium text-espresso backdrop-blur transition hover:border-rose/40 hover:text-rose"
            >
              Обсудить заказ
            </a>
          </motion.div>
        </div>

        <div className="relative mx-auto h-[420px] w-full max-w-md md:h-[520px] md:max-w-none">
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="product-stage flex h-full items-center justify-center rounded-[2rem] border border-espresso/5"
            >
              <p className="max-w-xs text-center text-sm text-espresso/50">
                Загрузите первые работы в админке — они появятся здесь как «живые» карточки
                без фона.
              </p>
            </motion.div>
          ) : (
            items.map((work, i) => (
              <motion.div
                key={work.id}
                initial={{ opacity: 0, y: 40, rotate: -4 + i * 4 }}
                animate={{ opacity: 1, y: 0, rotate: -6 + i * 6 }}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className={`product-stage absolute overflow-hidden rounded-[2rem] border border-white/60 shadow-2xl shadow-espresso/10 ${
                  i === 0
                    ? "left-0 top-8 z-10 h-64 w-48 animate-float md:h-72 md:w-56"
                    : i === 1
                      ? "right-0 top-0 z-20 h-72 w-52 animate-float-delayed md:h-80 md:w-60"
                      : "bottom-0 left-1/4 z-0 h-56 w-44 opacity-90 md:h-64 md:w-52"
                }`}
              >
                <div className="relative h-full w-full p-4">
                  <Image
                    src={workImageSrc(work.image_url)}
                    alt={work.title}
                    fill
                    className="object-contain drop-shadow-xl"
                    sizes="(max-width: 768px) 40vw, 240px"
                    priority={i === 0}
                  />
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

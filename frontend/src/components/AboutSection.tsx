"use client";

import { motion } from "framer-motion";

type Props = {
  siteName: string;
};

export function AboutSection({ siteName }: Props) {
  return (
    <section id="about" className="scroll-mt-24 border-y border-snow/10 bg-charcoal-deep/80 py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-2 md:px-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-rose">О мастере</p>
          <h2 className="mt-3 font-serif text-4xl leading-tight text-espresso md:text-5xl">
            {siteName}
          </h2>
          <p className="mt-6 leading-relaxed text-espresso/70">
            Рисую картины на рамах — акрил, пастель, фломастеры, ручки, карандаши и смешанные
            техники. Параллельно кастомлю одежду: роспись, вышивка, авторские сюжеты под тебя.
          </p>
          <p className="mt-4 leading-relaxed text-espresso/70">
            Каждая работа уникальна. Перед заказом обсудим размер, материалы и срок — всё через
            Telegram, без лишней бюрократии.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative aspect-square overflow-hidden rounded-[2rem] border border-snow/10 bg-gradient-to-br from-wine/25 via-charcoal to-slate/40 p-10"
        >
          <div className="relative flex h-full flex-col justify-end">
            <p className="font-serif text-3xl italic text-espresso/80">
              &ldquo;Картина на стене или принт на худи — одна рука, один характер&rdquo;
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

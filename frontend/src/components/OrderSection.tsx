"use client";

import { motion } from "framer-motion";
import { telegramOrderUrl } from "@/lib/telegram";

type Props = {
  tagline?: string;
};

export function OrderSection({ tagline }: Props) {
  const tgUrl = telegramOrderUrl();

  return (
    <section id="order" className="scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <motion.div
          className="rounded-[2rem] border border-snow/10 bg-gradient-to-b from-charcoal to-charcoal-deep px-6 py-14 text-center shadow-xl shadow-black/40 md:px-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-rose">Заказ</p>
          <h2 className="mt-3 font-serif text-4xl text-espresso md:text-5xl">Напиши в Telegram</h2>
          <p className="mx-auto mt-4 max-w-lg text-espresso/65">
            {tagline ??
              "Выбери работу в витрине и нажми «Заказать» — откроется чат с готовым текстом. Или напиши с нуля: опиши идею, размер, сроки."}
          </p>
          <a
            href={tgUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#2AABEE] px-8 py-4 text-sm font-medium text-white shadow-lg shadow-[#2AABEE]/25 transition hover:-translate-y-0.5 hover:bg-[#229ED9]"
          >
            Открыть Telegram
          </a>
          <p className="mt-6 text-xs text-espresso/45">
            Удобно из Instagram и с телефона — ссылка откроет приложение, если оно установлено.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

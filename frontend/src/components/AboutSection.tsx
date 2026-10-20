"use client";

import { motion } from "framer-motion";

export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-24 border-y border-espresso/5 bg-cream-deep/30 py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-2 md:px-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-rose">О мастере</p>
          <h2 className="mt-3 font-serif text-4xl leading-tight text-espresso md:text-5xl">
            Vasilina
          </h2>
          <p className="mt-6 leading-relaxed text-espresso/70">
            Рисую, вышиваю и превращаю обычные вещи в маленькие произведения. Люблю нежные
            сюжеты, текстуры ниток и когда на футболке оживает твоя история.
          </p>
          <p className="mt-4 leading-relaxed text-espresso/70">
            Каждый заказ — диалог: подберём материалы, согласуем эскиз и доведём до результата,
            которым захочется хвастаться.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative aspect-square overflow-hidden rounded-[2rem] bg-gradient-to-br from-rose-light/40 via-cream to-sage/20 p-10"
        >
          <div className="absolute inset-0 opacity-30">
            <svg className="h-full w-full" viewBox="0 0 400 400" aria-hidden>
              <motion.path
                d="M40 200 Q120 80 200 200 T360 200"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-rose"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              <motion.path
                d="M60 260 Q180 140 340 280"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-espresso/30"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2.2, delay: 0.2, ease: "easeInOut" }}
              />
            </svg>
          </div>
          <div className="relative flex h-full flex-col justify-end">
            <p className="font-serif text-3xl italic text-espresso/80">&ldquo;Швы, краска, характер&rdquo;</p>
            <p className="mt-2 text-sm text-espresso/50">atelier · since 2025</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

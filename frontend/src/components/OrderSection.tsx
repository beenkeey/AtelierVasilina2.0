"use client";

import { motion } from "framer-motion";
import { FormEvent, useEffect, useState } from "react";
import { submitOrder } from "@/lib/api";

export function OrderSection() {
  const [workId, setWorkId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    const hash = window.location.hash;
    const match = hash.match(/work=(\d+)/);
    if (match) setWorkId(Number(match[1]));
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorText("");
    try {
      await submitOrder({
        customer_name: name,
        contact,
        message,
        work_id: workId,
      });
      setStatus("ok");
      setName("");
      setContact("");
      setMessage("");
      setWorkId(null);
    } catch (err) {
      setStatus("error");
      setErrorText(err instanceof Error ? err.message : "Ошибка отправки");
    }
  }

  return (
    <section id="order" className="scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-espresso/5 bg-gradient-to-br from-cream-deep/80 via-cream to-white shadow-xl shadow-espresso/5">
          <div className="grid md:grid-cols-2">
            <div className="p-8 md:p-12">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-rose">Заказ</p>
              <h2 className="mt-3 font-serif text-4xl text-espresso">Расскажи о своей идее</h2>
              <p className="mt-4 text-sm leading-relaxed text-espresso/65 md:text-base">
                Опиши, что хочешь: размер, цвет вещи, сюжет, сроки. Ответим в Telegram или
                WhatsApp — как удобнее.
              </p>
              <ul className="mt-8 space-y-3 text-sm text-espresso/70">
                <li>· Индивидуальный эскиз перед работой</li>
                <li>· Роспись, вышивка, апpliqué и комбинации</li>
                <li>· Можно принести свою вещь или заказать базу у нас</li>
              </ul>
            </div>

            <form onSubmit={onSubmit} className="space-y-4 bg-white/50 p-8 backdrop-blur md:p-12">
              {workId != null && (
                <p className="rounded-xl bg-rose/10 px-4 py-2 text-xs text-rose">
                  Заявка привязана к работе #{workId}
                  <button
                    type="button"
                    className="ml-2 underline"
                    onClick={() => setWorkId(null)}
                  >
                    отменить
                  </button>
                </p>
              )}
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-espresso/50">
                  Имя
                </label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-espresso/10 bg-cream/50 px-4 py-3 text-sm outline-none ring-rose/30 focus:ring-2"
                  placeholder="Как к тебе обращаться"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-espresso/50">
                  Telegram / телефон
                </label>
                <input
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full rounded-xl border border-espresso/10 bg-cream/50 px-4 py-3 text-sm outline-none ring-rose/30 focus:ring-2"
                  placeholder="@username или +7..."
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-espresso/50">
                  Описание заказа
                </label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full resize-none rounded-xl border border-espresso/10 bg-cream/50 px-4 py-3 text-sm outline-none ring-rose/30 focus:ring-2"
                  placeholder="Что хочешь, размер, цвет, референсы..."
                />
              </div>
              <motion.button
                type="submit"
                disabled={status === "loading"}
                whileTap={{ scale: 0.98 }}
                className="w-full rounded-full bg-espresso py-3.5 text-sm font-medium text-cream transition hover:bg-rose disabled:opacity-60"
              >
                {status === "loading" ? "Отправляем..." : "Отправить заявку"}
              </motion.button>
              {status === "ok" && (
                <p className="text-center text-sm text-sage">Спасибо! Скоро свяжемся с тобой.</p>
              )}
              {status === "error" && (
                <p className="text-center text-sm text-red-600">{errorText}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

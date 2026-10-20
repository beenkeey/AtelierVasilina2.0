"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import type { Work } from "@/lib/api";
import { workImageSrc } from "@/lib/api";
import { CATEGORIES } from "@/lib/categories";

const STORAGE_KEY = "vasilina_admin_pw";

type Order = {
  id: number;
  customer_name: string;
  contact: string;
  message: string;
  work_id: number | null;
  status: string;
  created_at: string;
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [works, setWorks] = useState<Work[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("custom");
  const [price, setPrice] = useState("");
  const [featured, setFeatured] = useState(false);
  const [removeBg, setRemoveBg] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      setPassword(saved);
      setAuthed(true);
    }
  }, []);

  const loadWorks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/works");
      const data = (await res.json()) as Work[];
      setWorks(data);
      const pw = sessionStorage.getItem(STORAGE_KEY);
      if (pw) {
        const oRes = await fetch(`/api/admin/orders?admin_password=${encodeURIComponent(pw)}`);
        if (oRes.ok) setOrders(await oRes.json());
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) loadWorks();
  }, [authed, loadWorks]);

  function login(e: FormEvent) {
    e.preventDefault();
    sessionStorage.setItem(STORAGE_KEY, password);
    setAuthed(true);
  }

  function logout() {
    sessionStorage.removeItem(STORAGE_KEY);
    setAuthed(false);
    setPassword("");
  }

  function onFileChange(f: File | null) {
    setFile(f);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  async function uploadWork(e: FormEvent) {
    e.preventDefault();
    if (!file) {
      setMessage("Выберите фото");
      return;
    }
    setUploading(true);
    setMessage("");
    const form = new FormData();
    form.append("admin_password", password);
    form.append("title", title);
    form.append("description", description);
    form.append("category", category);
    if (price) form.append("price", price);
    form.append("featured", String(featured));
    form.append("remove_background", String(removeBg));
    form.append("image", file);

    try {
      const res = await fetch("/api/admin/works", { method: "POST", body: form });
      if (res.status === 401) {
        setMessage("Неверный пароль");
        logout();
        return;
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail ?? "Ошибка загрузки");
      }
      setMessage("Работа добавлена — фон обработан и сохранён как PNG.");
      setTitle("");
      setDescription("");
      setPrice("");
      setFeatured(false);
      onFileChange(null);
      await loadWorks();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setUploading(false);
    }
  }

  async function deleteWork(id: number) {
    if (!confirm("Удалить работу?")) return;
    const res = await fetch(`/api/admin/works/${id}?admin_password=${encodeURIComponent(password)}`, {
      method: "DELETE",
    });
    if (res.ok) loadWorks();
  }

  if (!authed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream px-5">
        <form
          onSubmit={login}
          className="w-full max-w-sm rounded-3xl border border-espresso/10 bg-white p-8 shadow-xl"
        >
          <h1 className="font-serif text-2xl text-espresso">Админка</h1>
          <p className="mt-2 text-sm text-espresso/60">Пароль задаётся в backend/.env</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-6 w-full rounded-xl border border-espresso/10 px-4 py-3 text-sm"
            placeholder="Пароль"
            required
          />
          <button
            type="submit"
            className="mt-4 w-full rounded-full bg-espresso py-3 text-sm text-cream hover:bg-rose"
          >
            Войти
          </button>
          <Link href="/" className="mt-4 block text-center text-xs text-espresso/50 hover:text-rose">
            ← На сайт
          </Link>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream py-10">
      <div className="mx-auto max-w-5xl px-5">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl text-espresso">Управление работами</h1>
            <p className="mt-1 text-sm text-espresso/60">
              Загрузи фото — сервер уберёт фон (rembg) и выложит вещь на сайт.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/" className="text-sm text-rose hover:underline">
              На сайт
            </Link>
            <button type="button" onClick={logout} className="text-sm text-espresso/50 hover:text-espresso">
              Выйти
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={uploadWork}
            className="space-y-4 rounded-3xl border border-espresso/10 bg-white p-6 shadow-sm"
          >
            <h2 className="font-medium text-espresso">Новая работа</h2>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-espresso/15 bg-cream/50 py-10 transition hover:border-rose/40">
              {preview ? (
                <div className="product-stage relative h-48 w-full max-w-xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="" className="h-full w-full object-contain p-4" />
                </div>
              ) : (
                <span className="text-sm text-espresso/50">Нажми, чтобы выбрать фото</span>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
              />
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={removeBg}
                onChange={(e) => setRemoveBg(e.target.checked)}
              />
              Убрать фон автоматически
            </label>

            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Название"
              className="w-full rounded-xl border border-espresso/10 px-4 py-3 text-sm"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Описание"
              rows={3}
              className="w-full rounded-xl border border-espresso/10 px-4 py-3 text-sm"
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-xl border border-espresso/10 px-4 py-3 text-sm"
              >
                {CATEGORIES.filter((c) => c.id !== "all").map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Цена, ₽"
                className="rounded-xl border border-espresso/10 px-4 py-3 text-sm"
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
              />
              Показать в шапке (избранное)
            </label>

            <button
              type="submit"
              disabled={uploading}
              className="w-full rounded-full bg-espresso py-3 text-sm font-medium text-cream hover:bg-rose disabled:opacity-50"
            >
              {uploading ? "Обрабатываем фото… (может занять минуту)" : "Загрузить на сайт"}
            </button>
            {message && <p className="text-center text-sm text-sage">{message}</p>}
          </motion.form>

          <div className="rounded-3xl border border-espresso/10 bg-white p-6 shadow-sm">
            <h2 className="font-medium text-espresso">В каталоге ({works.length})</h2>
            {loading ? (
              <p className="mt-6 text-sm text-espresso/50">Загрузка…</p>
            ) : (
              <ul className="mt-4 max-h-[640px] space-y-4 overflow-y-auto pr-1">
                {works.map((w) => (
                  <li
                    key={w.id}
                    className="flex items-center gap-4 rounded-2xl border border-espresso/5 p-3"
                  >
                    <div className="product-stage relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={workImageSrc(w.image_url)}
                        alt=""
                        fill
                        className="object-contain p-1"
                        sizes="64px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-sm">{w.title}</p>
                      <p className="text-xs text-espresso/50">#{w.id}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteWork(w.id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Удалить
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {orders.length > 0 && (
          <div className="mt-10 rounded-3xl border border-espresso/10 bg-white p-6 shadow-sm">
            <h2 className="font-medium text-espresso">Заявки ({orders.length})</h2>
            <ul className="mt-4 space-y-4">
              {orders.map((o) => (
                <li key={o.id} className="rounded-2xl border border-espresso/5 p-4 text-sm">
                  <p className="font-medium">
                    {o.customer_name} · {o.contact}
                  </p>
                  <p className="mt-2 text-espresso/70">{o.message}</p>
                  {o.work_id != null && (
                    <p className="mt-1 text-xs text-rose">Работа #{o.work_id}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}

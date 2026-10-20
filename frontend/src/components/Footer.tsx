export function Footer() {
  return (
    <footer className="border-t border-espresso/5 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 text-center text-sm text-espresso/50 md:flex-row md:px-8 md:text-left">
        <p>
          © {new Date().getFullYear()} Atelier Vasilina — handmade with care
        </p>
        <a href="/admin" className="transition hover:text-rose">
          Админка
        </a>
      </div>
    </footer>
  );
}

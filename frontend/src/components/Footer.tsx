import { instagramProfileUrl } from "@/lib/social";
import { telegramOrderUrl } from "@/lib/telegram";

type Props = {
  siteName: string;
  instagram?: string;
};

export function Footer({ siteName, instagram }: Props) {
  const igUrl = instagramProfileUrl(instagram);

  return (
    <footer className="border-t border-snow/10 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 text-center text-sm text-espresso/50 md:flex-row md:px-8 md:text-left">
        <p>
          © {new Date().getFullYear()} {siteName}
        </p>
        <div className="flex gap-6">
          {igUrl && (
            <a href={igUrl} target="_blank" rel="noopener noreferrer" className="transition hover:text-rose">
              Instagram
            </a>
          )}
          <a href={telegramOrderUrl()} target="_blank" rel="noopener noreferrer" className="transition hover:text-rose">
            Telegram
          </a>
        </div>
      </div>
    </footer>
  );
}

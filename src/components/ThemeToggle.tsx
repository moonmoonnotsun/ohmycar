"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import type { Locale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { getTheme, persistTheme, type Theme } from "@/lib/theme";
import { track } from "@/lib/analytics";

export function ThemeToggle({ locale }: { locale: Locale }) {
  const copy = t(locale);
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(getTheme());
  }, []);

  const active: Theme = theme ?? "dark";

  function toggle() {
    const next: Theme = active === "dark" ? "light" : "dark";
    persistTheme(next);
    setTheme(next);
    track("Theme Switched", {
      locale,
      from_theme: active,
      to_theme: next,
    });
  }

  const label = active === "dark" ? copy.themeToLight : copy.themeToDark;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="tap inline-flex size-[2.75rem] items-center justify-center rounded-full border border-[var(--line)] bg-[var(--card)] text-[var(--ink)]"
    >
      <span className="relative grid size-4 place-items-center" aria-hidden>
        <Sun
          className={`absolute size-4 transition-opacity duration-150 ${
            active === "dark" ? "opacity-100" : "opacity-0"
          }`}
          strokeWidth={1.85}
        />
        <Moon
          className={`absolute size-4 transition-opacity duration-150 ${
            active === "light" ? "opacity-100" : "opacity-0"
          }`}
          strokeWidth={1.85}
        />
      </span>
    </button>
  );
}

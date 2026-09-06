"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { stubChatReply } from "@/lib/chat";

type ChatContext = {
  locale: Locale;
  chassisSlug?: string;
  variantSlug?: string;
};

type Msg = { role: "user" | "assistant"; content: string };

function contextFromPath(locale: Locale, pathname: string): ChatContext {
  const parts = pathname.split("/").filter(Boolean);
  const chassisSlug = parts[1] === "bmw" && parts[2] ? parts[2] : undefined;
  const variantSlug = chassisSlug && parts[3] ? parts[3] : undefined;
  return { locale, chassisSlug, variantSlug };
}

function labelFromPath(ctx: ChatContext): string {
  if (ctx.variantSlug) {
    const [year, model, ...engine] = ctx.variantSlug.split("-");
    return [year, model?.toUpperCase(), engine.join("-").toUpperCase()].filter(Boolean).join(" ");
  }
  if (ctx.chassisSlug) return ctx.chassisSlug.toUpperCase();
  return "OhMyCar";
}

function chipsFor(ctx: ChatContext, copy: ReturnType<typeof t>): string[] {
  if (ctx.variantSlug) return [copy.askChipBuy, copy.askChipFault, copy.askChipFix, copy.askChipScore];
  if (ctx.chassisSlug) return [copy.askChipBest, copy.askChipDiesel, copy.askChipRust, copy.askChipScore];
  return [copy.askChipDiesel, copy.askChip330i, copy.askChipScore];
}

export function AskChat({ locale }: { locale: Locale }) {
  const copy = t(locale);
  const pathname = usePathname() || `/${locale}`;
  const ctx = contextFromPath(locale, pathname);
  const ctxKey = `${ctx.chassisSlug ?? ""}/${ctx.variantSlug ?? ""}`;
  const label = labelFromPath(ctx);
  const onVariant = Boolean(ctx.variantSlug);

  const dialog = useRef<HTMLDialogElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);

  useEffect(() => {
    setMessages([]);
    setDraft("");
  }, [ctxKey]);

  useEffect(() => {
    const node = scroller.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [messages, pending, open]);

  function show() {
    dialog.current?.showModal();
    setOpen(true);
    window.setTimeout(() => input.current?.focus(), 50);
  }

  function hide() {
    dialog.current?.close();
    setOpen(false);
  }

  async function send(text: string) {
    const content = text.trim();
    if (!content || pending) return;
    setDraft("");
    setMessages((prev) => [...prev, { role: "user", content }]);
    setPending(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const reply = stubChatReply({
        locale,
        message: content,
        chassisSlug: ctx.chassisSlug,
        variantSlug: ctx.variantSlug,
      });
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: copy.askError }]);
    } finally {
      setPending(false);
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void send(draft);
  }

  function onKey(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void send(draft);
    }
  }

  const suggestions = chipsFor(ctx, copy);

  return (
    <>
      <button
        type="button"
        onClick={show}
        className={`ask-fab ${onVariant ? "ask-fab-buybar" : ""} ${open ? "hidden" : ""}`}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className="ask-fab-glow" aria-hidden />
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
          <path
            d="M5 7.5A2.5 2.5 0 0 1 7.5 5h9A2.5 2.5 0 0 1 19 7.5v6A2.5 2.5 0 0 1 16.5 16H10l-4 3v-3.2A2.5 2.5 0 0 1 5 13.5z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path d="M9 10h6M9 13h3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <span className="min-w-0 truncate">
          {ctx.chassisSlug || ctx.variantSlug ? `${copy.askFab} ${label}` : copy.askFab}
        </span>
      </button>

      <dialog
        ref={dialog}
        className="ask-sheet"
        aria-label={copy.askTitle}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === dialog.current) hide();
        }}
      >
        <div className="ask-sheet-head">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">{copy.askKicker}</p>
            <h2 className="mt-0.5 truncate text-base font-semibold">{label}</h2>
            <p className="mt-0.5 text-[11px] text-[var(--muted)]">{copy.askHint}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {messages.length > 0 ? (
              <button
                type="button"
                onClick={() => setMessages([])}
                className="h-10 rounded-full border border-[var(--line)] px-3 text-xs font-semibold text-[var(--muted)]"
              >
                {copy.askNew}
              </button>
            ) : null}
            <button
              type="button"
              onClick={hide}
              className="grid size-12 place-items-center rounded-full border border-[var(--line)] bg-[var(--wash)]"
              aria-label={copy.askClose}
            >
              <svg viewBox="0 0 24 24" className="block size-5" aria-hidden>
                <path d="M7 7 17 17M17 7 7 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div ref={scroller} className="ask-sheet-body">
          {messages.length === 0 ? (
            <div className="flex flex-col gap-4">
              <p className="text-[15px] leading-7 text-[var(--muted)]">{copy.askEmpty}</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => void send(chip)}
                    className="tap rounded-full border border-[var(--accent)]/40 bg-[var(--mid-bg)] px-3 py-2 text-left text-sm font-medium"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {messages.map((msg, i) => (
                <li
                  key={`${msg.role}-${i}`}
                  className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 text-sm leading-6 ${
                    msg.role === "user"
                      ? "ml-auto bg-[var(--accent)] text-[var(--paper)]"
                      : "bg-[var(--card)] ring-1 ring-[var(--line)]"
                  }`}
                >
                  {msg.content}
                </li>
              ))}
              {pending ? (
                <li className="flex max-w-[92%] items-center gap-1 rounded-2xl bg-[var(--card)] px-3.5 py-3 ring-1 ring-[var(--line)]">
                  <span className="ask-dot" />
                  <span className="ask-dot" />
                  <span className="ask-dot" />
                  <span className="sr-only">{copy.askTyping}</span>
                </li>
              ) : null}
            </ul>
          )}
        </div>

        <form onSubmit={onSubmit} className="ask-sheet-foot">
          <textarea
            ref={input}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={onKey}
            rows={1}
            maxLength={500}
            placeholder={copy.askPlaceholder}
            className="max-h-28 min-h-11 flex-1 resize-none rounded-2xl border border-[var(--line)] bg-[var(--wash)] px-3 py-2.5 text-base outline-none focus:border-[var(--accent)]"
          />
          <button
            type="submit"
            disabled={pending || !draft.trim()}
            className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--accent)] text-[var(--paper)] disabled:opacity-40"
            aria-label={copy.askSend}
          >
            <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
              <path d="M5 12h12M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>
      </dialog>
    </>
  );
}

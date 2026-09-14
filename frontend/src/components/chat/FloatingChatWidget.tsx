"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useAssistantChat } from "@/features/assistant/hooks";
import type { ChatEntry } from "@/features/assistant/types";

function MiniBubble({ entry }: { entry: ChatEntry }) {
  const isUser = entry.role === "user";
  return (
    <div className={"flex " + (isUser ? "justify-end" : "justify-start")}>
      <div
        className={
          "rounded-2xl p-3 text-xs leading-relaxed max-w-[85%] whitespace-pre-wrap " +
          (isUser
            ? "bg-gradient-to-l from-egypt-red-dark to-egypt-red text-white"
            : "bg-white border border-sand-200 text-egypt-black")
        }
      >
        {entry.content}
      </div>
    </div>
  );
}

function MiniSuggestions({
  services,
}: {
  services: NonNullable<ChatEntry["suggested_services"]>;
}) {
  if (!services || services.length === 0) return null;
  return (
    <div className="space-y-1.5 mt-2">
      {services.map((svc) => (
        <Link
          key={svc.id}
          href={`/services/${svc.slug}`}
          className="block bg-sand-50 border border-pharaoh-gold/30 rounded-lg p-2 hover:border-pharaoh-gold transition-colors group"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold text-egypt-black group-hover:text-egypt-red transition-colors line-clamp-1">
              {svc.name}
            </span>
            <span className="text-pharaoh-gold text-sm shrink-0">←</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function FloatingChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const { entries, isLoading, send, clear } = useAssistantChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  const isHidden = pathname === "/assistant";

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [entries, isLoading, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen]);

  if (isHidden) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    send(input);
    setInput("");
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed bottom-20 left-4 z-40 w-[calc(100vw-2rem)] max-w-md sm:w-96 bg-white rounded-2xl shadow-2xl border border-sand-200 flex flex-col overflow-hidden"
          style={{ maxHeight: "min(600px, calc(100vh - 6rem))" }}
        >
          <div className="bg-gradient-to-l from-egypt-red-dark via-egypt-red to-pharaoh-gold-dark text-white px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-xl">
                🤖
              </div>
              <div>
                <div className="font-display font-bold text-sm">مساعد مصر</div>
                <div className="text-[10px] opacity-90">✨ مدعوم بـ Gemini</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={clear}
                disabled={isLoading || entries.length === 1}
                className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors disabled:opacity-40"
                title="محادثة جديدة"
              >
                🗑️
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="إغلاق"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-sand-50 to-white">
            {entries.map((entry) => (
              <div key={entry.id}>
                <MiniBubble entry={entry} />
                {entry.suggested_services && entry.suggested_services.length > 0 && (
                  <MiniSuggestions services={entry.suggested_services} />
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-sand-200 rounded-2xl px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-pharaoh-gold animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-pharaoh-gold animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-pharaoh-gold animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-sand-200 p-3 flex items-end gap-2 bg-white shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اكتب سؤالك..."
              disabled={isLoading}
              className="flex-1 px-3 py-2 rounded-xl border border-sand-300 text-sm focus:outline-none focus:border-pharaoh-gold focus:ring-2 focus:ring-pharaoh-gold/20 disabled:bg-sand-50 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-egypt-red to-egypt-red-dark text-white flex items-center justify-center shadow-sm hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              aria-label="إرسال"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13" />
                  <path d="M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              )}
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className={
          "fixed bottom-4 left-4 z-40 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl transition-all duration-300 " +
          (isOpen
            ? "bg-gradient-to-br from-egypt-red to-egypt-red-dark text-white"
            : "bg-gradient-to-br from-pharaoh-gold to-pharaoh-gold-dark text-white hover:scale-110")
        }
        aria-label={isOpen ? "إغلاق المساعد" : "افتح المساعد"}
      >
        {isOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M6 6l12 12M6 18L18 6" />
          </svg>
        ) : (
          "🤖"
        )}
      </button>
    </>
  );
}
"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { useAssistantChat } from "@/features/assistant/hooks";
import type { ChatEntry } from "@/features/assistant/types";

const QUICK_REPLIES = [
  "بطاقتي ضاعت أعمل إيه؟",
  "عايز أطلع جواز سفر",
  "إيه المستندات المطلوبة لتجديد الرخصة؟",
  "كيف أستخرج شهادة ميلاد؟",
];

function ChatBubble({ entry }: { entry: ChatEntry }) {
  const isUser = entry.role === "user";

  return (
    <div className={"flex " + (isUser ? "justify-end" : "justify-start")}>
      <div className={"flex gap-3 max-w-[85%] " + (isUser ? "flex-row-reverse" : "flex-row")}>
        {/* Avatar */}
        <div
          className={
            "w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 shadow-sm " +
            (isUser
              ? "bg-gradient-to-br from-egypt-red to-egypt-red-dark text-white"
              : "bg-gradient-to-br from-pharaoh-gold to-pharaoh-gold-dark text-white")
          }
        >
          {isUser ? "👤" : "🤖"}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2">
          <div
            className={
              "rounded-2xl p-4 shadow-sm whitespace-pre-wrap text-sm leading-relaxed " +
              (isUser
                ? "bg-gradient-to-l from-egypt-red-dark to-egypt-red text-white"
                : "bg-white border border-sand-200 text-egypt-black")
            }
          >
            {entry.content}
          </div>

          {/* Suggested services */}
          {entry.suggested_services && entry.suggested_services.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] text-gray-500 font-semibold px-1">
                خدمات ذات صلة
              </div>
              {entry.suggested_services.map((svc) => (
                <Link
                  key={svc.id}
                  href={`/services/${svc.slug}`}
                  className="block bg-gradient-to-l from-sand-50 to-white rounded-xl border border-pharaoh-gold/30 p-3 hover:border-pharaoh-gold hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-bold text-sm text-egypt-black group-hover:text-egypt-red transition-colors">
                        {svc.name}
                      </div>
                      {svc.description && (
                        <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                          {svc.description}
                        </div>
                      )}
                    </div>
                    <span className="text-pharaoh-gold text-lg shrink-0 group-hover:-translate-x-1 transition-transform">
                      ←
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Disclaimer */}
          {entry.disclaimer && (
            <div className="flex items-start gap-1.5 text-[10px] text-gray-400 px-2">
              <span>⚠️</span>
              <span>{entry.disclaimer}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pharaoh-gold to-pharaoh-gold-dark flex items-center justify-center text-lg shadow-sm">
          🤖
        </div>
        <div className="bg-white border border-sand-200 rounded-2xl px-5 py-4 shadow-sm">
          <div className="flex gap-1.5 items-center">
            <span className="w-2 h-2 rounded-full bg-pharaoh-gold animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-2 h-2 rounded-full bg-pharaoh-gold animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-2 h-2 rounded-full bg-pharaoh-gold animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AssistantPage() {
  const { entries, isLoading, send, clear } = useAssistantChat();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries, isLoading]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    send(input);
    setInput("");
  };

  const handleQuickReply = (text: string) => {
    if (isLoading) return;
    send(text);
  };

  const showQuickReplies = entries.length === 1;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-sand-50 to-white flex flex-col">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-sand-200">
          <div className="h-1 flex">
            <div className="flex-1 bg-egypt-red" />
            <div className="flex-1 bg-white" />
            <div className="flex-1 bg-black" />
          </div>
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pharaoh-gold to-pharaoh-gold-dark flex items-center justify-center text-3xl shadow-md">
                  🤖
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-display font-extrabold">
                    <span className="bg-gradient-to-l from-egypt-red-dark via-egypt-red to-pharaoh-gold-dark bg-clip-text text-transparent">
                      مساعد مصر الذكي
                    </span>
                  </h1>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[10px] bg-gradient-to-l from-pharaoh-gold/20 to-pharaoh-gold/10 text-pharaoh-gold-dark border border-pharaoh-gold/30 px-2 py-0.5 rounded-full font-semibold">
                      ✨ مدعوم بـ Gemini
                    </span>
                    <span>اسألني أي حاجة عن الخدمات الحكومية</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={clear}
                disabled={isLoading || entries.length === 1}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 bg-white border border-sand-200 hover:bg-sand-50 hover:border-egypt-red/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                🗑️ محادثة جديدة
              </button>
            </div>
          </div>
        </section>

        {/* Chat area */}
        <section className="flex-1 max-w-4xl w-full mx-auto px-4 py-6">
          <div className="space-y-5">
            {entries.map((entry) => (
              <ChatBubble key={entry.id} entry={entry} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          {showQuickReplies && (
            <div className="mt-6">
              <div className="text-xs text-gray-500 mb-2 px-1">جرب تسأل:</div>
              <div className="flex flex-wrap gap-2">
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleQuickReply(q)}
                    className="px-3 py-1.5 rounded-full bg-white border border-sand-200 hover:border-pharaoh-gold/50 hover:text-egypt-red text-xs text-gray-700 transition-colors cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Input bar */}
        <section className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-sand-200 py-4">
          <div className="max-w-4xl mx-auto px-4">
            <form onSubmit={handleSubmit} className="flex items-end gap-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (input.trim() && !isLoading) {
                      send(input);
                      setInput("");
                    }
                  }
                }}
                placeholder="اكتب سؤالك... (Enter للإرسال، Shift+Enter لسطر جديد)"
                rows={1}
                className="flex-1 px-4 py-3 rounded-2xl border-2 border-sand-200 bg-white text-sm resize-none max-h-32 focus:outline-none focus:border-pharaoh-gold focus:ring-4 focus:ring-pharaoh-gold/10 transition-all"
                style={{ minHeight: "50px" }}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-egypt-red to-egypt-red-dark text-white flex items-center justify-center shadow-md hover:shadow-lg hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                aria-label="إرسال"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2L11 13" />
                    <path d="M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                )}
              </button>
            </form>
            <div className="text-[10px] text-gray-400 text-center mt-2">
              المساعد قد يخطئ. تحقق دائماً من المصدر الرسمي.
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
"use client";

import { useCallback, useState } from "react";
import { sendMessage } from "./api";
import type { ChatEntry, ChatMessage } from "./types";

const WELCOME_MESSAGE =
  "أهلاً بك! أنا مساعد مصر الذكي 🤖\n\nيمكنك سؤالي عن أي خدمة حكومية — مثلاً:\n• \"بطاقتي ضاعت، أعمل إيه؟\"\n• \"عايز أطلع جواز سفر\"\n• \"إيه المستندات المطلوبة لتجديد الرخصة؟\"";

function generateId(): string {
  return Date.now() + "-" + Math.random().toString(36).substr(2, 9);
}

export function useAssistantChat() {
  const [entries, setEntries] = useState<ChatEntry[]>([
    {
      id: generateId(),
      role: "assistant",
      content: WELCOME_MESSAGE,
      timestamp: Date.now(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      const userEntry: ChatEntry = {
        id: generateId(),
        role: "user",
        content: trimmed,
        timestamp: Date.now(),
      };
      setEntries((prev) => [...prev, userEntry]);
      setIsLoading(true);
      setError(null);

      const history: ChatMessage[] = entries
        .slice(1)
        .slice(-10)
        .map((e) => ({ role: e.role, content: e.content }));

      try {
        const res = await sendMessage(trimmed, history);

        const aiEntry: ChatEntry = {
          id: generateId(),
          role: "assistant",
          content: res.reply,
          suggested_services: res.suggested_services,
          disclaimer: res.disclaimer,
          timestamp: Date.now(),
        };
        setEntries((prev) => [...prev, aiEntry]);
      } catch (err: unknown) {
        const anyErr = err as {
          response?: { status?: number; data?: { detail?: string } };
          message?: string;
        };
        const detail =
          anyErr.response?.data?.detail ||
          anyErr.message ||
          "حدث خطأ أثناء الاتصال بالمساعد";
        setError(detail);

        setEntries((prev) => [
          ...prev,
          {
            id: generateId(),
            role: "assistant",
            content: "عذراً، حدث خطأ: " + detail + "\n\nحاول مرة أخرى.",
            timestamp: Date.now(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [entries, isLoading]
  );

  const clear = useCallback(() => {
    setEntries([
      {
        id: generateId(),
        role: "assistant",
        content: WELCOME_MESSAGE,
        timestamp: Date.now(),
      },
    ]);
    setError(null);
  }, []);

  return { entries, isLoading, error, send, clear };
}
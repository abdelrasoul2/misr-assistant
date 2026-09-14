"use client";

import { EMPTY_REQUEST_DATA, type RequestData } from "./types";

const STORAGE_KEY = "misr-request-data";
const PROGRESS_KEY = "misr-request-progress";

export function loadRequestData(): RequestData {
  if (typeof window === "undefined") return EMPTY_REQUEST_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_REQUEST_DATA;
    return { ...EMPTY_REQUEST_DATA, ...JSON.parse(raw) };
  } catch {
    return EMPTY_REQUEST_DATA;
  }
}

export function saveRequestData(data: RequestData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearRequestData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function loadProgress(serviceSlug: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(`${PROGRESS_KEY}-${serviceSlug}`);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

export function saveProgress(serviceSlug: string, done: Set<string>): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    `${PROGRESS_KEY}-${serviceSlug}`,
    JSON.stringify(Array.from(done))
  );
}

export function clearProgress(serviceSlug: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(`${PROGRESS_KEY}-${serviceSlug}`);
}

export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === "undefined") return false;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}
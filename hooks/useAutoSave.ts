"use client";

import { useEffect, useRef } from "react";
import { saveManager } from "@/store";

const AUTO_SAVE_INTERVAL_MS = 5000;

export function useAutoSave(enabled = true) {
  const timeoutRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!enabled) return;

    timeoutRef.current = setInterval(() => {
      saveManager.save();
    }, AUTO_SAVE_INTERVAL_MS);

    return () => {
      if (timeoutRef.current) clearInterval(timeoutRef.current);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = () => {
      saveManager.save();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [enabled]);
}

export function saveGameNow(): void {
  saveManager.save();
}

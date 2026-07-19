"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

export function useIdleBreathing(enabled = true) {
  const controls = useAnimation();

  useEffect(() => {
    if (!enabled) {
      controls.stop();
      return;
    }

    controls.start({
      y: [0, -3, 0, 2, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    });
  }, [controls, enabled]);

  return controls;
}

export function useCameraSway(enabled = true) {
  const controls = useAnimation();

  useEffect(() => {
    if (!enabled) {
      controls.stop();
      return;
    }

    controls.start({
      x: [0, 2, -1, 1, 0],
      rotate: [0, 0.3, -0.2, 0.1, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    });
  }, [controls, enabled]);

  return controls;
}

export function useDelayedAction(delayMs: number) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const schedule = (callback: () => void) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(callback, delayMs);
  };

  const cancel = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  useEffect(() => cancel, []);

  return { schedule, cancel };
}

export { motion };

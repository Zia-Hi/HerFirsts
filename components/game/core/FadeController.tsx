"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { FADE_DURATION_MS } from "@/lib/game/constants";
import { useGameSettings } from "@/hooks/useGameStore";

export interface FadeContextValue {
  opacity: number;
  isTransitioning: boolean;
  fadeOut: (duration?: number) => Promise<void>;
  fadeIn: (duration?: number) => Promise<void>;
}

export const FadeContext = createContext<FadeContextValue | null>(null);

function getDuration(duration: number | undefined, reducedMotion: boolean): number {
  if (reducedMotion) {
    return 0;
  }
  return duration ?? FADE_DURATION_MS;
}

export function FadeController({ children }: { children: ReactNode }) {
  const { reducedMotion } = useGameSettings();
  const [opacity, setOpacity] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeDuration, setActiveDuration] = useState(FADE_DURATION_MS);
  const resolveRef = useRef<(() => void) | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runTransition = useCallback(
    (targetOpacity: number, duration: number) => {
      return new Promise<void>((resolve) => {
        if (duration === 0) {
          setOpacity(targetOpacity);
          setIsTransitioning(false);
          resolve();
          return;
        }

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        resolveRef.current = resolve;
        setActiveDuration(duration);
        setIsTransitioning(true);
        setOpacity(targetOpacity);

        timeoutRef.current = setTimeout(() => {
          if (resolveRef.current) {
            setIsTransitioning(false);
            resolveRef.current();
            resolveRef.current = null;
          }
        }, duration + 50);
      });
    },
    [],
  );

  const fadeOut = useCallback(
    (duration?: number) => runTransition(1, getDuration(duration, reducedMotion)),
    [reducedMotion, runTransition],
  );

  const fadeIn = useCallback(
    (duration?: number) => runTransition(0, getDuration(duration, reducedMotion)),
    [reducedMotion, runTransition],
  );

  const handleTransitionComplete = useCallback(() => {
    if (!resolveRef.current) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setIsTransitioning(false);
    resolveRef.current();
    resolveRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <FadeContext.Provider value={{ opacity, isTransitioning, fadeOut, fadeIn }}>
      {children}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-50 bg-black"
        style={{
          opacity,
          transition: `opacity ${activeDuration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`,
        }}
        onTransitionEnd={handleTransitionComplete}
      />
    </FadeContext.Provider>
  );
}

export function useFadeContext(): FadeContextValue {
  const context = useContext(FadeContext);
  if (!context) {
    throw new Error("useFadeContext must be used within FadeController");
  }
  return context;
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { motion } from "framer-motion";
import { CAMERA_DEFAULTS, CAMERA_TRANSITION } from "@/lib/game/constants";
import type { CameraShakeOptions, CameraState, CameraSwayOptions, CameraZoomOptions } from "@/types";

export interface CameraContextValue extends CameraState {
  sway: (options: CameraSwayOptions) => void;
  setZoom: (options: CameraZoomOptions) => void;
  shake: (options: CameraShakeOptions) => void;
  reset: () => void;
}

export const CameraContext = createContext<CameraContextValue | null>(null);

export function CameraController({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CameraState>({
    offset: { ...CAMERA_DEFAULTS.offset },
    zoom: CAMERA_DEFAULTS.zoom,
    shakeIntensity: CAMERA_DEFAULTS.shakeIntensity,
  });

  const sway = useCallback((options: CameraSwayOptions) => {
    setState((current) => ({
      ...current,
      offset: options.offset,
    }));
  }, []);

  const setZoom = useCallback((options: CameraZoomOptions) => {
    setState((current) => ({
      ...current,
      zoom: options.zoom,
    }));
  }, []);

  const shake = useCallback((options: CameraShakeOptions) => {
    setState((current) => ({
      ...current,
      shakeIntensity: options.intensity,
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      offset: { ...CAMERA_DEFAULTS.offset },
      zoom: CAMERA_DEFAULTS.zoom,
      shakeIntensity: CAMERA_DEFAULTS.shakeIntensity,
    });
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      sway,
      setZoom,
      shake,
      reset,
    }),
    [reset, shake, state, sway, setZoom],
  );

  return (
    <CameraContext.Provider value={value}>
      <motion.div
        className="h-full w-full origin-center"
        animate={{
          x: state.offset.x,
          y: state.offset.y,
          scale: state.zoom,
        }}
        transition={{
          duration: CAMERA_TRANSITION.duration,
          ease: CAMERA_TRANSITION.easing,
        }}
      >
        {children}
      </motion.div>
    </CameraContext.Provider>
  );
}

export function useCameraContext(): CameraContextValue {
  const context = useContext(CameraContext);
  if (!context) {
    throw new Error("useCameraContext must be used within CameraController");
  }
  return context;
}

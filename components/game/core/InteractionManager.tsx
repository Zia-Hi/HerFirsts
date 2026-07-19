"use client";

import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { interactionManager } from "@/lib/game/interaction-manager";
import type { Interactable, InteractableId, InteractionHit, Vector2 } from "@/types";

export interface InteractionContextValue {
  register: (interactable: Interactable) => void;
  unregister: (interactableId: InteractableId) => void;
  setEnabled: (enabled: boolean) => void;
  hitTest: (position: Vector2) => InteractionHit | null;
  interact: (position: Vector2) => InteractionHit | null;
  getAll: () => Interactable[];
}

const InteractionContext = createContext<InteractionContextValue | null>(null);

export function InteractionManager({ children }: { children: ReactNode }) {
  const register = useCallback((interactable: Interactable) => {
    interactionManager.register(interactable);
  }, []);

  const unregister = useCallback((interactableId: InteractableId) => {
    interactionManager.unregister(interactableId);
  }, []);

  const setEnabled = useCallback((enabled: boolean) => {
    interactionManager.setEnabled(enabled);
  }, []);

  const hitTest = useCallback((position: Vector2) => {
    return interactionManager.hitTest(position);
  }, []);

  const interact = useCallback((position: Vector2) => {
    return interactionManager.interact(position);
  }, []);

  const getAll = useCallback(() => {
    return interactionManager.getAll();
  }, []);

  const value = useMemo(
    () => ({
      register,
      unregister,
      setEnabled,
      hitTest,
      interact,
      getAll,
    }),
    [getAll, hitTest, interact, register, setEnabled, unregister],
  );

  return (
    <InteractionContext.Provider value={value}>{children}</InteractionContext.Provider>
  );
}

export function useInteractionContext(): InteractionContextValue {
  const context = useContext(InteractionContext);
  if (!context) {
    throw new Error("useInteractionContext must be used within InteractionManager");
  }
  return context;
}

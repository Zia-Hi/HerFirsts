"use client";

import { useEffect, useRef } from "react";
import { useInteractionContext } from "@/components/game/core/InteractionManager";
import type { InteractableId, Vector2 } from "@/types";

interface InteractableZoneProps {
  id: InteractableId;
  bounds: { x: number; y: number; width: number; height: number };
  enabled?: boolean;
  priority?: number;
  onInteract: (position: Vector2) => void;
  className?: string;
  children?: React.ReactNode;
}

export function InteractableZone({
  id,
  bounds,
  enabled = true,
  priority = 0,
  onInteract,
  className = "",
  children,
}: InteractableZoneProps) {
  const { register, unregister } = useInteractionContext();
  const onInteractRef = useRef(onInteract);
  onInteractRef.current = onInteract;

  useEffect(() => {
    register({
      id,
      bounds,
      enabled,
      priority,
      onInteract: (position) => onInteractRef.current(position),
    });
    return () => unregister(id);
  }, [id, bounds, enabled, priority, register, unregister]);

  return (
    <div
      className={`absolute ${className}`}
      style={{
        left: bounds.x,
        top: bounds.y,
        width: bounds.width,
        height: bounds.height,
      }}
    >
      {children}
    </div>
  );
}

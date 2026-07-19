import type { Vector2 } from "./index";

export type InteractableId = string;

export interface InteractionBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Interactable {
  id: InteractableId;
  bounds: InteractionBounds;
  enabled: boolean;
  priority: number;
  onInteract: (position: Vector2) => void;
}

export interface InteractionHit {
  interactable: Interactable;
  position: Vector2;
}

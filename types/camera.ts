import type { Vector2 } from "./index";

export interface CameraState {
  offset: Vector2;
  zoom: number;
  shakeIntensity: number;
}

export interface CameraTransition {
  duration: number;
  easing: number[];
}

export interface CameraSwayOptions extends Partial<CameraTransition> {
  offset: Vector2;
}

export interface CameraZoomOptions extends Partial<CameraTransition> {
  zoom: number;
}

export interface CameraShakeOptions extends Partial<CameraTransition> {
  intensity: number;
}

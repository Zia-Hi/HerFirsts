import type { ComponentType } from "react";
import type { SceneId } from "./game";

export interface SceneDefinition {
  id: SceneId;
  component: ComponentType;
}

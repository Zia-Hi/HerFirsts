export type ToolId =
  | "adjustable-wrench"
  | "screwdriver"
  | "plumber-tape"
  | "gloves";

export interface ToolDefinition {
  id: ToolId;
  name: string;
  description: string;
  icon: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: "tool" | "mission";
}

export interface InventoryState {
  items: InventoryItem[];
  heldItem: ToolId | null;
  toolboxOpen: boolean;
  toolboxLocation: "laundry" | "kitchen" | null;
}

export interface InventorySnapshot {
  items: InventoryItem[];
  heldItem: ToolId | null;
  missionComplete: boolean;
}

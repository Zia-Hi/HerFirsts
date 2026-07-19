import type { ToolDefinition, ToolId } from "@/types";

export const TOOL_DEFINITIONS: Record<ToolId, ToolDefinition> = {
  "adjustable-wrench": {
    id: "adjustable-wrench",
    name: "Adjustable Wrench",
    description: "For tightening loose pipe fittings.",
    icon: "🔧",
  },
  screwdriver: {
    id: "screwdriver",
    name: "Screwdriver",
    description: "For small screws — not needed for this repair.",
    icon: "🪛",
  },
  "plumber-tape": {
    id: "plumber-tape",
    name: "Plumber's Tape",
    description: "Seals pipe threads to prevent leaks.",
    icon: "📜",
  },
  gloves: {
    id: "gloves",
    name: "Rubber Gloves",
    description: "Protects hands from water and metal fixtures.",
    icon: "🧤",
  },
};

export const TOOLBOX_TOOLS: ToolId[] = [
  "adjustable-wrench",
  "screwdriver",
  "plumber-tape",
  "gloves",
];

export const REQUIRED_SHOWER_TOOLS: ToolId[] = [
  "gloves",
  "adjustable-wrench",
  "plumber-tape",
];

export function getTool(id: ToolId): ToolDefinition {
  return TOOL_DEFINITIONS[id];
}

export function isRequiredForShower(toolId: ToolId): boolean {
  return REQUIRED_SHOWER_TOOLS.includes(toolId);
}

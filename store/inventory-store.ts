import { create } from "zustand";
import type { InventorySnapshot, InventoryState, ToolId } from "@/types";

export interface InventoryItem {
  id: string;
  name: string;
  category: "tool" | "mission";
}

const initialState: InventoryState = {
  items: [] as InventoryItem[],
  heldItem: null,
  toolboxOpen: false,
  toolboxLocation: "laundry",
};

interface InventoryStoreActions {
  openToolbox: () => void;
  closeToolbox: () => void;
  pickUpTool: (toolId: ToolId) => boolean;
  putDownTool: () => void;
  selectHeldItem: (toolId: ToolId | null) => void;
  addItem: (item: InventoryItem) => void;
  removeItem: (itemId: string) => void;
  hasTool: (toolId: ToolId) => boolean;
  hasItem: (itemId: string) => boolean;
  clearInventory: () => void;
  getSnapshot: () => InventorySnapshot;
  hydrate: (state: Partial<InventoryState>) => void;
}

export const useInventoryStore = create<InventoryState & InventoryStoreActions>((set, get) => ({
  ...initialState,

  openToolbox: () => set({ toolboxOpen: true }),

  closeToolbox: () => set({ toolboxOpen: false }),

  pickUpTool: (toolId) => {
    const { items } = get();
    const item = items.find((i) => i.id === toolId);
    if (item) {
      set({ heldItem: toolId });
      return true;
    }
    set((state) => ({
      items: [...state.items, { id: toolId, name: "", category: "tool" }],
      heldItem: toolId,
    }));
    return true;
  },

  putDownTool: () => set({ heldItem: null }),

  selectHeldItem: (toolId) => set({ heldItem: toolId }),

  addItem: (item) =>
    set((state) => {
      if (state.items.some((i) => i.id === item.id)) {
        return state;
      }
      return { items: [...state.items, item] };
    }),

  removeItem: (itemId) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== itemId),
      heldItem: state.heldItem === itemId ? null : state.heldItem,
    })),

  hasTool: (toolId) => get().items.some((i) => i.id === toolId),

  hasItem: (itemId) => get().items.some((i) => i.id === itemId),

  clearInventory: () => set({ ...initialState }),

  getSnapshot: () => {
    const { items, heldItem } = get();
    return { items, heldItem, missionComplete: false };
  },

  hydrate: (state) => set((current) => ({ ...current, ...state })),
}));

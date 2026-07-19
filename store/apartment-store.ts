import { create } from "zustand";
import type { ApartmentState, RoomId } from "@/types";
import { canNavigate } from "@/lib/game/apartment-layout";

const initialState: ApartmentState = {
  currentRoom: "entry",
  visitedRooms: ["entry"],
  playerCanMove: false,
};

interface ApartmentStoreActions {
  setCurrentRoom: (room: RoomId) => void;
  navigateTo: (room: RoomId) => boolean;
  enableMovement: (enabled: boolean) => void;
  markVisited: (room: RoomId) => void;
  getSnapshot: () => Pick<ApartmentState, "currentRoom" | "visitedRooms">;
  hydrate: (state: Partial<ApartmentState>) => void;
  reset: () => void;
}

export const useApartmentStore = create<ApartmentState & ApartmentStoreActions>((set, get) => ({
  ...initialState,

  setCurrentRoom: (currentRoom) => set({ currentRoom }),

  navigateTo: (room) => {
    const { currentRoom, playerCanMove } = get();
    if (!playerCanMove) return false;
    if (!canNavigate(currentRoom, room)) return false;

    set((state) => ({
      currentRoom: room,
      visitedRooms: state.visitedRooms.includes(room)
        ? state.visitedRooms
        : [...state.visitedRooms, room],
    }));
    return true;
  },

  enableMovement: (playerCanMove) => set({ playerCanMove }),

  markVisited: (room) =>
    set((state) => ({
      visitedRooms: state.visitedRooms.includes(room)
        ? state.visitedRooms
        : [...state.visitedRooms, room],
    })),

  getSnapshot: () => {
    const { currentRoom, visitedRooms } = get();
    return { currentRoom, visitedRooms };
  },

  hydrate: (state) => set((current) => ({ ...current, ...state })),

  reset: () => set({ ...initialState }),
}));

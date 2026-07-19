export type RoomId =
  | "entry"
  | "living"
  | "dining"
  | "kitchen"
  | "bedroom"
  | "study"
  | "shower"
  | "bathroom"
  | "laundry";

export interface RoomBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RoomDefinition {
  id: RoomId;
  label: string;
  bounds: RoomBounds;
  connections: RoomId[];
  floorColor: string;
  accentColor: string;
}

export interface ApartmentState {
  currentRoom: RoomId;
  visitedRooms: RoomId[];
  playerCanMove: boolean;
}

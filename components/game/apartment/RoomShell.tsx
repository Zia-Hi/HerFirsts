"use client";

import type { RoomId } from "@/types";
import { APARTMENT_ROOMS } from "@/lib/game/apartment-layout";

interface RoomProps {
  isActive: boolean;
  isVisited: boolean;
  onNavigate?: (roomId: RoomId) => void;
  children?: React.ReactNode;
}

export function RoomShell({
  roomId,
  isActive,
  children,
}: {
  roomId: RoomId;
  isActive: boolean;
  children: React.ReactNode;
}) {
  const room = APARTMENT_ROOMS[roomId];

  if (!isActive) return null;

  return (
    <div
      className="absolute transition-opacity duration-700"
      style={{
        left: `${room.bounds.x}%`,
        top: `${room.bounds.y}%`,
        width: `${room.bounds.width}%`,
        height: `${room.bounds.height}%`,
        backgroundColor: room.floorColor,
      }}
    >
      {children}
    </div>
  );
}

export function RoomLabel({ label }: { label: string }) {
  return (
    <span className="font-game-sans pointer-events-none absolute left-2 top-1 text-[8px] uppercase tracking-widest text-ink/20">
      {label}
    </span>
  );
}

export function Doorway({
  direction,
  targetRoom,
  label,
  onNavigate,
  locked,
}: {
  direction: "north" | "south" | "east" | "west";
  targetRoom: RoomId;
  label: string;
  onNavigate: (room: RoomId) => void;
  locked?: boolean;
}) {
  const positionClasses = {
    north: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
    south: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
    east: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
    west: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2",
  };

  return (
    <button
      type="button"
      onClick={() => onNavigate(targetRoom)}
      className={`group absolute z-20 ${positionClasses[direction]}`}
      aria-label={`Go to ${label}`}
      disabled={locked}
    >
      <div className={`flex h-6 w-10 items-center justify-center transition-all ${
        locked 
          ? "bg-ink/10 cursor-not-allowed" 
          : "bg-oak-500/20 group-hover:bg-oak-500/40 group-hover:scale-110"
      }`}>
        {locked ? (
          <span className="font-game-sans text-[7px] uppercase tracking-wider text-ink/20">
            Locked
          </span>
        ) : (
          <span className="font-game-sans text-[7px] uppercase tracking-wider text-ink/40 group-hover:text-ink/70">
            {label}
          </span>
        )}
      </div>
    </button>
  );
}

export function Furniture({
  className = "",
  style,
  children,
}: {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`absolute ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

export type { RoomProps };
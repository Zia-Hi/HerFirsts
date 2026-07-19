"use client";

import { motion } from "framer-motion";
import { APARTMENT_ROOMS } from "@/lib/game/apartment-layout";
import type { RoomId } from "@/types";

interface ApartmentFloorPlanProps {
  currentRoom: RoomId;
  visitedRooms: RoomId[];
  showOverview?: boolean;
}

export function ApartmentFloorPlan({
  currentRoom,
  visitedRooms,
  showOverview = false,
}: ApartmentFloorPlanProps) {
  return (
    <div className="relative h-full w-full">
      {/* Exterior walls */}
      <div className="absolute inset-[1%] border-2 border-ink/30 bg-cream-100/5" />

      {/* Room outlines when in overview mode */}
      {showOverview &&
        Object.values(APARTMENT_ROOMS).map((room) => (
          <div
            key={room.id}
            className={`absolute border transition-colors duration-500 ${
              room.id === currentRoom
                ? "border-sage-400/40 bg-sage-200/10"
                : visitedRooms.includes(room.id)
                  ? "border-oak-500/15 bg-transparent"
                  : "border-transparent bg-transparent"
            }`}
            style={{
              left: `${room.bounds.x}%`,
              top: `${room.bounds.y}%`,
              width: `${room.bounds.width}%`,
              height: `${room.bounds.height}%`,
            }}
          />
        ))}

      {/* Warm sunlight gradient */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(217, 194, 142, 0.12) 0%, transparent 60%)",
        }}
      />
    </div>
  );
}

interface RoomTransitionProps {
  roomId: RoomId;
  children: React.ReactNode;
}

export function RoomTransition({ roomId, children }: RoomTransitionProps) {
  return (
    <motion.div
      key={roomId}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="absolute inset-0"
    >
      {children}
    </motion.div>
  );
}

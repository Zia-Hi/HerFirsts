"use client";

import { RoomShell, RoomLabel, Doorway, Furniture } from "../RoomShell";
import type { RoomId } from "@/types";

interface RoomComponentProps {
  isActive: boolean;
  isVisited: boolean;
  onNavigate: (room: RoomId) => void;
  onInteract?: (target: string) => void;
  halfUnpacked?: boolean;
  locked?: (roomId: RoomId) => boolean;
}

export function EntryRoom({ isActive, onNavigate, halfUnpacked, locked }: RoomComponentProps) {
  return (
    <RoomShell roomId="entry" isActive={isActive}>
      <RoomLabel label="Entry" />
      <Furniture className="bottom-2 left-1/2 h-8 w-14 -translate-x-1/2 bg-oak-500/30" />
      <Furniture className="bottom-4 right-3 h-6 w-10 bg-sage-400/20" />
      {halfUnpacked && (
        <Furniture className="left-3 top-3 h-8 w-8 border border-oak-500/20 bg-beige-300/30" />
      )}
      <Doorway direction="north" targetRoom="living" label="Living" onNavigate={onNavigate} locked={locked?.("living")} />
    </RoomShell>
  );
}

export function LivingRoom({ isActive, onNavigate, halfUnpacked, locked, onInteract }: RoomComponentProps) {
  return (
    <RoomShell roomId="living" isActive={isActive}>
      <RoomLabel label="Living Room" />
      <Furniture className="left-2 top-4 h-10 w-16 bg-beige-300/40" />
      <Furniture
        className="left-1/2 top-1/2 h-12 w-20 -translate-x-1/2 -translate-y-1/2"
        style={{ backgroundColor: "rgba(217, 194, 142, 0.35)" }}
      />
      <Furniture className="right-2 top-3 h-6 w-12 bg-oak-500/25" />
      {halfUnpacked && (
        <>
          <Furniture className="bottom-3 left-4 h-10 w-10 border border-oak-500/15 bg-beige-200/30" />
          <Furniture className="bottom-2 right-6 h-8 w-14 border border-oak-500/15 bg-beige-200/25" />
        </>
      )}
      <button
        type="button"
        onClick={() => onInteract?.("toolbox")}
        className="group absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-8 z-10"
      >
        <div className="h-6 w-10 bg-oak-500/40 transition-transform group-hover:scale-105" />
        <span className="font-game-sans mt-0.5 block text-center text-[7px] uppercase tracking-wider text-ink/40 group-hover:text-ink/60">
          Toolbox
        </span>
      </button>
      <Doorway direction="south" targetRoom="entry" label="Entry" onNavigate={onNavigate} locked={locked?.("entry")} />
      <Doorway direction="north" targetRoom="dining" label="Dining" onNavigate={onNavigate} locked={locked?.("dining")} />
      <Doorway direction="west" targetRoom="study" label="Study" onNavigate={onNavigate} locked={locked?.("study")} />
    </RoomShell>
  );
}

export function DiningRoom({ isActive, onNavigate, locked }: RoomComponentProps) {
  return (
    <RoomShell roomId="dining" isActive={isActive}>
      <RoomLabel label="Dining" />
      <Furniture className="left-1/2 top-1/2 h-10 w-16 -translate-x-1/2 -translate-y-1/2 bg-oak-500/30" />
      <Furniture className="left-1/3 top-1/2 h-4 w-4 -translate-y-1/2 bg-sage-400/30" />
      <Furniture className="right-1/3 top-1/2 h-4 w-4 -translate-y-1/2 bg-sage-400/30" />
      <Doorway direction="south" targetRoom="living" label="Living" onNavigate={onNavigate} locked={locked?.("living")} />
      <Doorway direction="north" targetRoom="kitchen" label="Kitchen" onNavigate={onNavigate} locked={locked?.("kitchen")} />
      <Doorway direction="west" targetRoom="bedroom" label="Bedroom" onNavigate={onNavigate} locked={locked?.("bedroom")} />
      <Doorway direction="east" targetRoom="bathroom" label="Bath" onNavigate={onNavigate} locked={locked?.("bathroom")} />
    </RoomShell>
  );
}

export function KitchenRoom({ isActive, onNavigate, locked }: RoomComponentProps) {
  return (
    <RoomShell roomId="kitchen" isActive={isActive}>
      <RoomLabel label="Kitchen" />
      <Furniture className="left-1 top-2 h-4 w-[90%] bg-sage-400/25" />
      <Furniture className="right-2 top-3 h-12 w-8 bg-dust-300/30" />
      <Furniture className="left-4 bottom-3 h-6 w-8 bg-oak-500/20" />
      <Doorway direction="south" targetRoom="dining" label="Dining" onNavigate={onNavigate} locked={locked?.("dining")} />
      <Doorway direction="east" targetRoom="shower" label="Shower" onNavigate={onNavigate} locked={locked?.("shower")} />
    </RoomShell>
  );
}

export function BedroomRoom({ isActive, onNavigate, halfUnpacked, locked }: RoomComponentProps) {
  return (
    <RoomShell roomId="bedroom" isActive={isActive}>
      <RoomLabel label="Bedroom" />
      <Furniture className="left-2 top-3 h-14 w-20 bg-sage-400/25" />
      <Furniture className="right-2 top-2 h-12 w-10 bg-oak-500/20" />
      {halfUnpacked && (
        <Furniture className="bottom-2 left-1/2 h-8 w-16 -translate-x-1/2 border border-beige-500/20 bg-beige-200/20" />
      )}
      <Doorway direction="south" targetRoom="study" label="Study" onNavigate={onNavigate} locked={locked?.("study")} />
      <Doorway direction="east" targetRoom="dining" label="Dining" onNavigate={onNavigate} locked={locked?.("dining")} />
    </RoomShell>
  );
}

export function StudyRoom({ isActive, onNavigate, halfUnpacked, locked }: RoomComponentProps) {
  return (
    <RoomShell roomId="study" isActive={isActive}>
      <RoomLabel label="Study" />
      <Furniture className="left-2 top-1/2 h-8 w-14 -translate-y-1/2 bg-oak-500/30" />
      <Furniture className="left-4 top-1/2 h-4 w-4 translate-y-2 bg-sage-400/20" />
      {halfUnpacked && (
        <Furniture className="right-3 bottom-3 h-10 w-8 border border-oak-500/15 bg-beige-200/25" />
      )}
      <Doorway direction="north" targetRoom="bedroom" label="Bedroom" onNavigate={onNavigate} locked={locked?.("bedroom")} />
      <Doorway direction="east" targetRoom="living" label="Living" onNavigate={onNavigate} locked={locked?.("living")} />
    </RoomShell>
  );
}

export function ShowerRoom({
  isActive,
  onNavigate,
  onInteract,
  waterSpraying,
  locked,
}: RoomComponentProps & { waterSpraying?: boolean }) {
  return (
    <RoomShell roomId="shower" isActive={isActive}>
      <RoomLabel label="Shower" />
      <div
        className="absolute inset-2 border border-sage-400/20"
        style={{ backgroundColor: "rgba(205, 214, 203, 0.4)" }}
      />
      <button
        type="button"
        onClick={() => onInteract?.("shower-head")}
        className="group absolute left-1/2 top-3 z-10 -translate-x-1/2"
      >
        <div className="h-5 w-5 rounded-full bg-dust-300/60 transition-transform group-hover:scale-110" />
        <div className="mx-auto mt-0.5 h-3 w-0.5 bg-dust-500/40" />
        {waterSpraying && (
          <div className="absolute left-1/2 top-6 -translate-x-1/2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute h-8 w-px animate-pulse bg-dust-300/40"
                style={{ left: `${(i - 2) * 4}px`, animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        )}
      </button>
      <Furniture className="right-2 top-6 h-8 w-6 bg-oak-500/20" />
      <Doorway direction="south" targetRoom="bathroom" label="Bath" onNavigate={onNavigate} locked={locked?.("bathroom")} />
      <Doorway direction="west" targetRoom="kitchen" label="Kitchen" onNavigate={onNavigate} locked={locked?.("kitchen")} />
    </RoomShell>
  );
}

export function BathroomRoom({ isActive, onNavigate, locked }: RoomComponentProps) {
  return (
    <RoomShell roomId="bathroom" isActive={isActive}>
      <RoomLabel label="Bathroom" />
      <Furniture className="left-3 bottom-3 h-6 w-5 bg-cream-100/40" />
      <Furniture className="right-3 top-4 h-8 w-10 bg-oak-500/20" />
      <Furniture className="left-1/2 top-2 h-4 w-6 -translate-x-1/2 bg-dust-300/20" />
      <Doorway direction="north" targetRoom="shower" label="Shower" onNavigate={onNavigate} locked={locked?.("shower")} />
      <Doorway direction="south" targetRoom="laundry" label="Laundry" onNavigate={onNavigate} locked={locked?.("laundry")} />
      <Doorway direction="west" targetRoom="dining" label="Dining" onNavigate={onNavigate} locked={locked?.("dining")} />
    </RoomShell>
  );
}

export function LaundryRoom({ isActive, onNavigate, locked }: RoomComponentProps) {
  return (
    <RoomShell roomId="laundry" isActive={isActive}>
      <RoomLabel label="Laundry" />
      <Furniture className="left-3 top-4 h-10 w-8 bg-dust-300/25" />
      <Furniture className="right-3 top-3 h-6 w-10 bg-oak-500/20" />
      <Furniture className="bottom-3 right-4 h-8 w-8 rounded-full border border-oak-500/20 bg-beige-300/20" />
      <Doorway direction="north" targetRoom="bathroom" label="Bath" onNavigate={onNavigate} locked={locked?.("bathroom")} />
    </RoomShell>
  );
}
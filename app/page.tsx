"use client";

import dynamic from "next/dynamic";

const GameRoot = dynamic(() => import("@/components/game/core/GameRoot").then((mod) => ({ default: mod.GameRoot })), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#1c1a17]" />,
});

export default function HomePage() {
  return <GameRoot />;
}

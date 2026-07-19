"use client";

import { AudioManager } from "@/components/game/core/AudioManager";
import { CameraController } from "@/components/game/core/CameraController";
import { FadeController } from "@/components/game/core/FadeController";
import { GameBootstrap } from "@/components/game/core/GameBootstrap";
import { InteractionManager } from "@/components/game/core/InteractionManager";
import { SceneManager } from "@/components/game/core/SceneManager";

export function GameRoot() {
  return (
    <FadeController>
      <div className="relative h-screen w-screen overflow-hidden bg-[#1c1a17]">
        <CameraController>
          <InteractionManager>
            <GameBootstrap />
            <AudioManager />
            <SceneManager />
          </InteractionManager>
        </CameraController>
      </div>
    </FadeController>
  );
}

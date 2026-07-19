"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { DustParticles, FailureHint, InventoryPanel, KnowledgeNotebook, LetterModal, MissionObjective, SettingsButton, SettingsPanel, Toolbox, TypewriterSubtitle } from "@/components/game/ui";
import { useGameAudio } from "@/hooks/useGameAudio";
import { useSceneTransition } from "@/hooks/useSceneTransition";
import { APARTMENT_ROOMS, SCENE_IDS } from "@/lib/game";
import { useApartmentStore, useGameStore, useInventoryStore, useKnowledgeStore, useMissionStore, saveManager } from "@/store";
import type { RoomId } from "@/types";

const INITIAL_LOCKED_ROOMS: RoomId[] = ["bedroom", "kitchen", "dining", "entry", "laundry", "living", "study"];

interface RoomLabelProps {
  roomId: RoomId;
  isLocked: boolean;
}

function RoomLabel({ roomId, isLocked, visible, delay = 0, isCompleted = false }: RoomLabelProps & { visible: boolean; delay?: number; isCompleted?: boolean }) {
  const room = APARTMENT_ROOMS[roomId];
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.9 }}
          transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute pointer-events-none z-10"
          style={{
            left: `${room.bounds.x + room.bounds.width / 2}%`,
            top: `${room.bounds.y + 3}%`,
            transform: "translateX(-50%)",
          }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isLocked ? 0.6 : 0.85, scale: 1 }}
            transition={{ 
              opacity: { duration: 1.5, delay: delay + 0.3 },
              scale: { duration: 1.5, delay: delay + 0.3 },
            }}
            className="px-5 py-2 rounded-full backdrop-blur-sm border" 
            style={{ 
              backgroundColor: "rgba(26, 24, 21, 0.8)",
              borderColor: isCompleted ? "rgba(74, 124, 89, 0.6)" : isLocked ? "rgba(245, 230, 200, 0.2)" : "rgba(245, 230, 200, 0.4)",
            }}
          >
            <motion.span 
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: isLocked ? 0.6 : 1, y: 0 }}
              transition={{ duration: 1.2, delay: delay + 0.6 }}
              className={`font-game-sans text-sm uppercase tracking-wider ${isCompleted ? "text-green-400" : isLocked ? "text-cream-200/60" : "text-cream-100"}`}
              style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
            >
              {room.label}
            </motion.span>
            {isCompleted && (
              <motion.span 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: delay + 0.9 }}
                className="ml-2 text-sm text-green-400"
              >
                ✓
              </motion.span>
            )}
            {isLocked && !isCompleted && (
              <motion.span 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 0.6, scale: 1 }}
                transition={{ duration: 1, delay: delay + 0.9 }}
                className="ml-2 text-sm"
              >
                🔒
              </motion.span>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface RoomHotspotProps {
  roomId: RoomId;
  isLocked: boolean;
  onClick: () => void;
}

function RoomHotspot({ roomId, isLocked, onClick }: RoomHotspotProps) {
  const room = APARTMENT_ROOMS[roomId];
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`absolute cursor-pointer transition-all ${isLocked ? "cursor-not-allowed" : ""}`}
      style={{
        left: `${room.bounds.x}%`,
        top: `${room.bounds.y}%`,
        width: `${room.bounds.width}%`,
        height: `${room.bounds.height}%`,
      }}
      whileHover={!isLocked ? { scale: 1.02 } : {}}
    >
      <motion.div
        className={`h-full w-full transition-all ${isLocked ? "bg-black/20" : "bg-white/5"}`}
        animate={!isLocked ? { opacity: [0.3, 0.5, 0.3] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {!isLocked && (
        <motion.div
          className="absolute bottom-2 right-2"
          animate={{ opacity: [0, 0.4, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="font-game-sans text-[8px] uppercase tracking-wider text-cream-200/50">
            Click
          </span>
        </motion.div>
      )}
    </motion.button>
  );
}

export function ApartmentScene() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showMissionTitle, setShowMissionTitle] = useState(false);
  const [fadeToBlack, setFadeToBlack] = useState(false);
  const [subtitle, setSubtitle] = useState<string | null>(null);
  const [showLabels, setShowLabels] = useState(false);
  const [currentMissionNumber, setCurrentMissionNumber] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  

  const playerCanMove = useApartmentStore((s) => s.playerCanMove);

  const missionStarted = useMissionStore((s) => s.missionStarted);
  const missionComplete = useMissionStore((s) => s.missionComplete);
  const lastFailureHint = useMissionStore((s) => s.lastFailureHint);
  const clearFailureHint = useMissionStore((s) => s.clearFailureHint);
  const completedSteps = useMissionStore((s) => s.completedSteps);

  const items = useInventoryStore((s) => s.items);
  const heldItem = useInventoryStore((s) => s.heldItem);
  const toolboxOpen = useInventoryStore((s) => s.toolboxOpen);
  const openToolbox = useInventoryStore((s) => s.openToolbox);
  const closeToolbox = useInventoryStore((s) => s.closeToolbox);
  const pickUpTool = useInventoryStore((s) => s.pickUpTool);
  const selectHeldItem = useInventoryStore((s) => s.selectHeldItem);
  
  const welcomeShown = useGameStore((s) => s.welcomeShown);
  const setWelcomeShown = useGameStore((s) => s.setWelcomeShown);
  const inventoryHintShown = useGameStore((s) => s.inventoryHintShown);
  const setInventoryHintShown = useGameStore((s) => s.setInventoryHintShown);
  const completedMissions = useGameStore((s) => s.completedMissions);
  const mission2Started = useGameStore((s) => s.mission2Started);

  const isToolboxLocked = !completedMissions.includes("mission-2");
  const [showToolboxLockedHint, setShowToolboxLockedHint] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [letterAutoShown, setLetterAutoShown] = useState(false);
  const [isLetterAutoOpen, setIsLetterAutoOpen] = useState(false);
  const lightingToolsCollected = useGameStore((s) => s.lightingToolsCollected);
  const addItem = useInventoryStore((s) => s.addItem);

  const isChapter1Completed = completedMissions.includes("mission-3");

  const notebookOpen = useKnowledgeStore((s) => s.notebookOpen);
  const cards = useKnowledgeStore((s) => s.cards);
  const activeCardId = useKnowledgeStore((s) => s.activeCardId);
  const openNotebook = useKnowledgeStore((s) => s.openNotebook);
  const closeNotebook = useKnowledgeStore((s) => s.closeNotebook);

  const { transitionToScene } = useSceneTransition();
  const { play, stop } = useGameAudio();

  const hasVinegar = items.some((item) => item.id === "vinegar");
  const hasPlasticBag = items.some((item) => item.id === "plastic-bag");
  const needTools = completedSteps.includes("rub-nozzle") && !completedSteps.includes("soak-head");
  let lockedRooms = INITIAL_LOCKED_ROOMS;
  if (needTools || missionStarted) {
    lockedRooms = INITIAL_LOCKED_ROOMS.filter((r) => r !== "kitchen");
  }
  if (mission2Started) {
    lockedRooms = lockedRooms.filter((r) => r !== "study");
  }
  if (completedMissions.includes("mission-2")) {
    lockedRooms = lockedRooms.filter((r) => r !== "living");
  }

  useEffect(() => {
    play("ambient-apartment", 0.35);
    return () => stop("ambient-apartment");
  }, [play, stop]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setShowLabels(true);
    }, 500);

    if (isChapter1Completed && !letterAutoShown) {
      setTimeout(() => {
        setShowLetter(true);
        setIsLetterAutoOpen(true);
        setLetterAutoShown(true);
      }, 1500);
    }

    if (!welcomeShown) {
      setTimeout(() => {
        setSubtitle("欢迎来到你的小家！");
      }, 2000);

      setTimeout(() => {
        setSubtitle(null);
      }, 4000);

      setTimeout(() => {
        setSubtitle("先从洗个热水澡开始吧~");
      }, 4500);

      setTimeout(() => {
        setSubtitle(null);
        setWelcomeShown(true);
        saveManager.save();
      }, 7000);
    }

    }, [welcomeShown, setWelcomeShown]);

  const handleRoomClick = useCallback(
    (roomId: RoomId) => {
      if (!playerCanMove) return;

      if (lockedRooms.includes(roomId)) {
        play("ui-error");
        return;
      }

      if (roomId === "bathroom" && !missionStarted) {
        setFadeToBlack(true);
        setTimeout(() => {
          setShowMissionTitle(true);
          setTimeout(() => {
            setShowMissionTitle(false);
            setTimeout(() => {
              setFadeToBlack(false);
              void transitionToScene(SCENE_IDS.SHOWER_MISSION);
            }, 500);
          }, 2000);
        }, 800);
      }

      if (roomId === "bathroom" && missionStarted) {
        void transitionToScene(SCENE_IDS.SHOWER_MISSION);
      }

      if (roomId === "kitchen") {
        void transitionToScene(SCENE_IDS.KITCHEN);
      }

      if (roomId === "study" && mission2Started) {
        setFadeToBlack(true);
        setTimeout(() => {
          setCurrentMissionNumber(2);
          setShowMissionTitle(true);
          setTimeout(() => {
            setShowMissionTitle(false);
            setTimeout(() => {
              setFadeToBlack(false);
              void transitionToScene(SCENE_IDS.WIFI_MISSION);
            }, 500);
          }, 2000);
        }, 800);
      }

      if (roomId === "living" && completedMissions.includes("mission-2")) {
        if (lightingToolsCollected) {
          void transitionToScene(SCENE_IDS.LIGHTING_MISSION);
        } else {
          setFadeToBlack(true);
          setTimeout(() => {
            setCurrentMissionNumber(3);
            setShowMissionTitle(true);
            setTimeout(() => {
              setShowMissionTitle(false);
              setTimeout(() => {
                setFadeToBlack(false);
                void transitionToScene(SCENE_IDS.LIGHTING_MISSION);
              }, 500);
            }, 2000);
          }, 800);
        }
      }
    },
    [playerCanMove, play, missionStarted, transitionToScene, lockedRooms, needTools, hasVinegar, hasPlasticBag, addItem, lightingToolsCollected],
  );

  const handlePickTool = useCallback(
    (toolId: Parameters<typeof pickUpTool>[0]) => {
      pickUpTool(toolId);
      play("tool-pickup");
      closeToolbox();
      saveManager.save();
    },
    [pickUpTool, closeToolbox, play],
  );

  const activeCard = activeCardId ? cards.find((c) => c.id === activeCardId) ?? null : null;

  return (
    <div className="relative h-full w-full overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      >
        <Image
          src="/images/landing_page.png"
          alt="Apartment interior"
          fill
          className="object-cover"
          priority
          quality={100}
        />
      </motion.div>

      <motion.div
        className="pointer-events-none fixed inset-0 z-40"
        style={{
          background: `radial-gradient(circle 200px at ${mousePosition.x}px ${mousePosition.y}px, rgba(245,230,200,0.06) 0%, rgba(245,230,200,0.02) 40%, transparent 70%)`,
        }}
      />

      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.2) 100%)",
          }}
        />
      </div>

      

      {(Object.keys(APARTMENT_ROOMS) as RoomId[]).filter(roomId => roomId !== "shower").map((roomId, index) => (
        <RoomLabel
          key={`label-${roomId}`}
          roomId={roomId}
          isLocked={lockedRooms.includes(roomId)}
          visible={showLabels}
          delay={index * 0.15}
          isCompleted={(roomId === "bathroom" && completedMissions.includes("mission-1")) || (roomId === "study" && completedMissions.includes("mission-2")) || (roomId === "living" && completedMissions.includes("mission-3"))}
        />
      ))}

      {(Object.keys(APARTMENT_ROOMS) as RoomId[]).map((roomId) => (
        <RoomHotspot
          key={`hotspot-${roomId}`}
          roomId={roomId}
          isLocked={lockedRooms.includes(roomId)}
          onClick={() => handleRoomClick(roomId)}
        />
      ))}

      <motion.button
        type="button"
        onClick={() => {
          if (isToolboxLocked) {
            setShowToolboxLockedHint(true);
            setTimeout(() => setShowToolboxLockedHint(false), 2000);
          } else {
            openToolbox();
          }
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showLabels ? 1 : 0, y: showLabels ? 0 : 20 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className={`absolute left-[45%] top-[70%] z-20 flex flex-col items-center transition-transform ${
          isToolboxLocked ? "cursor-not-allowed opacity-70" : "hover:scale-105"
        }`}
        style={{
          animation: showLabels && !isToolboxLocked ? "pulse-glow 2s infinite" : "none",
        }}
      >
        <div
          className={`relative w-20 h-14 rounded-lg shadow-lg ${
            isToolboxLocked ? "bg-[#3d2e1f] border-2 border-[#2d1f14]" : "bg-[#5d4a37] border-2 border-[#3d2e1f]"
          }`}
        >
          <div className={`absolute inset-1 rounded-md ${isToolboxLocked ? "bg-[#2d1f14]" : "bg-[#4a3a2a]"}`} />
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#3d2e1f] rounded" />
          <div className="absolute top-4 left-2 w-3 h-3 bg-[#8b755c] rounded" />
          <div className="absolute top-4 right-2 w-3 h-3 bg-[#8b755c] rounded" />
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-6 h-1 bg-[#3d2e1f] rounded" />
          {isToolboxLocked && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white/60 text-xl">🔒</span>
            </div>
          )}
        </div>
        <span 
          className={`font-game-sans mt-2 block text-center text-xs uppercase tracking-widest ${
            isToolboxLocked ? "text-cream-100/50" : "text-cream-100 opacity-90"
          }`}
          style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
        >
          工具箱
        </span>
      </motion.button>

      <motion.button
        type="button"
        onClick={() => openNotebook()}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: showLabels ? 1 : 0, x: showLabels ? 0 : 20 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="absolute right-4 top-4 z-30 flex flex-col items-center hover:scale-110 transition-transform"
      >
        <div className="w-12 h-12 bg-[#f5e6d3] border-2 border-[#dcc4a0] rounded-lg shadow-lg flex items-center justify-center">
          <span className="text-[#5d4a37] font-game-serif text-xl">📖</span>
        </div>
        <span className="font-game-sans mt-1 block text-center text-[10px] uppercase tracking-widest text-cream-100 opacity-90">
          Notebook
        </span>
      </motion.button>

      <SettingsButton onClick={() => setShowSettings(true)} />

      <motion.button
        type="button"
        onClick={() => {
          play("ui-confirm");
          setShowLetter(true);
          setLetterAutoShown(true);
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute right-4 top-36 z-30 flex flex-col items-center hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="信件"
      >
        <div className="w-12 h-12 bg-[#f5e6d3] border-2 border-[#dcc4a0] rounded-lg shadow-lg flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#5d4a37"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <path d="M3 10h18" />
            <path d="M3 14h18" />
            <path d="M3 18h18" />
          </svg>
        </div>
        <span className="font-game-sans mt-1 block text-center text-[10px] uppercase tracking-widest text-cream-100 opacity-90">
          Letter
        </span>
      </motion.button>

      <motion.button
        type="button"
        onClick={() => {
          play("ui-confirm");
          void transitionToScene(SCENE_IDS.GAME_HOMEPAGE);
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute right-4 top-52 z-30 flex flex-col items-center hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="返回主页"
      >
        <div className="w-12 h-12 bg-[#f5e6d3] border-2 border-[#dcc4a0] rounded-lg shadow-lg flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#5d4a37"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
        <span className="font-game-sans mt-1 block text-center text-[10px] uppercase tracking-widest text-cream-100 opacity-90">
          Home
        </span>
      </motion.button>

      <DustParticles count={15} className="opacity-40" />

      <TypewriterSubtitle text={subtitle} />

      <MissionObjective
        objective={""}
        visible={missionStarted && !missionComplete}
        phase="Mission"
      />

      <InventoryPanel
        items={items}
        heldItem={heldItem}
        visible={items.length > 0}
        onSelectItem={selectHeldItem}
      />

      {hasVinegar && hasPlasticBag && !inventoryHintShown && !mission2Started && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute bottom-32 right-8 z-30 max-w-xs"
        >
          <div className="bg-[#f5e6d3] rounded-xl shadow-2xl p-4 relative">
            <div className="border-b border-[#dcc4a0] pb-2 mb-2">
              <span className="text-sm text-gray-500 uppercase tracking-wider">提示</span>
            </div>
            <p className="text-gray-800 text-sm">已收集的工具和物品在右边哦~</p>
            <button
              type="button"
              onClick={() => setInventoryHintShown(true)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-[#5d4a37] text-white rounded-full text-xs hover:bg-[#4a3a2a] transition-colors"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}

      {hasVinegar && hasPlasticBag && missionStarted && !missionComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute inset-x-0 bottom-28 z-30 flex justify-center px-8"
        >
          <div className="max-w-lg bg-[#f5e6d3] rounded-xl shadow-2xl p-4 relative">
            <div className="border-b border-[#dcc4a0] pb-2 mb-2">
              <span className="text-sm text-gray-500 uppercase tracking-wider">提示</span>
            </div>
            <p className="text-gray-800 text-lg font-semibold">回到浴室吧~</p>
          </div>
        </motion.div>
      )}

      {mission2Started && !completedMissions.includes("mission-2") && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute inset-x-0 bottom-28 z-30 flex justify-center px-8"
        >
          <div className="max-w-lg bg-[#f5e6d3] rounded-xl shadow-2xl p-4 relative">
            <div className="border-b border-[#dcc4a0] pb-2 mb-2">
              <span className="text-sm text-gray-500 uppercase tracking-wider">提示</span>
            </div>
            <p className="text-gray-800 text-lg font-semibold">洗完澡看会手机，先去书房连接下wifi吧~</p>
          </div>
        </motion.div>
      )}

      {completedMissions.includes("mission-2") && !completedMissions.includes("mission-3") && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute inset-x-0 bottom-28 z-30 flex justify-center px-8"
        >
          <div className="max-w-lg bg-[#f5e6d3] rounded-xl shadow-2xl p-4 relative">
            <div className="border-b border-[#dcc4a0] pb-2 mb-2">
              <span className="text-sm text-gray-500 uppercase tracking-wider">提示</span>
            </div>
            <p className="text-gray-800 text-lg font-semibold">去客厅坐坐吧~</p>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {showToolboxLockedHint && (
          <motion.div
            key="toolbox-locked-hint"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <motion.div
              className="bg-[#f5e6d3] rounded-xl shadow-2xl p-6 max-w-sm mx-4"
              style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
            >
              <div className="text-center">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="font-game-serif text-xl text-[#5d4a37] mb-2">工具箱已锁定</h3>
                <p className="text-gray-600 text-sm">完成 Mission 2 后才能解锁工具箱哦~</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Toolbox
        open={toolboxOpen}
        onClose={closeToolbox}
        onPickTool={handlePickTool}
        collectedTools={items}
      />

      <FailureHint hint={lastFailureHint} onDismiss={clearFailureHint} />

      <KnowledgeNotebook
        open={notebookOpen}
        card={activeCard}
        onClose={closeNotebook}
      />

      <AnimatePresence>
        {fadeToBlack && (
          <motion.div
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1.1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 z-50 bg-black"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMissionTitle && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 1.05 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
          >
            <p className="font-game-sans text-lg md:text-xl uppercase tracking-[0.3em] text-cream-200/60 mb-6">
              Mission {currentMissionNumber}
            </p>
            <h2 className="font-game-serif text-6xl md:text-8xl tracking-[0.2em] text-cream-100">
              {currentMissionNumber === 1 ? "Bathroom" : currentMissionNumber === 2 ? "Study" : "Living Room"}
            </h2>
            <p className="font-game-sans text-lg md:text-xl uppercase tracking-[0.2em] text-cream-200/60 mt-4">
              {currentMissionNumber === 1 ? "- Shower -" : currentMissionNumber === 2 ? "- Router -" : "- Lighting -"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <SettingsPanel open={showSettings} onClose={() => setShowSettings(false)} />

      <LetterModal 
        isOpen={showLetter} 
        onClose={() => {
          setShowLetter(false);
          setIsLetterAutoOpen(false);
        }}
        autoOpen={isLetterAutoOpen}
      />
    </div>
  );
}
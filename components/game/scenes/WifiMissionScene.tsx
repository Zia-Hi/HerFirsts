"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home } from "lucide-react";
import Image from "next/image";
import { useSceneTransition } from "@/hooks/useSceneTransition";
import { useGameAudio } from "@/hooks/useGameAudio";
import { SCENE_IDS } from "@/lib/game";
import { useGameStore, useMissionStore, useKnowledgeStore, saveManager } from "@/store";
import { ConfirmDialog } from "@/components/game/ui";

type WifiPhase = 
  | "start"
  | "connected-but-no-internet"
  | "try-another-app"
  | "router-problem"
  | "show-ports"
  | "explain-issue"
  | "move-cable"
  | "cable-moving"
  | "cable-moved"
  | "test-connection"
  | "success";

interface Hotspot {
  id: string;
  x: number;
  y: number;
  label: string;
  description: string;
}

export function WifiMissionScene() {
  const [phase, setPhase] = useState<WifiPhase>("connected-but-no-internet");
  const [currentImage, setCurrentImage] = useState(1);
  const [showDialog, setShowDialog] = useState<string | null>(null);
  const [showButton, setShowButton] = useState(false);
  const [buttonText, setButtonText] = useState("");
  const [showHotspots, setShowHotspots] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [viewedHotspots, setViewedHotspots] = useState<string[]>([]);
  const [showCableCircle, setShowCableCircle] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [fadeToBlack, setFadeToBlack] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const WIFI_REPAIR_STEPS = [
    { id: "check-ports", name: "检查路由器接口" },
    { id: "identify-ports", name: "识别WAN/LAN口" },
    { id: "move-cable", name: "移动网线到WAN口" },
    { id: "test-connection", name: "测试连接" },
  ];

  const { transitionToScene } = useSceneTransition();
  const { play } = useGameAudio();
  const setMission2Started = useGameStore((s) => s.setMission2Started);
  const addCompletedMission = useGameStore((s) => s.addCompletedMission);
  const completeMission = useMissionStore((s) => s.completeMission);
  const unlockWifiCard = useKnowledgeStore((s) => s.unlockWifiCard);

  const hotspots = useMemo<Hotspot[]>(() => [
    {
      id: "lan",
      x: 25,
      y: 55,
      label: "LAN",
      description: "黄色口是LAN口，用于连接电脑或机顶盒"
    },
    {
      id: "wan",
      x: 52,
      y: 55,
      label: "WAN",
      description: "蓝色口是WAN口，用于连接宽带网线"
    }
  ], []);

  useEffect(() => {
    if (phase === "connected-but-no-internet") {
      play("mission-start", 0.5);
      
      setTimeout(() => {
        setShowDialog("咦，明明连上wifi了，为什么上不了网呢？");
        setShowButton(true);
        setButtonText("换个APP试试");
      }, 2000);
    }

    if (phase === "explain-issue") {
      setShowDialog("原来是网线插在LAN上了~");
      setShowButton(true);
      setButtonText("移至WAN上");
      setShowCableCircle(true);
      setCompletedSteps((prev) => [...new Set([...prev, "identify-ports"])]);
    }
  }, [play, phase]);

  const handleButtonClick = useCallback(() => {
    play("ui-confirm");
    setShowButton(false);
    
    switch (phase) {
      case "connected-but-no-internet":
        setPhase("try-another-app");
        setTimeout(() => {
          setShowDialog("还是上不了网呢，看来是路由器出问题了");
        }, 500);
        setTimeout(() => {
          setPhase("router-problem");
          setShowDialog(null);
          setCurrentImage(5);
          setTimeout(() => {
            setCurrentImage(7);
            setTimeout(() => {
              setShowHotspots(true);
              setShowDialog("点击黄点查看接口说明");
              setCompletedSteps((prev) => [...new Set([...prev, "check-ports"])]);
            }, 1000);
          }, 2500);
        }, 2000);
        break;
        
      case "explain-issue":
        setPhase("move-cable");
        break;
        
      case "move-cable":
        setPhase("cable-moving");
        setShowButton(false);
        setShowCableCircle(false);
        setShowDialog(null);
        play("tool-pickup");
        setTimeout(() => {
          setCurrentImage(2);
          setTimeout(() => {
            setCurrentImage(3);
            setTimeout(() => {
              setCurrentImage(4);
              setTimeout(() => {
                setPhase("cable-moved");
                setShowDialog("好像成功了！再上网试一下吧~");
                setShowButton(true);
                setButtonText("重新上网");
                setCompletedSteps((prev) => [...new Set([...prev, "move-cable"])]);
              }, 800);
            }, 1500);
          }, 1500);
        }, 800);
        break;
        
      case "cable-moved":
        setPhase("test-connection");
        setShowButton(false);
        setTimeout(() => {
          setCurrentImage(6);
          setTimeout(() => {
            setPhase("success");
            setShowDialog("成功啦！WiFi正常啦~");
            addCompletedMission("mission-2");
            unlockWifiCard();
            completeMission();
            saveManager.save();
            setCompletedSteps((prev) => [...new Set([...prev, "test-connection"])]);
            
            setTimeout(() => {
              setShowButton(true);
              setButtonText("完成");
            }, 2000);
          }, 500);
        }, 1500);
        break;
        
      case "success":
        setFadeToBlack(true);
        setTimeout(() => {
          void transitionToScene(SCENE_IDS.WIFI_MISSION_COMPLETED);
        }, 800);
        break;
    }
  }, [phase, play, addCompletedMission, unlockWifiCard, completeMission, transitionToScene, setMission2Started]);

  const handleHotspotClick = useCallback((hotspotId: string) => {
    play("ui-confirm");
    const hotspot = hotspots.find((h) => h.id === hotspotId);
    if (hotspot) {
      setActiveHotspot(hotspotId);
      setShowDialog(hotspot.description);
      
      setViewedHotspots((prev) => {
        if (!prev.includes(hotspotId)) {
          const newViewed = [...prev, hotspotId];
          setTimeout(() => {
            setActiveHotspot(null);
          }, 1000);
          if (newViewed.length === hotspots.length) {
            setTimeout(() => {
              setActiveHotspot(null);
            }, 1000);
            setTimeout(() => {
              setPhase("explain-issue");
              setShowHotspots(false);
              setViewedHotspots([]);
            }, 2000);
          }
          return newViewed;
        }
        return prev;
      });
    }
  }, [play, hotspots]);

  const handleBackToMenu = useCallback(async () => {
    setShowExitConfirm(true);
  }, []);

  const handleConfirmExit = useCallback(async () => {
    setShowExitConfirm(false);
    await transitionToScene(SCENE_IDS.OPENING);
  }, [transitionToScene]);

  const getImageSrc = () => {
    return `/images/wifi/wifi_${currentImage}.jpg`;
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <AnimatePresence>
        <motion.div
          key={currentImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={getImageSrc()}
            alt="WiFi"
            fill
            className="object-cover"
            quality={100}
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute left-4 top-4 z-30">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4">
          <div className="text-white/80 text-lg mb-2 font-bold">问题</div>
          <div className="text-white text-xl">路由器好像出问题了...</div>
        </div>
      </div>

      <div className="absolute left-4 bottom-20 z-30">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 space-y-3">
          {WIFI_REPAIR_STEPS.map((step) => {
            const isCompleted = completedSteps.includes(step.id);
            const allCompleted = WIFI_REPAIR_STEPS.every((s) => completedSteps.includes(s.id));
            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 ${
                  isCompleted 
                    ? "text-white text-xl font-semibold" 
                    : "text-white/30 text-lg"
                } ${allCompleted ? "text-2xl" : ""}`}
              >
                <span className="text-xl">{isCompleted ? "✓" : "○"}</span>
                <span>{step.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {showHotspots && !activeHotspot && (
          <>
            {hotspots.map((hotspot) => (
              <motion.button
                key={hotspot.id}
                type="button"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: hotspots.indexOf(hotspot) * 0.2 }}
                onClick={() => handleHotspotClick(hotspot.id)}
                className="absolute z-20"
                style={{
                  left: `${hotspot.x}%`,
                  top: `${hotspot.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="w-8 h-8 bg-yellow-400 rounded-full border-2 border-yellow-200 shadow-lg flex items-center justify-center">
                  <span className="text-xs font-bold text-yellow-800">{hotspot.label}</span>
                </div>
              </motion.button>
            ))}
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCableCircle && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleButtonClick}
            className="absolute z-30"
            style={{
              left: "45%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <motion.div
              className="w-16 h-16 border-4 border-white rounded-full flex items-center justify-center"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDialog && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute inset-x-0 bottom-32 z-40 flex justify-center px-8"
          >
            <div className="max-w-lg bg-[#f5e6d3] rounded-xl shadow-2xl p-4 relative">
              <div className="border-b border-[#dcc4a0] pb-2 mb-2">
                <span className="text-sm text-gray-500 uppercase tracking-wider">提示</span>
              </div>
              <p className="text-gray-800 text-lg font-semibold">{showDialog}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showButton && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={handleButtonClick}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 px-12 py-4 bg-[#5d4a37] text-white text-xl font-serif tracking-[0.15em] uppercase hover:bg-[#4a3a2a] transition-colors rounded-full shadow-xl z-40"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {buttonText}
          </motion.button>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={handleBackToMenu}
        className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full text-white/70 text-sm hover:text-white hover:bg-black/60 transition-colors z-30 border border-white/20 flex items-center gap-1.5"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Home size={14} />
        返回主页
      </motion.button>

      <AnimatePresence>
        {fadeToBlack && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 bg-black"
            transition={{ duration: 0.8 }}
          />
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={showExitConfirm}
        title="退出关卡"
        message="确定要退出当前关卡吗？进度不会保存哦~"
        confirmText="确定退出"
        cancelText="继续游戏"
        onConfirm={handleConfirmExit}
        onCancel={() => setShowExitConfirm(false)}
      />
    </div>
  );
}
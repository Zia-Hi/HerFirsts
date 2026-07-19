"use client";

import { useCallback, useEffect, useState } from "react";
  import { motion, AnimatePresence } from "framer-motion";
  import { X, Home } from "lucide-react";
  import Image from "next/image";
  import {
    SHOWER_REPAIR_ORDER,
    SHOWER_PARTS,
    SCENE_IDS,
  } from "@/lib/game";
  import {
    useMissionStore,
    useInventoryStore,
    useKnowledgeStore,
    saveManager,
  } from "@/store";
  import { useSceneTransition } from "@/hooks/useSceneTransition";
  import { useGameAudio } from "@/hooks/useGameAudio";
  import { ConfirmDialog } from "@/components/game/ui";
  import type { ShowerPartId, ShowerRepairStep } from "@/types";

export function ShowerMissionScene() {
  const [activePart, setActivePart] = useState<ShowerPartId>(null);
  const [showPartCard, setShowPartCard] = useState(false);
  const [showHand, setShowHand] = useState(false);
  const [isRubbing, setIsRubbing] = useState(false);
  const [soakingProgress, setSoakingProgress] = useState(0);
  const [currentDialog, setCurrentDialog] = useState<string | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [showCompleteButton, setShowCompleteButton] = useState(false);
  const [fadeToBlack, setFadeToBlack] = useState(false);
  const [showStartPrompt, setShowStartPrompt] = useState(true);
  const [cameraZoom, setCameraZoom] = useState(1);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);

  const objective = useMissionStore((s) => s.objective);
  const completedSteps = useMissionStore((s) => s.completedSteps);
  const waterSpraying = useMissionStore((s) => s.waterSpraying);
  const waterFixed = useMissionStore((s) => s.waterFixed);
  const rubAttempts = useMissionStore((s) => s.rubAttempts);
  const lastFailureHint = useMissionStore((s) => s.lastFailureHint);
  const missionStarted = useMissionStore((s) => s.missionStarted);
  const repairPhase = useMissionStore((s) => s.repairPhase);
  const currentShowerImage = useMissionStore((s) => s.currentShowerImage);
  const usedVinegar = useMissionStore((s) => s.usedVinegar);
  const usedPlasticBag = useMissionStore((s) => s.usedPlasticBag);

  const attemptRepairStep = useMissionStore((s) => s.attemptRepairStep);
  const addRubAttempt = useMissionStore((s) => s.addRubAttempt);
  const completeMission = useMissionStore((s) => s.completeMission);
  const clearFailureHint = useMissionStore((s) => s.clearFailureHint);
  const setRepairPhase = useMissionStore((s) => s.setRepairPhase);
  const setCurrentShowerImage = useMissionStore((s) => s.setCurrentShowerImage);
  const setUsedVinegar = useMissionStore((s) => s.setUsedVinegar);
  const setUsedPlasticBag = useMissionStore((s) => s.setUsedPlasticBag);
  const setWaterSpraying = useMissionStore((s) => s.setWaterSpraying);
  const setWaterFixed = useMissionStore((s) => s.setWaterFixed);

  const items = useInventoryStore((s) => s.items);
  const removeItem = useInventoryStore((s) => s.removeItem);

  const unlockShowerCard = useKnowledgeStore((s) => s.unlockShowerCard);

  const startShowerMission = useMissionStore((s) => s.startShowerMission);
  const { transitionToScene } = useSceneTransition();
  const { play, stop } = useGameAudio();

  const nextStep = SHOWER_REPAIR_ORDER[completedSteps.length];
  const hasVinegar = items.some((item) => item.id === "vinegar");
  const hasPlasticBag = items.some((item) => item.id === "plastic-bag");

  useEffect(() => {
    play("ambient-bathroom", 0.3);
    if (!missionStarted) {
      startShowerMission();
    }
    return () => {
      stop("ambient-bathroom");
      stop("water-spray");
    };
  }, [play, stop, missionStarted, startShowerMission]);

  useEffect(() => {
    if (waterSpraying && !waterFixed && repairPhase === "idle") play("water-spray");
    else stop("water-spray");
  }, [waterSpraying, waterFixed, repairPhase, play, stop]);

  const showDialog = useCallback((text: string) => {
    setCurrentDialog(text);
    setDialogVisible(true);
  }, []);

  useEffect(() => {
    if (hasVinegar && hasPlasticBag && repairPhase === "collect") {
      setCurrentShowerImage(5);
      showDialog("请拿出刚刚拾取的塑料袋和白醋吧~");
      setRepairPhase("prepare");
    }
  }, [hasVinegar, hasPlasticBag, repairPhase, showDialog]);

  useEffect(() => {
    if (repairPhase !== "idle" && repairPhase !== "rub" && repairPhase !== "collect") {
      setShowStartPrompt(false);
    }
  }, [repairPhase]);

  useEffect(() => {
    if (repairPhase === "prepare" && usedVinegar && usedPlasticBag) {
      setTimeout(() => {
        setCurrentShowerImage(6);
        showDialog("将白醋倒入塑料袋中吧");
        setRepairPhase("pour-vinegar");
      }, 500);
    }
  }, [repairPhase, usedVinegar, usedPlasticBag, showDialog]);

  const hideDialog = useCallback(() => {
    setDialogVisible(false);
    setTimeout(() => setCurrentDialog(null), 500);
  }, []);

  const handleStartShower = useCallback(() => {
    setShowStartPrompt(false);
    play("ui-confirm");
    setTimeout(() => {
      setWaterSpraying(true);
      saveManager.save();
      
      setTimeout(() => {
        showDialog("花洒好像在漏水呢，试一下搓搓出水孔吧~");
        setRepairPhase("rub");
      }, 2000);
    }, 500);
  }, [play, setWaterSpraying, showDialog, setRepairPhase]);

  const handleInspectPart = useCallback((partId: ShowerPartId) => {
    if (!partId) return;
    setActivePart(partId);
    setShowPartCard(true);
    play("ui-confirm");
  }, [play]);

  const handleRubNozzle = useCallback(async () => {
    if (isRubbing) return;
    
    setIsRubbing(true);
    setShowHand(true);
    setCameraZoom(1.2);
    play("paper-rustle");

    await new Promise((resolve) => setTimeout(resolve, 500));
    setCurrentShowerImage(2);
    
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setCurrentShowerImage(3);
    
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setCurrentShowerImage(4);
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    addRubAttempt();
    saveManager.save();

    if (rubAttempts >= 1) {
      showDialog("水垢太顽固了，需要用白醋来浸泡一下...");
      setRepairPhase("collect");
    } else {
      showDialog("搓掉了一些水垢，但还是有点堵，再试一次吧...");
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    setCurrentShowerImage(1);

    setIsRubbing(false);
    setTimeout(() => {
      setShowHand(false);
      setCameraZoom(1);
    }, 500);
  }, [isRubbing, rubAttempts, addRubAttempt, showDialog, play]);

  const handleGoToKitchen = useCallback(async () => {
    await transitionToScene(SCENE_IDS.APARTMENT);
  }, [transitionToScene]);

  const handleUseTool = useCallback((toolId: string) => {
    if (repairPhase === "prepare") {
      const hasVinegar = items.some((item) => item.id === "vinegar");
      const hasPlasticBag = items.some((item) => item.id === "plastic-bag");
      
      if (toolId === "vinegar" && hasVinegar && !usedVinegar) {
        setUsedVinegar(true);
        play("ui-confirm");
      } else if (toolId === "plastic-bag" && hasPlasticBag && !usedPlasticBag) {
        setUsedPlasticBag(true);
        play("ui-confirm");
      }
    }
  }, [repairPhase, usedVinegar, usedPlasticBag, items, play]);

  const handlePourVinegar = useCallback(() => {
    if (repairPhase !== "pour-vinegar") return;
    
    play("water-pour");
    
    setTimeout(() => {
      showDialog("拆下花洒进行浸泡");
      setCurrentShowerImage(1);
      setRepairPhase("remove-head");
    }, 1500);
  }, [repairPhase, play, showDialog, setCurrentShowerImage, setRepairPhase]);

  const handleRemoveHead = useCallback(() => {
    if (repairPhase !== "remove-head") return;
    
    play("ui-confirm");
    setCurrentShowerImage(7);
    
    setTimeout(() => {
      showDialog("静置半个小时哦~");
      setCurrentShowerImage(8);
      setRepairPhase("soaking");
      
      play("clock-tick");
      
      const interval = setInterval(() => {
        setSoakingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });
      }, 150);

      setTimeout(() => {
        clearInterval(interval);
        stop("clock-tick");
        showDialog("处理结束啦，冲洗干净后，装上再试试吧！");
        setRepairPhase("reinstall");
        setSoakingProgress(0);
      }, 3000);
    }, 1000);
  }, [repairPhase, play, stop, showDialog, setCurrentShowerImage, setRepairPhase]);

  const handleReinstall = useCallback(() => {
    if (repairPhase !== "reinstall") return;
    
    play("ui-confirm");
    setCurrentShowerImage(1);
    setRepairPhase("test");
    showDialog("点击花洒试试吧！");
  }, [repairPhase, play, showDialog, setCurrentShowerImage, setRepairPhase]);

  const handleTest = useCallback(() => {
    if (repairPhase !== "test") return;
    
    play("water-spray");
    setWaterSpraying(true);
    
    setTimeout(() => {
      attemptRepairStep("soak-head");
      attemptRepairStep("rinse-head");
      saveManager.save();
      
      stop("water-spray");
      setWaterFixed(true);
      setWaterSpraying(false);
      setRepairPhase("success");
      play("mission-success");
      
      unlockShowerCard();
      saveManager.save();
      
      setTimeout(() => {
        showDialog("恭喜你！你成功修好了花洒！现在可以舒服地洗澡啦~");
        setTimeout(() => {
          setShowCompleteButton(true);
        }, 2000);
      }, 500);
    }, 2000);
  }, [repairPhase, play, stop, setWaterSpraying, setWaterFixed, attemptRepairStep, completeMission, unlockShowerCard, saveManager, showDialog, setRepairPhase]);

  const handleComplete = useCallback(() => {
    setFadeToBlack(true);
    setTimeout(() => {
      void transitionToScene(SCENE_IDS.MISSION_COMPLETED);
    }, 1000);
  }, [transitionToScene]);

  const handleExit = useCallback(async () => {
    setShowExitConfirm(true);
  }, []);

  const handleConfirmExit = useCallback(async () => {
    setShowExitConfirm(false);
    await transitionToScene(SCENE_IDS.APARTMENT);
  }, [transitionToScene]);

  const handleRemoveItem = useCallback((itemId: string) => {
    setItemToRemove(itemId);
    setShowRemoveConfirm(true);
  }, []);

  const handleConfirmRemove = useCallback(() => {
    if (itemToRemove) {
      removeItem(itemToRemove);
      play("ui-cancel");
      saveManager.save();
    }
    setShowRemoveConfirm(false);
    setItemToRemove(null);
  }, [itemToRemove, removeItem, play]);

  const handleBackToMenu = useCallback(async () => {
    await transitionToScene(SCENE_IDS.OPENING);
  }, [transitionToScene]);

  const getStepStatus = (step: ShowerRepairStep): "completed" | "current" | "locked" => {
    if (completedSteps.includes(step)) return "completed";
    
    if (repairPhase !== "idle") {
      if (step === "rub-nozzle" && repairPhase !== "rub") {
        return "completed";
      }
      
      if (step === "find-vinegar") {
        if (repairPhase === "collect" && !hasVinegar) {
          return "current";
        }
        if (repairPhase !== "rub") {
          return "completed";
        }
      }
      
      if (step === "soak-head" && (repairPhase === "soaking" || repairPhase === "reinstall" || repairPhase === "test" || repairPhase === "success")) {
        return "completed";
      }
      
      if (step === "rinse-head" && (repairPhase === "reinstall" || repairPhase === "test" || repairPhase === "success")) {
        return "completed";
      }
      
      if (nextStep === step) return "current";
    }
    
    return "locked";
  };

  const isShowerClickable = showStartPrompt || (waterSpraying && !waterFixed && repairPhase === "idle");

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#2d3436]">
      <motion.div
        className="absolute inset-0 bg-black z-50 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: fadeToBlack ? 1 : 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0"
        animate={{ scale: cameraZoom }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="relative h-full w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentShowerImage}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={`/images/shower/shower_${currentShowerImage}.jpg`}
                alt="Bathroom first person view"
                fill
                className="object-cover"
                quality={100}
              />
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: waterFixed 
              ? "none"
              : "radial-gradient(circle at 50% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)",
          }}
        />
      </motion.div>

      {waterSpraying && !waterFixed && repairPhase === "idle" && (
        <div className="absolute left-1/2 top-[35%] -translate-x-1/2 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 rounded-full bg-white/40"
              style={{
                left: `${(i - 7) * 8 + Math.random() * 10}px`,
                top: 0,
                height: 30 + Math.random() * 50,
                transform: `rotate(${Math.random() * 60 - 30}deg)`,
              }}
              animate={{
                opacity: [0.2, 0.6, 0.2],
                y: [0, 80 + Math.random() * 60, 160],
                x: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 60],
              }}
              transition={{
                duration: 0.6 + Math.random() * 0.4,
                repeat: Infinity,
                delay: i * 0.05,
                ease: "easeIn",
              }}
            />
          ))}
        </div>
      )}

      {waterFixed && (
        <div className="absolute left-1/2 top-[35%] -translate-x-1/2 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/70"
              style={{
                left: `${(i - 15) * 4 + Math.random() * 8}px`,
                top: 0,
                width: 1 + Math.random() * 3,
                height: 60 + Math.random() * 80,
              }}
              animate={{
                opacity: [0.3, 0.9, 0.3],
                y: [0, 180],
              }}
              transition={{
                duration: 0.5 + Math.random() * 0.3,
                repeat: Infinity,
                delay: i * 0.02 + Math.random() * 0.2,
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}

      {showHand && (
        <motion.div
          className="absolute left-[15%] top-[75%] z-20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="h-24 w-20 rounded-full bg-white/30 border-2 border-white/50"
            animate={isRubbing ? {
              rotate: [-15, 15, -15],
              x: [-10, 10, -10],
            } : {}}
            transition={isRubbing ? { duration: 0.3, repeat: Infinity, ease: "easeInOut" } : {}}
          />
        </motion.div>
      )}

      {repairPhase === "idle" && (
        <>
          <div className="absolute left-[62%] top-[12%] z-10">
            <button
              type="button"
              onClick={() => handleInspectPart("shower-head")}
              className="relative group"
            >
              <motion.div
                className="w-4 h-4 rounded-full bg-yellow-400/60"
                animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap">
                <div className="px-3 py-2 bg-[#f5e6d3] text-gray-800 text-sm rounded-lg shadow-lg">点击查看装置</div>
              </div>
            </button>
          </div>

          <div className="absolute left-[15%] top-[55%] z-10">
            <button
              type="button"
              onClick={() => handleInspectPart("water-valve")}
              className="relative group"
            >
              <motion.div
                className="w-4 h-4 rounded-full bg-yellow-400/60"
                animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                <div className="px-2 py-1 bg-black/70 text-white text-xs rounded">水阀</div>
              </div>
            </button>
          </div>

          <div className="absolute left-[5%] top-[65%] z-10">
            <button
              type="button"
              onClick={() => handleInspectPart("hose")}
              className="relative group"
            >
              <motion.div
                className="w-4 h-4 rounded-full bg-yellow-400/60"
                animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              />
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                <div className="px-2 py-1 bg-black/70 text-white text-xs rounded">软管</div>
              </div>
            </button>
          </div>
        </>
      )}

      <AnimatePresence>
        {showPartCard && activePart && SHOWER_PARTS[activePart] && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPartCard(false)}
          >
            <motion.div
              className="relative w-80 h-64 cursor-pointer"
              initial={{ scale: 0.8, rotateY: -90 }}
              animate={{ scale: 1, rotateY: 0 }}
              exit={{ scale: 0.8, rotateY: 90 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{ transformStyle: "preserve-3d" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-0 rounded-xl bg-[#f5e6d3] shadow-2xl p-6" style={{ backfaceVisibility: "hidden" }}>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{SHOWER_PARTS[activePart].name}</h3>
                <p className="text-gray-600 text-sm mb-4">{SHOWER_PARTS[activePart].description}</p>
                <div className="mt-auto">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">功能</span>
                  <p className="text-gray-700 text-sm">{SHOWER_PARTS[activePart].function}</p>
                </div>
                <div className="absolute bottom-4 right-4 text-xs text-gray-400">点击翻转</div>
              </div>
              <div className="absolute inset-0 rounded-xl bg-[#e8d5b7] shadow-2xl p-6 flex items-center justify-center" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                <div className="text-center">
                  <div className="text-4xl mb-4">🔧</div>
                  <p className="text-gray-700 text-sm">
                    {activePart === "nozzle" || activePart === "shower-head"
                      ? "水垢会堵塞这些小孔。用手指搓洗或用白醋浸泡！"
                      : "这个零件连接着供水系统。"}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute right-4 top-4 bottom-4 w-28 bg-black/40 backdrop-blur-sm rounded-lg flex flex-col gap-4 p-4 z-30">
        <span className="text-white/60 text-sm uppercase tracking-wider text-center">工具</span>
        {items.map((item) => {
          const isUsed = (item.id === "vinegar" && usedVinegar) || (item.id === "plastic-bag" && usedPlasticBag);
          return (
            <motion.div
              key={item.id}
              className="relative group"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <button
                type="button"
                onClick={() => handleUseTool(item.id)}
                disabled={isUsed || repairPhase !== "prepare"}
                className={`w-full aspect-square rounded-xl flex items-center justify-center transition-all ${
                  isUsed 
                    ? "bg-gray-500/30 cursor-not-allowed" 
                    : repairPhase === "prepare"
                    ? "bg-[#5d4a37]/60 hover:bg-[#5d4a37] cursor-pointer"
                    : "bg-white/10 cursor-not-allowed"
                }`}
              >
                {item.id === "vinegar" ? (
                  <Image
                    src="/images/shower/vinegar.png"
                    alt="白醋"
                    width={40}
                    height={40}
                    className={`w-10 h-10 object-contain ${isUsed ? "opacity-40" : "opacity-100"}`}
                  />
                ) : item.id === "plastic-bag" ? (
                  <Image
                    src="/images/shower/plastic_bag.png"
                    alt="塑料袋"
                    width={40}
                    height={40}
                    className={`w-10 h-10 object-contain ${isUsed ? "opacity-40" : "opacity-100"}`}
                  />
                ) : (
                  <span className={`text-8xl ${isUsed ? "opacity-40" : "opacity-100"}`}>📦</span>
                )}
              </button>
              {isUsed && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white/80 text-lg font-bold">✓</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => handleRemoveItem(item.id)}
                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={10} className="text-white" />
              </button>
            </motion.div>
          );
        })}
        {items.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <span className="text-white/30 text-[10px]">空</span>
          </div>
        )}
      </div>

      <div className="absolute left-4 top-4 z-30">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4">
          <div className="text-white/80 text-lg mb-2 font-bold">问题</div>
          <div className="text-white text-xl">{objective}</div>
        </div>
      </div>

      {repairPhase === "soaking" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40"
        >
          <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 text-center">
            <p className="text-white/80 text-sm mb-4">浸泡中...</p>
            <div className="w-48 h-3 bg-gray-600 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#5d4a37]"
                initial={{ width: 0 }}
                animate={{ width: `${soakingProgress}%` }}
                transition={{ duration: 0.15 }}
              />
            </div>
            <p className="text-white/60 text-xs mt-2">{soakingProgress}%</p>
          </div>
        </motion.div>
      )}

      <div className="absolute left-4 bottom-20 z-30">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 space-y-3">
          {SHOWER_REPAIR_ORDER.map((step) => {
            const status = getStepStatus(step);
            const stepNames: Record<ShowerRepairStep, string> = {
              "rub-nozzle": "搓洗出水孔",
              "find-vinegar": "获取白醋",
              "soak-head": "白醋浸泡",
              "rinse-head": "冲洗干净",
            };
            const allCompleted = SHOWER_REPAIR_ORDER.every(s => getStepStatus(s) === "completed");
            return (
              <div
                key={step}
                className={`flex items-center gap-3 ${
                  status === "completed" 
                    ? "text-white text-xl font-semibold" 
                    : status === "current" 
                      ? "text-white text-lg" 
                      : "text-white/30 text-lg"
                } ${allCompleted ? "text-2xl" : ""}`}
              >
                <span className="text-xl">{status === "completed" ? "✓" : status === "current" ? "●" : "○"}</span>
                <span>{stepNames[step]}</span>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {dialogVisible && currentDialog && !isRubbing && (
          <motion.div
            className="absolute inset-x-0 bottom-28 z-30 flex justify-center px-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="max-w-lg bg-[#f5e6d3] rounded-xl shadow-2xl p-6 relative">
              <div className="border-b border-[#dcc4a0] pb-3 mb-3">
                <span className="text-sm text-gray-500 uppercase tracking-wider">提示</span>
              </div>
              <p className="text-gray-800 text-lg font-serif leading-relaxed">{currentDialog}</p>
              <button
                type="button"
                onClick={hideDialog}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-sm"
              >
                [关闭]
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCompleteButton && (
          <motion.div
            className="absolute inset-x-0 bottom-28 z-30 flex flex-col items-center px-8 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="max-w-lg bg-[#f5e6d3] rounded-xl shadow-2xl p-6 relative">
              <div className="border-b border-[#dcc4a0] pb-3 mb-3">
                <span className="text-sm text-gray-500 uppercase tracking-wider">提示</span>
              </div>
              <p className="text-gray-800 text-lg font-serif leading-relaxed">打开花洒，开始洗澡吧~</p>
            </div>
            <motion.button
              type="button"
              onClick={handleComplete}
              className="px-10 py-4 bg-[#5d4a37] text-white text-xl font-semibold hover:bg-[#4a3a2a] transition-colors rounded-full shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              完成
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => {
          if (showStartPrompt) {
            handleStartShower();
          } else if (waterSpraying && repairPhase === "idle") {
            setRepairPhase("rub");
          } else if (repairPhase === "rub") {
            handleRubNozzle();
          } else if (repairPhase === "pour-vinegar") {
            handlePourVinegar();
          } else if (repairPhase === "remove-head") {
            handleRemoveHead();
          } else if (repairPhase === "reinstall") {
            handleReinstall();
          } else if (repairPhase === "test") {
            handleTest();
          }
        }}
        disabled={isRubbing}
        className={`absolute -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full z-20 transition-all duration-200 ${
          showStartPrompt || 
          (waterSpraying && repairPhase === "idle") || 
          repairPhase === "pour-vinegar" ||
          repairPhase === "remove-head" ||
          repairPhase === "reinstall" ||
          repairPhase === "test"
            ? "bg-white/20 hover:bg-white/30 hover:scale-110 active:scale-95 cursor-pointer border-2 border-white/40"
            : "bg-transparent cursor-default"
        }`}
        style={{
          left: currentShowerImage === 8 ? "55%" : "50%",
          top: currentShowerImage === 8 ? "45%" : "14%",
          boxShadow: showStartPrompt || 
            repairPhase === "pour-vinegar" || 
            repairPhase === "remove-head" ||
            repairPhase === "reinstall" ||
            repairPhase === "test"
            ? "0 0 20px rgba(255,255,255,0.3)" : "none",
          animation: showStartPrompt ||
            repairPhase === "pour-vinegar" || 
            repairPhase === "remove-head" ||
            repairPhase === "reinstall" ||
            repairPhase === "test"
            ? "pulse-glow 2s infinite" : "none",
        }}
      />

      {repairPhase === "rub" && !isShowerClickable && !isRubbing && (
        <>
          <button
            type="button"
            onClick={handleRubNozzle}
            disabled={isRubbing}
            className="absolute left-1/2 bottom-52 -translate-x-1/2 px-8 py-4 bg-[#5d4a37] text-white text-lg font-semibold hover:bg-[#4a3a2a] transition-all z-40 rounded-full shadow-lg hover:scale-105 active:scale-95"
          >
            搓洗出水孔
          </button>
        </>
      )}

      {repairPhase === "collect" && (
        <button
          type="button"
          onClick={handleGoToKitchen}
          className="absolute left-1/2 bottom-52 -translate-x-1/2 px-8 py-4 bg-[#5d4a37] text-white text-lg font-semibold hover:bg-[#4a3a2a] transition-colors z-40 rounded-full shadow-lg hover:scale-105 active:scale-95"
        >
          去厨房拿工具
        </button>
      )}

      <div className="absolute bottom-4 left-4 flex gap-2 z-30">
        <motion.button
          type="button"
          onClick={handleBackToMenu}
          className="px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full text-white/70 text-sm hover:text-white hover:bg-black/60 transition-colors border border-white/20 flex items-center gap-1.5"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Home size={14} />
          返回主页
        </motion.button>
        <motion.button
          type="button"
          onClick={handleExit}
          className="px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full text-white/70 text-sm hover:text-white hover:bg-black/60 transition-colors border border-white/20"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          离开浴室
        </motion.button>
      </div>

      {lastFailureHint && (
        <motion.div
          className="absolute top-20 left-1/2 -translate-x-1/2 bg-red-500/80 text-white px-4 py-2 rounded-lg text-sm z-50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {lastFailureHint}
          <button
            type="button"
            onClick={clearFailureHint}
            className="ml-2 text-white/70 hover:text-white"
          >
            [x]
          </button>
        </motion.div>
      )}

      <ConfirmDialog
        open={showExitConfirm}
        title="退出关卡"
        message="确定要退出当前关卡吗？进度不会保存哦~"
        confirmText="确定退出"
        cancelText="继续游戏"
        onConfirm={handleConfirmExit}
        onCancel={() => setShowExitConfirm(false)}
      />

      <ConfirmDialog
        open={showRemoveConfirm}
        title="确认丢弃"
        message="确定要丢弃这个工具吗？丢弃后将无法找回哦~"
        confirmText="确认丢弃"
        cancelText="保留工具"
        onConfirm={handleConfirmRemove}
        onCancel={() => setShowRemoveConfirm(false)}
      />
    </div>
  );
}
"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home } from "lucide-react";
import Image from "next/image";
import { SCENE_IDS } from "@/lib/game";
import { useGameStore, useInventoryStore, useKnowledgeStore, saveManager } from "@/store";
import { useSceneTransition } from "@/hooks/useSceneTransition";
import { useGameAudio } from "@/hooks/useGameAudio";
import { ConfirmDialog } from "@/components/game/ui";
import type { LightingPhaseType } from "@/types";

const LIGHTING_TOOLS = [
  { id: "ladder", name: "人字梯", image: "/images/lighting/tizi.jpg" },
  { id: "voltage-pen", name: "数显测电笔", image: "/images/lighting/cedianbi.jpg" },
  { id: "screwdriver", name: "十字螺丝刀", image: "/images/lighting/luosidao.jpg" },
  { id: "storage-box", name: "小零件收纳盒", image: "/images/lighting/shounahe.jpg" },
  { id: "led-board", name: "全新LED灯珠板", image: "/images/lighting/dengzhuban.jpg" },
];

export function LightingMissionScene() {
  const [phase, setPhase] = useState<LightingPhaseType>("idle");
  const [currentImage, setCurrentImage] = useState<number | string>(1);
  const [showDialog, setShowDialog] = useState<string | null>(null);
  const [showButton, setShowButton] = useState(false);
  const [buttonText, setButtonText] = useState("");
  const [showToolbox, setShowToolbox] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const [ladderPlaced, setLadderPlaced] = useState(false);
  const [voltageTested, setVoltageTested] = useState(false);
  const [powerOffVerified, setPowerOffVerified] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [fadeToBlack, setFadeToBlack] = useState(false);
  const [draggedTool, setDraggedTool] = useState<string | null>(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [snappedLampPositions, setSnappedLampPositions] = useState<number[]>([]);
  const [screwsCollected, setScrewsCollected] = useState<number[]>([]);
  const [totalScrews, setTotalScrews] = useState(4);

  const screwPositions = [
    { x: 25, y: 35 },
    { x: 75, y: 35 },
    { x: 25, y: 65 },
    { x: 75, y: 65 },
  ];

  const dragRef = useRef<{ startX: number; startY: number; offsetX: number; offsetY: number } | null>(null);

  const { transitionToScene } = useSceneTransition();
  const { play } = useGameAudio();
  const addCompletedMission = useGameStore((s) => s.addCompletedMission);
  const lightingToolsCollected = useGameStore((s) => s.lightingToolsCollected);
  const lightingPrecautionShown = useGameStore((s) => s.lightingPrecautionShown);
  const setLightingPrecautionShown = useGameStore((s) => s.setLightingPrecautionShown);
  const unlockLightingCard = useKnowledgeStore((s) => s.unlockLightingCard);

  const items = useInventoryStore((s) => s.items);
  const addItem = useInventoryStore((s) => s.addItem);
  const removeItem = useInventoryStore((s) => s.removeItem);

  const hasAllTools = LIGHTING_TOOLS.every((tool) => items.some((item) => item.id === tool.id));
  const hasTool = (toolId: string) => items.some((item) => item.id === toolId);

  useEffect(() => {
    play("ambient-apartment", 0.2);
  }, [play]);

  useEffect(() => {
    if (phase !== "idle") return;

    if (hasAllTools) {
      setTimeout(() => {
        setPhase("prepare-ladder");
      }, 500);
    } else if (lightingPrecautionShown) {
      setTimeout(() => {
        setPhase("check-power");
      }, 500);
    } else {
      setTimeout(() => {
        setPhase("precaution");
      }, 500);
    }
  }, [hasAllTools, lightingToolsCollected, lightingPrecautionShown]);

  useEffect(() => {
    if (phase !== "precaution") return;

    setTimeout(() => {
      setShowButton(true);
      setButtonText("我已了解");
    }, 500);
  }, [phase]);

  useEffect(() => {
    if (phase === "idle" || phase === "precaution") return;

    switch (phase) {
      case "check-power":
        setTimeout(() => {
          setShowDialog(null);
          setShowButton(true);
          setButtonText("看看邻居家");
        }, 2500);
        break;

      case "neighbor-check":
        setCurrentImage(1.5);
        setTimeout(() => {
          setShowDialog("邻居家的灯是亮着的，说明不是停电了");
          setTimeout(() => {
            setShowDialog("先去配电箱看看吧");
            setShowButton(true);
            setButtonText("去配电箱");
          }, 2000);
        }, 1000);
        break;

      case "circuit-box":
        setCurrentImage(4);
        setTimeout(() => {
          setShowDialog("照明回路的空气开关是合闸状态，没有跳闸");
          setTimeout(() => {
            setCurrentImage(5);
            setShowDialog("先拉下空开断电，安全第一！");
            setShowButton(true);
            setButtonText("拉下空开");
          }, 2000);
        }, 1500);
        break;

      case "power-off":
        setCurrentImage(6);
        setTimeout(() => {
          setCurrentImage(7);
          setTimeout(() => {
            setCurrentImage(8);
            setShowDialog("好的，电源已断开。现在去客厅工具箱拿维修工具吧");
            setShowButton(true);
            setButtonText("去客厅拿工具");
          }, 1000);
        }, 1000);
        break;

      case "collect-tools":
        setFadeToBlack(true);
        setTimeout(() => {
          void transitionToScene(SCENE_IDS.LIVING_ROOM_TOOLBOX);
        }, 800);
        break;

      case "tools-collected":
        setTimeout(() => {
          setShowDialog("工具收集完毕！返回客厅开始维修吧");
          setShowButton(true);
          setButtonText("返回客厅");
        }, 500);
        break;

      case "prepare-ladder":
        setCurrentImage(9);
        setLadderPlaced(false);
        setTimeout(() => {
          setShowDialog("把人字梯拖到吸顶灯正下方...");
        }, 1000);
        break;

      case "ladder-ready":
        setTimeout(() => {
          setShowDialog("梯子放好了！先用测电笔测试一下插座，确认工具功能正常");
          setShowButton(true);
          setButtonText("测试测电笔");
        }, 1000);
        break;

      case "test-pen":
        setCurrentImage("chazuo");
        setVoltageTested(false);
        setTimeout(() => {
          setShowDialog("把测电笔拖到插座上测试...");
        }, 500);
        break;

      case "pen-tested":
        setCurrentImage("chazuo2");
        setTimeout(() => {
          setShowDialog("测电笔亮了，工具正常！现在可以开始拆灯了");
          setShowButton(true);
          setButtonText("登梯拆灯罩");
        }, 1500);
        break;

      case "remove-lampshade":
        setCurrentImage(9);
        setTimeout(() => {
          setShowDialog("登梯，双手扶住吸顶灯外圈灯罩");
          setTimeout(() => {
            setCurrentImage(10);
            setShowDialog("找到卡扣位置，按顺序点击卡扣来拆卸灯罩");
            setSnappedLampPositions([]);
          }, 1500);
        }, 1500);
        break;

      case "lampshade-off":
        setCurrentImage(11);
        setTimeout(() => {
          setShowDialog("灯罩取下了，露出了内部的驱动电源和灯珠板");
          setShowDialog("⚠ 重要：用测电笔检查灯内是否还有电！");
          setShowButton(true);
          setButtonText("验电检查");
        }, 1500);
        break;

      case "verify-power-off":
        setCurrentImage(12);
        setTimeout(() => {
          setShowDialog("用测电笔触碰灯内的裸露铜线和金属端子...");
          setTimeout(() => {
            setPowerOffVerified(true);
            setShowDialog("测电笔没有反应，确认断电！安全解锁");
            setShowButton(true);
            setButtonText("检查灯珠板");
          }, 2000);
        }, 1500);
        break;

      case "diagnose-led":
        setCurrentImage(13);
        setTimeout(() => {
          setShowDialog("观察灯珠表面...发现多处灯珠有黑色烧焦小点");
          setTimeout(() => {
            setShowDialog("诊断结果：单颗灯珠短路导致整块灯板断路，需要更换灯珠板");
            setShowButton(true);
            setButtonText("拆除旧灯珠板");
          }, 2000);
        }, 1500);
        break;

      case "remove-old-board":
        setCurrentImage(14);
        setScrewsCollected([]);
        setTotalScrews(4);
        setTimeout(() => {
          setShowDialog("用螺丝刀拧下固定螺丝，收集到收纳盒中");
        }, 1000);
        break;

      case "old-board-removed":
        setCurrentImage(15);
        setTimeout(() => {
          setShowDialog("卸下烧毁的旧灯珠板");
          setShowButton(true);
          setButtonText("安装新灯珠板");
        }, 1500);
        break;

      case "install-new-board":
        setCurrentImage(15);
        setScrewsCollected([]);
        setTimeout(() => {
          setShowDialog("换上全新LED灯珠板，对齐底座螺丝孔位");
          setTimeout(() => {
            setShowDialog("用螺丝刀逐个拧紧螺丝");
          }, 1500);
        }, 500);
        break;

      case "board-installed":
        setCurrentImage(16);
        setTimeout(() => {
          setShowDialog("将新灯板的接线插头对准驱动电源输出口，用力插紧");
          setTimeout(() => {
            setShowButton(true);
            setButtonText("装回灯罩");
          }, 1500);
        }, 1500);
        break;

      case "reinstall-lampshade":
        setCurrentImage(17);
        setTimeout(() => {
          setShowDialog("检查电线无挤压、无裸露，灯板安装平整");
          setTimeout(() => {
            setShowDialog("重新装回灯罩，扣紧卡扣");
            setCurrentImage(18);
            setTimeout(() => {
              setShowButton(true);
              setButtonText("恢复供电");
            }, 1500);
          }, 1500);
        }, 1500);
        break;

      case "power-on":
        setCurrentImage(19);
        setTimeout(() => {
          setShowDialog("返回配电箱，推上照明回路空气开关");
          setTimeout(() => {
            setCurrentImage(20);
            setShowDialog("按下墙面灯光开关...");
            setTimeout(() => {
              setPhase("success");
              play("mission-success");
              addCompletedMission("mission-3");
              unlockLightingCard();
              saveManager.save();
            }, 1500);
          }, 2000);
        }, 1500);
        break;

      case "success":
        setTimeout(() => {
          setShowDialog("🎉 维修成功！客厅的灯亮起来了！");
          setTimeout(() => {
            setShowButton(true);
            setButtonText("完成任务");
          }, 2000);
        }, 500);
        break;
    }
  }, [phase, play, addCompletedMission, unlockLightingCard]);

  const handleButtonClick = useCallback(() => {
    play("ui-confirm");
    setShowButton(false);
    setShowDialog(null);

    switch (phase) {
      case "precaution":
        setLightingPrecautionShown(true);
        if (hasAllTools && lightingToolsCollected) {
          setPhase("prepare-ladder");
        } else if (hasAllTools) {
          setPhase("tools-collected");
        } else {
          setPhase("check-power");
          setCurrentImage(1);
          setShowDialog("诶，怎么客厅里的灯不亮了？");
        }
        break;

      case "check-power":
        setPhase("neighbor-check");
        break;

      case "neighbor-check":
        setPhase("circuit-box");
        break;

      case "circuit-box":
        setPhase("power-off");
        setCompletedSteps((prev) => [...prev, "check-power"]);
        break;

      case "power-off":
        setPhase("collect-tools");
        break;

      case "tools-collected":
        setPhase("prepare-ladder");
        break;

      case "prepare-ladder":
        setPhase("ladder-ready");
        setCompletedSteps((prev) => [...prev, "collect-tools"]);
        break;

      case "ladder-ready":
        setPhase("test-pen");
        break;

      case "pen-tested":
        setPhase("remove-lampshade");
        setCompletedSteps((prev) => [...prev, "test-voltage"]);
        break;

      case "lampshade-off":
        setPhase("verify-power-off");
        break;

      case "verify-power-off":
        setPhase("diagnose-led");
        setCompletedSteps((prev) => [...prev, "verify-power-off"]);
        break;

      case "diagnose-led":
        setPhase("remove-old-board");
        setCompletedSteps((prev) => [...prev, "diagnose-led"]);
        break;

      case "old-board-removed":
        setPhase("install-new-board");
        setCompletedSteps((prev) => [...prev, "remove-old-board"]);
        break;

      case "board-installed":
        setPhase("reinstall-lampshade");
        setCompletedSteps((prev) => [...prev, "install-new-board"]);
        break;

      case "reinstall-lampshade":
        setPhase("power-on");
        setCompletedSteps((prev) => [...prev, "reinstall-lampshade"]);
        break;

      case "success":
        setFadeToBlack(true);
        setTimeout(() => {
          void transitionToScene(SCENE_IDS.LIGHTING_MISSION_COMPLETED);
        }, 800);
        break;
    }
  }, [phase, play, transitionToScene]);

  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent, toolId: string) => {
    if (!hasTool(toolId)) return;
    
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    
    dragRef.current = {
      startX: clientX,
      startY: clientY,
      offsetX: 0,
      offsetY: 0,
    };
    setDraggedTool(toolId);
    setDragPosition({ x: clientX, y: clientY });
  }, [hasTool]);

  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!dragRef.current || !draggedTool) return;
    
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    
    setDragPosition({ x: clientX, y: clientY });
  }, [draggedTool]);

  const handleDragEnd = useCallback(() => {
    if (!draggedTool) return;

    if (draggedTool === "ladder" && phase === "prepare-ladder") {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const centerX = screenWidth / 2;
      const centerY = screenHeight * 0.6;
      
      const distance = Math.sqrt(
        Math.pow(dragPosition.x - centerX, 2) + 
        Math.pow(dragPosition.y - centerY, 2)
      );

      if (distance < 150) {
        play("ui-confirm");
        setLadderPlaced(true);
        setShowDialog("梯子放好了！踩压测试一下");
        setShowButton(true);
        setButtonText("测试稳定性");
      } else {
        play("ui-error");
        setShowDialog("梯子没放对位置，再试一次！");
        setTimeout(() => setShowDialog("把人字梯拖到吸顶灯正下方..."), 1500);
      }
    }

    if (draggedTool === "voltage-pen" && phase === "test-pen") {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const socketX = screenWidth / 2;
      const socketY = screenHeight * 0.55;
      
      const distance = Math.sqrt(
        Math.pow(dragPosition.x - socketX, 2) + 
        Math.pow(dragPosition.y - socketY, 2)
      );

      if (distance < 100) {
        play("ui-confirm");
        setVoltageTested(true);
        setPhase("pen-tested");
      } else {
        play("ui-error");
        setShowDialog("没对准插座，再试一次！");
        setTimeout(() => setShowDialog("把测电笔拖到插座上测试..."), 1500);
      }
    }

    setDraggedTool(null);
    dragRef.current = null;
  }, [draggedTool, phase, dragPosition, play]);

  const handleLampSnap = useCallback((index: number) => {
    if (phase !== "remove-lampshade") return;
    if (snappedLampPositions.includes(index)) return;

    play("ui-confirm");
    const newPositions = [...snappedLampPositions, index];
    setSnappedLampPositions(newPositions);

    if (newPositions.length === 4) {
      setTimeout(() => {
        setPhase("lampshade-off");
        setCompletedSteps((prev) => [...prev, "remove-lampshade"]);
      }, 500);
    }
  }, [phase, snappedLampPositions, play]);

  const handleScrewCollect = useCallback((index: number) => {
    if (phase !== "remove-old-board" && phase !== "install-new-board") return;
    if (screwsCollected.includes(index)) return;
    
    play("ui-confirm");
    const newCollected = [...screwsCollected, index];
    setScrewsCollected(newCollected);

    if (newCollected.length >= totalScrews) {
      if (phase === "remove-old-board") {
        setTimeout(() => {
          setPhase("old-board-removed");
        }, 500);
      } else {
        setTimeout(() => {
          setPhase("board-installed");
        }, 500);
      }
    }
  }, [phase, screwsCollected, totalScrews, play]);

  const handlePickTool = useCallback((toolId: string, toolName: string) => {
    if (items.some((item) => item.id === toolId)) {
      return;
    }
    addItem({ id: toolId, name: toolName, category: "tool" });
    play("ui-confirm");
    saveManager.save();

    if (hasAllTools) {
      setShowToolbox(false);
      setPhase("tools-collected");
    }
  }, [items, addItem, play, hasAllTools]);

  const handleBackToMenu = useCallback(() => {
    setShowExitConfirm(true);
  }, []);

  const handleConfirmExit = useCallback(async () => {
    setShowExitConfirm(false);
    await transitionToScene(SCENE_IDS.OPENING);
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

  useEffect(() => {
    window.addEventListener("mousemove", handleDragMove);
    window.addEventListener("mouseup", handleDragEnd);
    window.addEventListener("touchmove", handleDragMove);
    window.addEventListener("touchend", handleDragEnd);
    
    return () => {
      window.removeEventListener("mousemove", handleDragMove);
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("touchmove", handleDragMove);
      window.removeEventListener("touchend", handleDragEnd);
    };
  }, [handleDragMove, handleDragEnd]);

  const getImageSrc = () => {
    if (currentImage === "chazuo") return "/images/lighting/chazuo.png";
    if (currentImage === "chazuo2") return "/images/lighting/chazuo.png";
    
    const imageExtensions: Record<number | string, string> = {
      1: ".jpg",
      1.5: ".png",
      2: ".jpg",
      3: ".jpg",
      4: ".jpg",
      5: ".jpg",
      6: ".jpg",
      7: ".jpg",
      8: ".jpg",
      9: ".jpg",
      10: ".jpg",
      11: ".jpg",
      12: ".jpg",
      13: ".jpg",
      14: ".jpg",
      15: ".jpg",
      16: ".jpg",
      17: ".jpg",
      18: ".jpg",
      19: ".jpg",
      20: ".jpg",
    };
    const numImage = typeof currentImage === "number" ? currentImage : parseFloat(currentImage);
    const ext = imageExtensions[numImage] || ".jpg";
    return `/images/lighting/lighting_${currentImage}${ext}`;
  };

  const renderDragInteraction = () => {
    if (phase === "prepare-ladder" && !ladderPlaced && hasTool("ladder")) {
      return (
        <motion.div
          className="absolute left-1/2 top-[60%] -translate-x-1/2 w-32 h-32 border-4 border-dashed border-yellow-400 rounded-lg flex items-center justify-center z-20"
          animate={{ borderColor: ["#facc15", "#f59e0b", "#facc15"] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <span className="text-yellow-400 font-serif text-lg">放置梯子</span>
        </motion.div>
      );
    }

    if (phase === "test-pen" && !voltageTested && hasTool("voltage-pen")) {
      return (
        <motion.div
          className="absolute left-1/2 top-[50%] -translate-x-1/2 w-24 h-24 border-4 border-dashed border-green-400 rounded-lg flex items-center justify-center z-20"
          animate={{ borderColor: ["#4ade80", "#22c55e", "#4ade80"] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <span className="text-green-400 font-serif text-sm">插座</span>
        </motion.div>
      );
    }

    if (phase === "remove-lampshade" && snappedLampPositions.length < 4) {
      return (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="relative w-64 h-64">
            {[0, 1, 2, 3].map((index) => {
              const isSnapped = snappedLampPositions.includes(index);
              const angle = (index * 90 - 45) * (Math.PI / 180);
              const x = Math.cos(angle) * 100;
              const y = Math.sin(angle) * 100;
              
              return (
                <motion.button
                  key={index}
                  type="button"
                  onClick={() => handleLampSnap(index)}
                  className={`absolute w-8 h-8 rounded-full border-2 ${
                    isSnapped 
                      ? "bg-green-500 border-green-600" 
                      : "bg-white/80 border-gray-400 hover:bg-yellow-300"
                  } flex items-center justify-center`}
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: "translate(-50%, -50%)",
                  }}
                  whileHover={!isSnapped ? { scale: 1.2 } : {}}
                  whileTap={{ scale: 0.9 }}
                >
                  {isSnapped && <span className="text-white text-xs">✓</span>}
                </motion.button>
              );
            })}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white/70 text-xs font-serif">
              点击卡扣拆卸
            </div>
          </div>
        </div>
      );
    }

    if ((phase === "remove-old-board" || phase === "install-new-board") && screwsCollected.length < totalScrews) {
      return (
        <div className="absolute inset-0 z-20">
          {screwPositions.map((pos, index) => {
            const isCollected = screwsCollected.includes(index);
            return (
              <motion.button
                key={index}
                type="button"
                onClick={() => handleScrewCollect(index)}
                disabled={isCollected}
                className={`absolute w-14 h-14 rounded-full border-3 flex items-center justify-center transition-all ${
                  isCollected
                    ? "bg-green-600/80 border-green-500 opacity-50"
                    : "bg-gray-700/60 border-gray-500 hover:bg-gray-600/80"
                }`}
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                whileHover={!isCollected ? { scale: 1.15 } : {}}
                whileTap={!isCollected ? { scale: 0.9 } : {}}
              >
                {isCollected ? (
                  <span className="text-white text-sm">✓</span>
                ) : (
                  <span className="text-white font-serif text-xl">🔩</span>
                )}
              </motion.button>
            );
          })}
          <div className="absolute bottom-32 left-1/2 -translate-x-1/2 text-white font-serif text-lg">
            {phase === "remove-old-board" ? "收集螺丝" : "拧紧螺丝"}: {screwsCollected.length} / {totalScrews}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <AnimatePresence>
        <motion.div
          key={currentImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <Image
            src={getImageSrc()}
            alt="Lighting repair"
            fill
            className="object-cover"
            quality={100}
          />
        </motion.div>
      </AnimatePresence>

      {renderDragInteraction()}

      <AnimatePresence>
        {phase === "precaution" && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-[90%] max-w-lg bg-[#f5e6d3] rounded-2xl shadow-2xl p-6 sm:p-8"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="border-b-2 border-[#dcc4a0] pb-4 mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-[#5d4a37]">操作前先确认安全</h2>
              </div>
              
              <ul className="space-y-3 mb-6 text-[#5d4a37] text-base">
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 mt-1">•</span>
                  <span>准备手电筒或备用照明；</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 mt-1">•</span>
                  <span>操作灯具前，先关闭对应电路；</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 mt-1">•</span>
                  <span>不确定电路状态或缺乏相关知识时，不要贸然操作；</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-600 mt-1">•</span>
                  <span>若出现烧焦气味、火花、异常发热或裸露线路，应立即停止并联系专业人员。</span>
                </li>
              </ul>

              <div className="border-t border-[#dcc4a0] pt-4 mb-6">
                <p className="text-[#5d4a37]/70 text-sm">
                  本关提供的是一种基础排查思路，不代表所有灯具故障的唯一处理方式。实际情况可能因灯具类型、电路结构和故障原因而不同，请以现场安全状况为准。
                </p>
              </div>

              <motion.button
                type="button"
                onClick={handleButtonClick}
                className="w-full py-3 bg-[#5d4a37] text-white text-lg font-serif tracking-[0.15em] uppercase hover:bg-[#4a3a2a] transition-colors rounded-full shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                我已了解
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute left-4 top-4 z-30">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4">
          <div className="text-white/80 text-lg mb-2 font-bold">问题</div>
          <div className="text-white text-xl">客厅的灯不亮了...</div>
        </div>
      </div>

      <div className="absolute left-4 bottom-20 z-30">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 space-y-3">
          {[
            { id: "check-power", name: "检查配电箱" },
            { id: "collect-tools", name: "收集工具" },
            { id: "test-voltage", name: "验电测试" },
            { id: "remove-lampshade", name: "拆卸灯罩" },
            { id: "verify-power-off", name: "确认断电" },
            { id: "diagnose-led", name: "故障诊断" },
            { id: "remove-old-board", name: "拆除旧灯板" },
            { id: "install-new-board", name: "安装新灯板" },
            { id: "reinstall-lampshade", name: "装回灯罩" },
            { id: "power-on", name: "通电测试" },
          ].map((step) => {
            const isCompleted = completedSteps.includes(step.id);
            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 ${
                  isCompleted ? "text-white text-lg" : "text-white/30 text-lg"
                }`}
              >
                <span className="text-lg">{isCompleted ? "✓" : "○"}</span>
                <span>{step.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute right-4 top-4 bottom-4 w-28 bg-black/40 backdrop-blur-sm rounded-lg flex flex-col gap-2 p-2 z-30">
        <span className="text-white/60 text-xs uppercase tracking-wider text-center">工具</span>
        {items.map((item) => {
          const tool = LIGHTING_TOOLS.find((t) => t.id === item.id);
          const canDrag = (phase === "prepare-ladder" && item.id === "ladder" && !ladderPlaced) ||
                          (phase === "test-pen" && item.id === "voltage-pen" && !voltageTested);
          
          return (
            <motion.div
              key={item.id}
              className="relative group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                type="button"
                onClick={() => handleRemoveItem(item.id)}
                onMouseDown={(e) => canDrag && handleDragStart(e, item.id)}
                onTouchStart={(e) => canDrag && handleDragStart(e, item.id)}
                className={`w-full aspect-square rounded-lg flex items-center justify-center overflow-hidden ${
                  canDrag 
                    ? "bg-yellow-600/80 hover:bg-yellow-500 cursor-grab active:cursor-grabbing animate-pulse border-2 border-yellow-400" 
                    : "bg-[#5d4a37]/60 hover:bg-[#5d4a37] border-2 border-transparent"
                }`}
              >
                {tool && (
                  <Image
                    src={tool.image}
                    alt={tool.name}
                    className="w-full h-full object-contain"
                    width={60}
                    height={60}
                  />
                )}
              </button>
              <span className="absolute bottom-0 left-0 right-0 text-center text-white/80 text-[10px] bg-black/50 py-0.5 truncate">
                {tool?.name}
              </span>
              {canDrag && (
                <span className="absolute -top-1 -right-1 text-yellow-400 text-[8px] bg-black/60 px-1 rounded-full">
                  拖拽
                </span>
              )}
            </motion.div>
          );
        })}
        {items.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <span className="text-white/30 text-[10px]">空</span>
          </div>
        )}
      </div>

      <AnimatePresence>
        {draggedTool && (
          <motion.div
            className="fixed z-50 pointer-events-none"
            style={{ left: dragPosition.x - 30, top: dragPosition.y - 30 }}
            initial={{ scale: 1 }}
            animate={{ scale: 1.2, rotate: 5 }}
          >
            <div className="w-15 h-15 bg-[#5d4a37] rounded-lg flex items-center justify-center shadow-xl border-2 border-yellow-400">
              <span className="text-white font-serif text-sm">
                {LIGHTING_TOOLS.find((t) => t.id === draggedTool)?.name.slice(0, 2)}
              </span>
            </div>
          </motion.div>
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
        {showToolbox && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-[90%] max-w-md bg-[#f5e6d3] rounded-2xl shadow-2xl p-6"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <div className="border-b border-[#dcc4a0] pb-3 mb-4">
                <h2 className="text-lg font-serif text-gray-800">工具箱</h2>
                <p className="text-xs text-gray-500 mt-1">收集维修所需的工具</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {LIGHTING_TOOLS.map((tool) => {
                  const hasToolItem = items.some((item) => item.id === tool.id);
                  return (
                    <motion.button
                      key={tool.id}
                      type="button"
                      onClick={() => handlePickTool(tool.id, tool.name)}
                      disabled={hasToolItem}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        hasToolItem
                          ? "bg-green-100 border-green-300 opacity-70"
                          : "bg-white/60 border-[#dcc4a0] hover:border-gray-400"
                      }`}
                      whileHover={!hasToolItem ? { scale: 1.02 } : {}}
                      whileTap={!hasToolItem ? { scale: 0.98 } : {}}
                    >
                      <span className="text-sm font-serif text-gray-700 block">{tool.name}</span>
                      {hasToolItem && (
                        <span className="text-xs text-green-600 block mt-1">✓ 已获得</span>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {hasAllTools && (
                <motion.div
                  className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-sm text-green-700 font-serif">✓ 已收集所有工具！</p>
                </motion.div>
              )}

              {!hasAllTools && (
                <button
                  type="button"
                  onClick={() => setShowToolbox(false)}
                  className="w-full mt-4 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors font-serif text-sm"
                >
                  稍后再来
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
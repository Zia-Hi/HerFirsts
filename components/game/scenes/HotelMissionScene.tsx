"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SCENE_IDS } from "@/lib/game";
import { useGameStore, useKnowledgeStore, saveManager } from "@/store";
import { useSceneTransition } from "@/hooks/useSceneTransition";
import { useGameAudio } from "@/hooks/useGameAudio";

type HotelMissionPhase = "intro" | "step1" | "step1-lights-off" | "step1-curtains" | "step2" | "step2-inspect" | "step2-inspecting" | "step3" | "completed";

const MISSION_STEPS = [
  { id: "lights-off", name: "关闭主灯" },
  { id: "curtains", name: "拉上窗帘" },
  { id: "inspect", name: "检查房间" },
  { id: "identify", name: "识别异常" },
];

const INSPECT_AREAS = [
  { id: "socket", name: "插座面板", image: "/pinterest/hotel/hotel_7.jpg", normal: true, hint: "插座是常见的隐藏拍摄位置" },
  { id: "tv", name: "电视", image: "/pinterest/hotel/hotel_6.jpg", normal: true, hint: "智能电视可能被入侵" },
  { id: "aircon", name: "空调", image: "/pinterest/hotel/hotel_8.jpg", normal: true, hint: "空调出风口视野开阔" },
  { id: "shower", name: "花洒", image: "/pinterest/hotel/hotel_12.jpg", normal: true, hint: "浴室也是高风险区域" },
  { id: "washbasin", name: "洗漱台", image: "/pinterest/hotel/hotel_10.jpg", normal: true, hint: "镜子后面可能有玄机" },
  { id: "corner", name: "浴室角落", image: "/pinterest/hotel/hotel_11.jpg", normal: true, hint: "隐蔽角落容易被忽略" },
  { id: "smoke", name: "烟雾报警器", image: "/pinterest/hotel/hotel_9.jpg", normal: false, hint: "注意这个设备..." },
];

export function HotelMissionScene() {
  const [phase, setPhase] = useState<HotelMissionPhase>("intro");
  const [currentImage, setCurrentImage] = useState("/pinterest/hotel/hotel_1.jpg");
  const [currentDialog, setCurrentDialog] = useState<string | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [currentInspectArea, setCurrentInspectArea] = useState<string | null>(null);
  const [inspectedAreas, setInspectedAreas] = useState<string[]>([]);
  const [showChoices, setShowChoices] = useState(false);
  const [fadeToBlack, setFadeToBlack] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [showRedDot, setShowRedDot] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [foundAbnormal, setFoundAbnormal] = useState(false);

  const { transitionToScene } = useSceneTransition();
  const { play, stop } = useGameAudio();
  const addCompletedMission = useGameStore((s) => s.addCompletedMission);
  const unlockHotelCard = useKnowledgeStore((s) => s.unlockHotelCard);

  useEffect(() => {
    play("ambient-apartment", 0.2);
    return () => {
      stop("ambient-apartment");
    };
  }, [play, stop]);

  const showDialog = useCallback((text: string) => {
    setCurrentDialog(text);
    setDialogVisible(true);
  }, []);

  const hideDialog = useCallback(() => {
    setDialogVisible(false);
    setCurrentDialog(null);
  }, []);

  useEffect(() => {
    if (phase === "intro") {
      setTimeout(() => {
        showDialog("入住酒店后，第一件事应该是检查房间是否存在安全隐患。");
        setTimeout(() => {
          hideDialog();
          setPhase("step1");
          setCurrentImage("/pinterest/hotel/hotel_4.jpg");
          setTimeout(() => {
            showDialog("首先，请关闭房间主灯。较暗的环境有助于观察隐藏设备发出的微弱光点。");
          }, 1000);
        }, 3000);
      }, 1000);
    }
  }, [phase, showDialog, hideDialog]);

  const handleLightsOff = useCallback(() => {
    hideDialog();
    play("ui-confirm");
    setPhase("step1-lights-off");
    setTimeout(() => {
      showDialog("灯光已关闭。接下来，请拉上窗帘，让房间保持较暗的状态。");
    }, 1500);
  }, [hideDialog, play, showDialog]);

  const handleCloseCurtains = useCallback(() => {
    hideDialog();
    play("ui-confirm");
    setPhase("step1-curtains");
    setCurrentImage("/pinterest/hotel/hotel_3.jpg");
    setTimeout(() => {
      showDialog("房间变暗后，一些隐藏设备发出的微弱红光或绿光就更容易被发现了。");
      setTimeout(() => {
        hideDialog();
        setTimeout(() => {
          setPhase("step2");
          setCurrentImage("/pinterest/hotel/hotel_5.jpg");
          setTimeout(() => {
            showDialog("现在，请拿起你的手机，打开相机功能，开始逐一检查房间的各个角落。");
          }, 1000);
        }, 2500);
      }, 1000);
    }, 1500);
  }, [hideDialog, play, showDialog]);

  const handleStartInspect = useCallback(() => {
    hideDialog();
    play("ui-confirm");
    setPhase("step2-inspect");
    setTimeout(() => {
      showDialog("点击下方的区域进行检查，看看哪里有异常：");
    }, 500);
  }, [hideDialog, play, showDialog]);

  const getStepStatus = useCallback((stepId: string): "completed" | "current" | "locked" => {
    if (phase === "intro") return "locked";
    if (phase === "step1" && stepId === "lights-off") return "current";
    if (phase === "step1-lights-off" && stepId === "lights-off") return "completed";
    if (phase === "step1-lights-off" && stepId === "curtains") return "current";
    if (phase === "step1-curtains" && (stepId === "lights-off" || stepId === "curtains")) return "completed";
    if (phase === "step2" && stepId === "inspect") return "current";
    if (phase === "step2-inspect" && (stepId === "lights-off" || stepId === "curtains")) return "completed";
    if (phase === "step2-inspect" && stepId === "inspect") return "current";
    if (phase === "step3" && (stepId === "lights-off" || stepId === "curtains" || stepId === "inspect")) return "completed";
    if (phase === "step3" && stepId === "identify") return "current";
    if (phase === "completed") return "completed";
    return "locked";
  }, [phase]);

  const handleInspectArea = useCallback((areaId: string) => {
    if (inspectedAreas.includes(areaId)) return;
    
    const area = INSPECT_AREAS.find((a) => a.id === areaId);
    if (!area) return;

    play("ui-confirm");
    setIsZooming(true);
    setCurrentInspectArea(areaId);

    setTimeout(() => {
      setIsZooming(false);
      setCurrentImage(area.image);

      if (!area.normal) {
        setShowRedDot(true);
      }

      setTimeout(() => {
        const newInspectedAreas = [...inspectedAreas, areaId];
        setInspectedAreas(newInspectedAreas);
        
        if (!area.normal) {
          setFoundAbnormal(true);
          showDialog("等等！这个烟雾报警器有点不对劲...");
          
          setTimeout(() => {
            hideDialog();
            
            if (newInspectedAreas.length === INSPECT_AREAS.length) {
              setPhase("step3");
              setTimeout(() => {
                showDialog("仔细观察：<br/>• 有一个红色的发光点<br/>• 表面有一个不符合设计的小圆孔<br/>• 小孔的位置正对床铺<br/>• 内部隐约可见类似镜头的结构");
                setTimeout(() => {
                  setShowRedDot(false);
                  setShowChoices(true);
                }, 2000);
              }, 500);
            } else {
              showDialog("先检查完所有区域，再决定下一步怎么做。");
              setTimeout(() => {
                hideDialog();
                setShowRedDot(false);
                setCurrentInspectArea(null);
                setCurrentImage("/pinterest/hotel/hotel_5.jpg");
              }, 3000);
            }
          }, 5000);
        } else {
          showDialog(`${area.name}看起来一切正常。${area.hint}`);
          setTimeout(() => {
            hideDialog();
            setCurrentInspectArea(null);
            setCurrentImage("/pinterest/hotel/hotel_5.jpg");
            
            if (newInspectedAreas.length === INSPECT_AREAS.length && foundAbnormal) {
              setTimeout(() => {
                const smokeArea = INSPECT_AREAS.find((a) => a.id === "smoke");
                if (smokeArea) {
                  setCurrentImage(smokeArea.image);
                  setTimeout(() => {
                    showDialog("嗯，那有问题的就是烟雾报警器");
                    setTimeout(() => {
                      hideDialog();
                      setPhase("step3");
                      setTimeout(() => {
                        showDialog("仔细观察：<br/>• 有一个红色的发光点<br/>• 表面有一个不符合设计的小圆孔<br/>• 小孔的位置正对床铺<br/>• 内部隐约可见类似镜头的结构");
                        setTimeout(() => {
                          setShowChoices(true);
                        }, 2000);
                      }, 500);
                    }, 3000);
                  }, 1000);
                }
              }, 500);
            }
          }, 3500);
        }
      }, 1800);
    }, 400);
  }, [inspectedAreas, play, showDialog, hideDialog, foundAbnormal]);

  const handleChoice = useCallback((choice: string) => {
    setShowChoices(false);
    hideDialog();
    play("ui-confirm");

    if (choice === "C") {
      setCurrentImage("/pinterest/hotel/hotel_13.jpg");
      showDialog("非常正确！遇到疑似偷拍设备时，最佳做法是：<br/><br/>• 不要自行拆卸或破坏设备<br/>• 保留现场，拍照记录证据<br/>• 立即联系酒店前台反映情况<br/>• 如怀疑涉及违法偷拍，可报警处理");
      setTimeout(() => {
        hideDialog();
        setPhase("completed");
        addCompletedMission("hotel-mission");
        unlockHotelCard();
        saveManager.save();
        
        setTimeout(() => {
          setFadeToBlack(true);
          setTimeout(() => {
            void transitionToScene(SCENE_IDS.HOTEL_MISSION_COMPLETED);
          }, 1000);
        }, 2500);
      }, 3500);
    } else if (choice === "A") {
      showDialog("这样做太冒险了！自行拆卸可能会破坏关键证据，甚至可能触发设备的报警或数据销毁功能。请重新选择。");
      setTimeout(() => {
        hideDialog();
        setShowChoices(true);
        showDialog("你该怎么做？");
      }, 3000);
    } else {
      showDialog("这不是好主意！拔掉电源并不能解决问题，真正的摄像头可能还有备用电源。而且这样做会错过收集证据的最佳时机。请重新选择。");
      setTimeout(() => {
        hideDialog();
        setShowChoices(true);
        showDialog("你该怎么做？");
      }, 3000);
    }
  }, [hideDialog, play, addCompletedMission, unlockHotelCard, transitionToScene, showDialog]);

  const handleButtonClick = useCallback(() => {
    if (phase === "step1") {
      handleLightsOff();
    } else if (phase === "step1-lights-off") {
      handleCloseCurtains();
    } else if (phase === "step2") {
      handleStartInspect();
    }
  }, [phase, handleLightsOff, handleCloseCurtains, handleStartInspect]);

  const handleBackToMenu = useCallback(() => {
    setShowExitConfirm(true);
  }, []);

  const handleConfirmExit = useCallback(async () => {
    setShowExitConfirm(false);
    stop("ambient-apartment");
    play("ui-cancel");
    await wait(300);
    void transitionToScene(SCENE_IDS.HOTEL_ROOM);
  }, [stop, play, transitionToScene]);

  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="relative h-full w-full">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImage}
            src={currentImage}
            alt="Hotel room"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: isZooming ? 1.1 : 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
        </AnimatePresence>
      </div>

      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 50% 50%, transparent 0%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0.4) 100%)",
      }} />

      {showRedDot && (
        <motion.div
          className="absolute top-[35%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-20"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
        >
          <motion.div
            className="w-4 h-4 rounded-full bg-red-500"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.6, 1],
              boxShadow: [
                "0 0 10px 5px rgba(239, 68, 68, 0.8)",
                "0 0 20px 10px rgba(239, 68, 68, 0.6)",
                "0 0 10px 5px rgba(239, 68, 68, 0.8)",
              ],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      )}

      <div className="absolute left-4 top-4 z-30">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4">
          <div className="text-white/80 text-lg mb-2 font-bold">任务</div>
          <div className="text-white text-xl">检查房间安全隐患</div>
        </div>
      </div>

      <div className="absolute right-4 top-20 z-30">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 space-y-3">
          {MISSION_STEPS.map((step) => {
            const status = getStepStatus(step.id);
            const allCompleted = MISSION_STEPS.every(s => getStepStatus(s.id) === "completed");
            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 ${
                  status === "completed" 
                    ? "text-white text-xl font-semibold" 
                    : status === "current" 
                      ? "text-white text-lg" 
                      : "text-white/30 text-lg"
                } ${allCompleted ? "text-2xl" : ""}`}
              >
                <span className="text-xl">{status === "completed" ? "✓" : status === "current" ? "●" : "○"}</span>
                <span>{step.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={handleBackToMenu}
        className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full text-white/70 text-sm hover:text-white hover:bg-black/60 transition-colors z-30 border border-white/20 flex items-center gap-1.5"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        返回房间
      </button>

      <AnimatePresence>
        {dialogVisible && currentDialog && (
          <motion.div
            className="absolute inset-x-0 top-20 z-30 flex justify-center px-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="max-w-lg bg-[#f5e6d3] rounded-xl shadow-2xl p-6 relative">
              <div className="border-b border-[#dcc4a0] pb-3 mb-3">
                <span className="text-sm text-gray-500 uppercase tracking-wider">提示</span>
              </div>
              <p className="text-gray-800 text-lg font-serif leading-relaxed" dangerouslySetInnerHTML={{ __html: currentDialog }} />
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
        {dialogVisible && currentDialog && (phase === "step1" || phase === "step1-lights-off" || phase === "step2") && (
          <motion.div
            className="absolute inset-x-0 bottom-4 z-30 flex justify-center px-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <motion.button
              type="button"
              onClick={handleButtonClick}
              className="px-10 py-3 bg-[#5d4a37] text-white text-xl font-serif tracking-[0.15em] uppercase hover:bg-[#4a3a2a] transition-colors rounded-full shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {phase === "step1" && "关闭主灯"}
              {phase === "step1-lights-off" && "拉上窗帘"}
              {phase === "step2" && "开始检查"}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "step2-inspect" && !currentInspectArea && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute inset-x-0 bottom-4 z-30 flex justify-center px-8"
          >
            <div className="bg-black/50 backdrop-blur-sm rounded-xl p-4">
              <div className="grid grid-cols-4 gap-3">
                {INSPECT_AREAS.map((area) => (
                  <motion.button
                    key={area.id}
                    type="button"
                    onClick={() => handleInspectArea(area.id)}
                    disabled={inspectedAreas.includes(area.id)}
                    className={`py-3 px-4 rounded-lg text-sm font-game-serif transition-all ${
                      inspectedAreas.includes(area.id)
                        ? "bg-gray-600/70 text-gray-400 cursor-not-allowed border border-gray-500/30"
                        : "bg-[#5d4a37]/90 text-white hover:bg-[#4a3a2a] border border-[#dcc4a0]/20"
                    }`}
                    whileHover={!inspectedAreas.includes(area.id) ? { scale: 1.05 } : {}}
                    whileTap={!inspectedAreas.includes(area.id) ? { scale: 0.95 } : {}}
                  >
                    {area.name}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showChoices && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute inset-x-0 bottom-28 z-30 flex justify-center px-8"
          >
            <div className="max-w-lg bg-[#f5e6d3] rounded-xl shadow-2xl p-6 relative">
              <div className="border-b border-[#dcc4a0] pb-3 mb-4">
                <span className="text-sm text-gray-500 uppercase tracking-wider">选择</span>
              </div>
              <div className="space-y-3">
                <motion.button
                  type="button"
                  onClick={() => handleChoice("A")}
                  className="w-full py-3 px-4 bg-[#5d4a37]/90 text-white text-left font-game-serif hover:bg-[#4a3a2a] transition-colors rounded-lg flex items-center gap-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="font-bold w-6">A.</span>
                  <span>把设备拆开看看</span>
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => handleChoice("B")}
                  className="w-full py-3 px-4 bg-[#5d4a37]/90 text-white text-left font-game-serif hover:bg-[#4a3a2a] transition-colors rounded-lg flex items-center gap-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="font-bold w-6">B.</span>
                  <span>拔掉设备继续入住</span>
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => handleChoice("C")}
                  className="w-full py-3 px-4 bg-[#5d4a37]/90 text-white text-left font-game-serif hover:bg-[#4a3a2a] transition-colors rounded-lg flex items-center gap-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="font-bold w-6">C.</span>
                  <span>保留现场，联系酒店前台；如怀疑存在偷拍，可报警处理</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {fadeToBlack && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0 bg-black z-50"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showExitConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#f5e6d3] rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4"
            >
              <h3 className="text-xl font-game-serif text-gray-800 mb-4 text-center">确认退出？</h3>
              <p className="text-gray-600 text-center mb-6">当前任务尚未完成，确定要返回房间吗？</p>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 py-2 px-4 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-game-serif"
                >
                  继续任务
                </button>
                <button
                  type="button"
                  onClick={handleConfirmExit}
                  className="flex-1 py-2 px-4 bg-[#5d4a37] text-white rounded-lg hover:bg-[#4a3a2a] transition-colors font-game-serif"
                >
                  确认返回
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

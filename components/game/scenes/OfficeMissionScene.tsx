"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home } from "lucide-react";
import Image from "next/image";
import { useSceneTransition } from "@/hooks/useSceneTransition";
import { useGameAudio } from "@/hooks/useGameAudio";
import { SCENE_IDS } from "@/lib/game";
import { useGameStore, useKnowledgeStore, saveManager } from "@/store";
import { ConfirmDialog } from "@/components/game/ui";

type OfficePhase = 
  | "start"
  | "storage-warning"
  | "cascade-problems"
  | "this-pc"
  | "downloads"
  | "desktop"
  | "recycle-bin"
  | "sticky-note"
  | "browser-search"
  | "storage-settings"
  | "temp-files"
  | "software-distribution"
  | "wechat-settings"
  | "success";

const OFFICE_REPAIR_STEPS = [
  { id: "identify-issue", name: "识别问题" },
  { id: "clean-downloads", name: "清理下载文件夹" },
  { id: "clean-desktop", name: "清理桌面" },
  { id: "empty-recycle-bin", name: "清空回收站" },
  { id: "disk-cleanup", name: "磁盘清理" },
  { id: "clear-temp", name: "清理临时文件" },
  { id: "clear-update-cache", name: "清理更新缓存" },
  { id: "change-wechat-path", name: "修改微信路径" },
];

interface ClickableArea {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
}

export function OfficeMissionScene() {
  const [phase, setPhase] = useState<OfficePhase>("start");
  const [showDialog, setShowDialog] = useState<string | null>(null);
  const [showButton, setShowButton] = useState(false);
  const [buttonText, setButtonText] = useState("");
  const [cDrivePercent, setCDrivePercent] = useState(99);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [fadeToBlack, setFadeToBlack] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [timeLeft, setTimeLeft] = useState(18);
  const [showHint, setShowHint] = useState<string | null>(null);
  const [clickedFiles, setClickedFiles] = useState<string[]>([]);
  const [hintCooldown, setHintCooldown] = useState(false);

  const { transitionToScene } = useSceneTransition();
  const { play } = useGameAudio();
  const addCompletedMission = useGameStore((s) => s.addCompletedMission);
  const unlockOfficeCard = useKnowledgeStore((s) => s.unlockOfficeCard);

  useEffect(() => {
    play("ambient-apartment", 0.2);
  }, [play]);

  useEffect(() => {
    if (phase === "start") {
      setTimeout(() => {
        setPhase("storage-warning");
      }, 1500);
    }

    if (phase === "storage-warning") {
      play("ui-error");
      setTimeout(() => {
        setShowDialog("Storage Almost Full\nOnly 1.3 GB remaining.");
        setShowButton(true);
        setButtonText("继续");
      }, 1000);
    }

    if (phase === "cascade-problems") {
      const problems = [
        "Word 自动保存失败...",
        "微信无法发送文件...",
        "浏览器越来越卡...",
        "PPT 导出失败...",
      ];
      let delay = 0;
      problems.forEach((problem, index) => {
        setTimeout(() => {
          setShowDialog(problem);
        }, delay);
        delay += 1500;
      });
      setTimeout(() => {
        setShowDialog("办公室里的同事都在忙...\nLeader 正在会议...\n距离会议开始还有：\n\n18 minutes");
        setShowButton(true);
        setButtonText("开始排查");
      }, 6000);
    }

    if (phase === "this-pc") {
      setTimeout(() => {
        setShowDialog("C盘：99%（红色）\nD盘：28%（绿色）");
        setShowButton(true);
        setButtonText("查看 Downloads");
      }, 1500);
    }

    if (phase === "downloads") {
      setTimeout(() => {
        setShowDialog("点击文件可以查看详情并删除它们");
        setShowButton(false);
      }, 1500);
    }

    if (phase === "desktop") {
      setTimeout(() => {
        setShowDialog("点击文件可以查看详情并删除它们");
        setShowButton(false);
      }, 1500);
    }

    if (phase === "recycle-bin") {
      setTimeout(() => {
        setShowDialog("点击回收站图标清空它");
        setShowButton(false);
      }, 1500);
    }

    if (phase === "sticky-note") {
      setTimeout(() => {
        setShowDialog("便利贴内容：\n✔ 定期清空回收站\n✔ Downloads 别当仓库\n✔ 微信默认保存位置不要放 C 盘\n\n—— IT 小王");
        setShowButton(true);
        setButtonText("搜索解决方案");
      }, 1500);
    }

    if (phase === "browser-search") {
      setTimeout(() => {
        setShowDialog("搜索结果：\nWindows Disk Cleanup\nStorage Settings\nHow to Free Disk Space");
        setShowButton(true);
        setButtonText("打开 Storage Settings");
      }, 1500);
    }

    if (phase === "storage-settings") {
      setTimeout(() => {
        setShowDialog("Temporary Files: 8.4GB\n点击 Clean 释放空间");
        setShowButton(true);
        setButtonText("清理");
      }, 1500);
    }

    if (phase === "temp-files") {
      setTimeout(() => {
        setShowDialog("点击临时文件删除它们");
        setShowButton(false);
      }, 1500);
    }

    if (phase === "software-distribution") {
      setTimeout(() => {
        setShowDialog("Windows 更新缓存文件夹\nC:\\\\Windows\\\\SoftwareDistribution\\\\Download");
        setShowButton(true);
        setButtonText("清理更新缓存");
      }, 1500);
    }

    if (phase === "wechat-settings") {
      setTimeout(() => {
        setShowDialog("微信设置 - Storage Location\n当前：C:\\Users...\n修改到：D:\\WeChat");
        setShowButton(true);
        setButtonText("修改位置");
      }, 1500);
    }

    if (phase === "success") {
      addCompletedMission("mission-4");
      unlockOfficeCard();
      saveManager.save();
      setTimeout(() => {
        setFadeToBlack(true);
        setTimeout(() => {
          void transitionToScene(SCENE_IDS.OFFICE_MISSION_COMPLETED);
        }, 800);
      }, 3000);
    }
  }, [play, phase, addCompletedMission, unlockOfficeCard, transitionToScene]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (phase !== "success" && phase !== "start") {
      timer = setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1));
      }, 60000);
    }
    return () => clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    setClickedFiles([]);
  }, [phase]);

  const handleButtonClick = useCallback(() => {
    play("ui-confirm");
    setShowButton(false);
    setShowDialog(null);

    switch (phase) {
      case "storage-warning":
        setPhase("cascade-problems");
        break;

      case "cascade-problems":
        setPhase("this-pc");
        setCompletedSteps((prev) => [...new Set([...prev, "identify-issue"])]);
        break;

      case "this-pc":
        setPhase("downloads");
        break;

      case "downloads":
        setPhase("desktop");
        break;

      case "desktop":
        setPhase("recycle-bin");
        break;

      case "recycle-bin":
        play("tool-pickup");
        setCDrivePercent((prev) => Math.max(58, prev - 15));
        setCompletedSteps((prev) => [...new Set([...prev, "empty-recycle-bin"])]);
        setTimeout(() => {
          setShowDialog("回收站已清空，释放 15GB 空间");
          setTimeout(() => {
            setPhase("sticky-note");
          }, 1500);
        }, 500);
        break;

      case "sticky-note":
        setPhase("browser-search");
        break;

      case "browser-search":
        setPhase("storage-settings");
        break;

      case "storage-settings":
        play("tool-pickup");
        setCDrivePercent((prev) => Math.max(58, prev - 10));
        setCompletedSteps((prev) => [...new Set([...prev, "disk-cleanup"])]);
        setTimeout(() => {
          setPhase("temp-files");
        }, 1000);
        break;

      case "temp-files":
        play("tool-pickup");
        setCompletedSteps((prev) => [...new Set([...prev, "clear-temp"])]);
        setTimeout(() => {
          setPhase("software-distribution");
        }, 500);
        break;

      case "software-distribution":
        play("tool-pickup");
        setCDrivePercent((prev) => Math.max(58, prev - 8));
        setCompletedSteps((prev) => [...new Set([...prev, "clear-update-cache"])]);
        setTimeout(() => {
          setPhase("wechat-settings");
        }, 1000);
        break;

      case "wechat-settings":
        play("ui-confirm");
        setCompletedSteps((prev) => [...new Set([...prev, "change-wechat-path"])]);
        setTimeout(() => {
          setPhase("success");
        }, 1000);
        break;
    }
  }, [phase, play, addCompletedMission, unlockOfficeCard, transitionToScene]);

  const handleFileClick = useCallback((fileName: string, size: number) => {
    if (clickedFiles.includes(fileName)) return;
    
    play("ui-confirm");
    const nextClickedFiles = [...clickedFiles, fileName];
    setClickedFiles(nextClickedFiles);
    setCDrivePercent((prev) => Math.max(58, prev - size));
    setShowDialog(`已删除 ${fileName}，释放 ${size}GB 空间`);
    
    setTimeout(() => {
      if (phase === "downloads" && nextClickedFiles.length >= 2) {
        setShowDialog("下载文件夹清理完成");
        setShowButton(true);
        setButtonText("查看 Desktop");
        setCompletedSteps((prev) => [...new Set([...prev, "clean-downloads"])]);
      } else if (phase === "desktop" && nextClickedFiles.length >= 2) {
        setShowDialog("桌面清理完成");
        setShowButton(true);
        setButtonText("打开回收站");
        setCompletedSteps((prev) => [...new Set([...prev, "clean-desktop"])]);
      } else if (phase === "temp-files" && nextClickedFiles.length >= 3) {
        setShowDialog("临时文件已清理完成");
        setShowButton(true);
        setButtonText("清理更新缓存");
      } else {
        setShowDialog(null);
      }
    }, 1500);
  }, [clickedFiles, phase, play]);

  const handleGetHint = useCallback(() => {
    if (hintCooldown) return;
    
    play("ui-confirm");
    setHintCooldown(true);
    
    const hints: Record<string, string> = {
      "storage-warning": "点击继续查看问题",
      "cascade-problems": "需要找出空间不足的原因",
      "this-pc": "C盘空间严重不足，需要清理",
      "downloads": "点击文件可以删除它们释放空间",
      "desktop": "桌面文件也占用C盘空间",
      "recycle-bin": "清空回收站可以释放大量空间",
      "sticky-note": "便利贴有重要提示",
      "browser-search": "Windows有内置的磁盘清理工具",
      "storage-settings": "清理临时文件可以释放空间",
      "temp-files": "%temp%文件夹有很多临时文件",
      "software-distribution": "清理Windows更新缓存",
      "wechat-settings": "修改微信存储位置到其他盘",
    };
    
    setShowHint(hints[phase] || "继续探索");
    
    setTimeout(() => {
      setShowHint(null);
      setHintCooldown(false);
    }, 3000);
  }, [hintCooldown, phase, play]);

  const getImageSrc = () => {
    switch (phase) {
      case "start":
      case "storage-warning":
        return "/pinterest/office/office1.png";
      case "this-pc":
        return "/pinterest/office/office2.png";
      case "downloads":
        return "/pinterest/office/office3.png";
      case "desktop":
        return "/pinterest/office/office4.png";
      case "recycle-bin":
        return "/pinterest/office/office6.png";
      case "sticky-note":
        return "/pinterest/office/office5.png";
      case "browser-search":
        return "/pinterest/office/office8.png";
      case "storage-settings":
        return "/pinterest/office/office7.png";
      case "temp-files":
        return "/pinterest/office/office9.png";
      case "software-distribution":
        return "/pinterest/office/office10.png";
      case "wechat-settings":
        return "/pinterest/office/office11.png";
      case "success":
        return "/pinterest/office/office12.png";
      default:
        return "/pinterest/office/office1.png";
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key="background"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <Image
            src={getImageSrc()}
            alt="Office Mission"
            fill
            className="object-cover"
            quality={100}
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute top-4 right-4 z-30">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2">
          <div className="text-white/80 text-sm">Time Left:</div>
          <div className="text-white text-xl font-bold">{timeLeft} min</div>
        </div>
      </div>

      <div className="absolute top-4 left-4 z-30">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2">
          <div className="text-white/80 text-sm">C盘容量</div>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-32 h-3 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full transition-colors ${
                  cDrivePercent > 90 ? "bg-red-500" : cDrivePercent > 70 ? "bg-yellow-500" : "bg-green-500"
                }`}
                initial={{ width: "99%" }}
                animate={{ width: `${cDrivePercent}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-white text-sm">{cDrivePercent}%</span>
          </div>
        </div>
      </div>

      {showDialog && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none"
        >
          <div
            className="bg-[#f5e6d3] border-4 border-[#dcc4a0] rounded-xl p-8 shadow-2xl w-[80%] max-w-lg pointer-events-auto"
            style={{
              boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
            }}
          >
            <p className="text-[#5d4a37] text-lg font-game-serif leading-relaxed whitespace-pre-line text-center">
              {showDialog}
            </p>
          </div>
        </motion.div>
      )}

      {showButton && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleButtonClick}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 px-12 py-4 bg-[#5d4a37] text-white text-xl font-serif tracking-[0.15em] uppercase hover:bg-[#4a3a2a] transition-colors rounded-full shadow-xl"
        >
          {buttonText}
        </motion.button>
      )}

      <AnimatePresence>
        <ConfirmDialog
          open={showExitConfirm}
          title="确认退出"
          message="确定要退出当前任务吗？进度将不会保存。"
          confirmText="确认退出"
          onConfirm={() => {
            play("ui-confirm");
            setShowExitConfirm(false);
            void transitionToScene(SCENE_IDS.OFFICE);
          }}
          onCancel={() => {
            play("ui-cancel");
            setShowExitConfirm(false);
          }}
        />
      </AnimatePresence>

      <div className="absolute left-4 bottom-20 z-30">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 space-y-3">
          {OFFICE_REPAIR_STEPS.map((step) => {
            const isCompleted = completedSteps.includes(step.id);
            const allCompleted = OFFICE_REPAIR_STEPS.every((s) => completedSteps.includes(s.id));
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

      <motion.button
        type="button"
        onClick={() => {
          play("ui-confirm");
          setShowExitConfirm(true);
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full text-white/70 text-sm hover:text-white hover:bg-black/60 transition-colors z-[55] border border-white/20 flex items-center gap-1.5"
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
            className="absolute inset-0 z-[60] bg-black"
          />
        )}
      </AnimatePresence>

      {(phase === "downloads" || phase === "desktop" || phase === "recycle-bin" || phase === "temp-files" || phase === "wechat-settings") && (
        <div className="absolute inset-0 z-50 pointer-events-none">
          {(phase === "downloads") && (
            <div className="absolute top-1/4 left-1/4 flex flex-col gap-4">
              <motion.button
                type="button"
                onClick={() => handleFileClick("Movie.mp4", 8)}
                className="w-32 h-12 bg-red-500/80 hover:bg-red-600 rounded-lg text-white text-sm font-bold flex items-center justify-center shadow-lg pointer-events-auto whitespace-pre-line"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                disabled={clickedFiles.includes("Movie.mp4")}
              >
                {clickedFiles.includes("Movie.mp4") ? "✓ 已删除" : "Movie.mp4\n7.8GB"}
              </motion.button>
              <motion.button
                type="button"
                onClick={() => handleFileClick("OfficeInstaller.exe", 2)}
                className="w-32 h-12 bg-orange-500/80 hover:bg-orange-600 rounded-lg text-white text-sm font-bold flex items-center justify-center shadow-lg pointer-events-auto whitespace-pre-line"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                disabled={clickedFiles.includes("OfficeInstaller.exe")}
              >
                {clickedFiles.includes("OfficeInstaller.exe") ? "✓ 已删除" : "OfficeInstaller.exe\n2GB"}
              </motion.button>
              <motion.button
                type="button"
                onClick={() => handleFileClick("OldProject.zip", 3)}
                className="w-32 h-12 bg-yellow-500/80 hover:bg-yellow-600 rounded-lg text-white text-sm font-bold flex items-center justify-center shadow-lg pointer-events-auto whitespace-pre-line"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                disabled={clickedFiles.includes("OldProject.zip")}
              >
                {clickedFiles.includes("OldProject.zip") ? "✓ 已删除" : "OldProject.zip\n3GB"}
              </motion.button>
            </div>
          )}
          {(phase === "desktop") && (
            <div className="absolute top-1/4 left-1/4 flex flex-col gap-4">
              <motion.button
                type="button"
                onClick={() => handleFileClick("Zoom Recording", 2)}
                className="w-28 h-10 bg-blue-500/80 hover:bg-blue-600 rounded-lg text-white text-xs font-bold flex items-center justify-center shadow-lg pointer-events-auto"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                disabled={clickedFiles.includes("Zoom Recording")}
              >
                {clickedFiles.includes("Zoom Recording") ? "✓" : "Zoom Recording"}
              </motion.button>
              <motion.button
                type="button"
                onClick={() => handleFileClick("Screenshots", 1)}
                className="w-28 h-10 bg-purple-500/80 hover:bg-purple-600 rounded-lg text-white text-xs font-bold flex items-center justify-center shadow-lg pointer-events-auto"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                disabled={clickedFiles.includes("Screenshots")}
              >
                {clickedFiles.includes("Screenshots") ? "✓" : "Screenshots"}
              </motion.button>
              <motion.button
                type="button"
                onClick={() => handleFileClick("Screen Recording", 4)}
                className="w-28 h-10 bg-pink-500/80 hover:bg-pink-600 rounded-lg text-white text-xs font-bold flex items-center justify-center shadow-lg pointer-events-auto"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                disabled={clickedFiles.includes("Screen Recording")}
              >
                {clickedFiles.includes("Screen Recording") ? "✓" : "Screen Recording"}
              </motion.button>
            </div>
          )}
          {(phase === "recycle-bin") && (
            <motion.button
              type="button"
              onClick={handleButtonClick}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-green-500/70 hover:bg-green-600 rounded-full text-white text-lg font-bold flex flex-col items-center justify-center shadow-xl border-4 border-green-400 pointer-events-auto"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-3xl">🗑️</span>
              <span className="text-sm mt-1">清空回收站</span>
              <span className="text-xs mt-0.5">(18.4GB)</span>
            </motion.button>
          )}
          {(phase === "temp-files") && (
            <div className="absolute top-1/4 left-1/4 flex flex-col gap-4">
              <motion.button
                type="button"
                onClick={() => handleFileClick("cache.tmp", 3)}
                className="w-28 h-8 bg-gray-500/80 hover:bg-gray-600 rounded text-white text-xs font-bold flex items-center justify-center shadow-lg pointer-events-auto"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                disabled={clickedFiles.includes("cache.tmp")}
              >
                {clickedFiles.includes("cache.tmp") ? "✓" : "cache.tmp"}
              </motion.button>
              <motion.button
                type="button"
                onClick={() => handleFileClick("log.txt", 2)}
                className="w-28 h-8 bg-gray-500/80 hover:bg-gray-600 rounded text-white text-xs font-bold flex items-center justify-center shadow-lg pointer-events-auto"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                disabled={clickedFiles.includes("log.txt")}
              >
                {clickedFiles.includes("log.txt") ? "✓" : "log.txt"}
              </motion.button>
              <motion.button
                type="button"
                onClick={() => handleFileClick("temp.dat", 3)}
                className="w-28 h-8 bg-gray-500/80 hover:bg-gray-600 rounded text-white text-xs font-bold flex items-center justify-center shadow-lg pointer-events-auto"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                disabled={clickedFiles.includes("temp.dat")}
              >
                {clickedFiles.includes("temp.dat") ? "✓" : "temp.dat"}
              </motion.button>
            </div>
          )}
          {(phase === "wechat-settings") && (
            <motion.button
              type="button"
              onClick={handleButtonClick}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-8 py-4 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-lg font-bold shadow-xl border-2 border-blue-400 pointer-events-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              选择 D:\\WeChat 作为新存储位置
            </motion.button>
          )}
        </div>
      )}

      <motion.button
        type="button"
        onClick={handleGetHint}
        disabled={hintCooldown}
        className="absolute bottom-4 right-4 px-4 py-2 bg-blue-500/80 hover:bg-blue-600 disabled:bg-gray-500 text-white text-sm font-bold rounded-full shadow-lg z-30 flex items-center gap-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        💡 提示
      </motion.button>

      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-xl"
          >
            {showHint}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
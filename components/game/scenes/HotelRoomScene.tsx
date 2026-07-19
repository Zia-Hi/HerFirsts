"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SettingsButton, SettingsPanel, KnowledgeNotebook } from "@/components/game/ui";
import { useGameAudio } from "@/hooks/useGameAudio";
import { useSceneTransition } from "@/hooks/useSceneTransition";
import { SCENE_IDS } from "@/lib/game";
import { useKnowledgeStore } from "@/store/knowledge-store";

type StoryPhase = "enter" | "view1" | "view2" | "story" | "ready";

export function HotelRoomScene() {
  const [showSettings, setShowSettings] = useState(false);
  const [storyPhase, setStoryPhase] = useState<StoryPhase>("enter");
  const [currentView, setCurrentView] = useState(1);
  const [showDialog, setShowDialog] = useState<string | null>(null);
  const [fadeToBlack, setFadeToBlack] = useState(false);

  const { play } = useGameAudio();
  const { transitionToScene } = useSceneTransition();
  const { openNotebook, closeNotebook, notebookOpen } = useKnowledgeStore();

  useEffect(() => {
    play("ambient-apartment");
    
    const timeline = [
      { delay: 0, action: () => setStoryPhase("view1"), dialog: "这是一个看起来很普通的酒店房间..." },
      { delay: 3000, action: () => { setCurrentView(2); setStoryPhase("view2"); }, dialog: "窗外的景色很美，但总觉得哪里不对劲..." },
      { delay: 5500, action: () => setStoryPhase("story"), dialog: null },
      { delay: 5500, action: () => {}, dialog: "突然想起新闻里说过，有些不法分子会在酒店房间安装隐蔽的摄像头..." },
      { delay: 8500, action: () => {}, dialog: "为了安全起见，还是检查一下房间比较好。" },
      { delay: 11500, action: () => setStoryPhase("ready"), dialog: null },
    ];

    const timers = timeline.map((item) => {
      return setTimeout(() => {
        item.action();
        if (item.dialog) {
          setShowDialog(item.dialog);
          if (item.action.toString().includes("setStoryPhase")) {
            setTimeout(() => setShowDialog(null), 2500);
          }
        }
      }, item.delay);
    });

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [play]);

  const handleStartMission = () => {
    play("ui-confirm");
    setFadeToBlack(true);
    setTimeout(() => {
      void transitionToScene(SCENE_IDS.HOTEL_MISSION);
    }, 1000);
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="relative h-full w-full">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentView}
            src={currentView === 1 ? "/pinterest/hotel/hotel_1.jpg" : "/pinterest/hotel/hotel_2.jpg"}
            alt={`Hotel room view ${currentView}`}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </AnimatePresence>
      </div>

      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 50% 50%, transparent 0%, rgba(0,0,0,0.1) 70%, rgba(0,0,0,0.3) 100%)",
      }} />

      <div className="absolute top-4 right-4 z-30 flex flex-col gap-4 items-center">
        <motion.button
          type="button"
          onClick={() => {
            play("ui-confirm");
            void transitionToScene(SCENE_IDS.HOTEL);
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center hover:scale-110 transition-transform"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="返回酒店大厅"
        >
          <div className="w-12 h-12 bg-[#f5e6d3] border-2 border-[#dcc4a0] rounded-lg shadow-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5d4a37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className="font-game-sans mt-1 block text-center text-[10px] uppercase tracking-widest text-cream-100 opacity-90">
            Back
          </span>
        </motion.button>

        <motion.button
          type="button"
          onClick={() => {
            play("ui-confirm");
            openNotebook();
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center hover:scale-110 transition-transform"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="Notebook"
        >
          <div className="w-12 h-12 bg-[#f5e6d3] border-2 border-[#dcc4a0] rounded-lg shadow-lg flex items-center justify-center">
            <span className="text-[#5d4a37] font-game-serif text-xl">📖</span>
          </div>
          <span className="font-game-sans mt-1 block text-center text-[10px] uppercase tracking-widest text-cream-100 opacity-90">
            Notebook
          </span>
        </motion.button>

        <SettingsButton
          onClick={() => setShowSettings(true)}
          className="relative flex flex-col items-center hover:scale-110 transition-transform"
        />
      </div>

      <AnimatePresence>
        {showDialog && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute inset-x-0 bottom-28 z-30 flex justify-center px-8"
          >
            <div className="max-w-lg bg-[#f5e6d3] rounded-xl shadow-2xl p-6 relative">
              <div className="border-b border-[#dcc4a0] pb-3 mb-3">
                <span className="text-sm text-gray-500 uppercase tracking-wider">提示</span>
              </div>
              <p className="text-gray-800 text-lg font-serif leading-relaxed">
                {showDialog}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {storyPhase === "ready" && !fadeToBlack && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-x-0 bottom-4 z-30 flex justify-center px-8"
          >
            <motion.button
              type="button"
              onClick={handleStartMission}
              className="px-12 py-4 bg-[#5d4a37] text-white text-xl font-serif tracking-[0.15em] uppercase hover:bg-[#4a3a2a] transition-colors rounded-full shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Mission
            </motion.button>
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

      <SettingsPanel open={showSettings} onClose={() => setShowSettings(false)} />
      <KnowledgeNotebook
        open={notebookOpen}
        card={null}
        onClose={closeNotebook}
      />
    </div>
  );
}

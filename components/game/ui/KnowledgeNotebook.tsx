"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useKnowledgeStore } from "@/store";
import type { KnowledgeCard } from "@/types";

interface KnowledgeNotebookProps {
  open: boolean;
  card: KnowledgeCard | null;
  onClose: () => void;
}

export function KnowledgeNotebook({ open, card: externalCard, onClose }: KnowledgeNotebookProps) {
  const cards = useKnowledgeStore((s) => s.cards);
  const openCard = useKnowledgeStore((s) => s.openNotebook);
  const activeCardId = useKnowledgeStore((s) => s.activeCardId);
  
  const activeCard = activeCardId ? cards.find((c) => c.id === activeCardId) : null;
  const card = externalCard || activeCard;

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {card ? (
        <motion.div
          key="card-detail"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        >
          <div
            className="relative max-w-xl w-full max-h-[85vh] flex flex-col"
            style={{
              background:
                "linear-gradient(135deg, #fdfbf7 0%, #f5e6d3 50%, #e8d5b7 100%)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-[#5d4a37]/80 text-white rounded-full hover:bg-[#5d4a37] transition-colors"
            >
              ✕
            </button>
            
            <div className="flex-1 flex flex-col max-h-[85vh] overflow-hidden">
              <div className="p-6 pt-14 border-4 border-[#8b7d6b]/20 flex flex-col h-full">
                <div className="flex-1 overflow-y-auto pr-2" style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#c4a77d #f5e6d3'
                }}>
                  <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-[#8b7d6b]/30">
                    <h2 className="font-game-serif text-3xl font-bold text-[#4a3a2a]">
                      {card.title}
                    </h2>
                    <span className="text-sm text-[#8b7d6b] uppercase tracking-widest">
                      Mission {cards.findIndex((c) => c.id === card.id) + 1}
                    </span>
                  </div>

                  <div className="space-y-6 pb-4">
                    <div>
                      <h3 className="font-game-serif text-xl font-semibold text-[#5d4a37] mb-2">
                        问题
                      </h3>
                      <p className="text-[#4a3a2a] leading-relaxed text-lg">
                        {card.problem}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-game-serif text-xl font-semibold text-[#5d4a37] mb-2">
                        原因
                      </h3>
                      <p className="text-[#4a3a2a] leading-relaxed text-lg">
                        {card.cause}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-game-serif text-xl font-semibold text-[#5d4a37] mb-3">
                        解决方法
                      </h3>
                      <ol className="list-decimal list-inside space-y-3">
                        {card.repairSteps.map((step, i) => (
                          <li key={i} className="text-[#4a3a2a] leading-relaxed text-lg">
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>

                    {card.tools && card.tools.length > 0 && (
                      <div>
                        <h3 className="font-game-serif text-xl font-semibold text-[#5d4a37] mb-2">
                          需要工具
                        </h3>
                        <ul className="list-disc list-inside space-y-1">
                          {card.tools.map((tool, i) => (
                            <li key={i} className="text-[#4a3a2a] leading-relaxed">
                              {tool}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {card.safetyTips && card.safetyTips.length > 0 && (
                      <div>
                        <h3 className="font-game-serif text-xl font-semibold text-[#5d4a37] mb-2">
                          安全提示
                        </h3>
                        <ul className="list-disc list-inside space-y-1">
                          {card.safetyTips.map((tip, i) => (
                            <li key={i} className="text-[#4a3a2a] leading-relaxed">
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t-2 border-[#8b7d6b]/30 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      setTimeout(() => openCard());
                    }}
                    className="font-game-sans text-sm uppercase tracking-widest text-[#8b7d6b] hover:text-[#5d4a37] transition-colors"
                  >
                    返回列表
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 bg-[#5d4a37] text-white text-base font-serif tracking-wider hover:bg-[#4a3a2a] transition-colors rounded-full"
                  >
                    关闭
                  </button>
                </div>
              </div>
            </div>

            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-32 bg-[#c4a77d] rounded-l-lg" />
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-4 h-28 bg-[#a68b5b]" />
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="card-list"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-xl shadow-2xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #f5e6d3 0%, #e8d5b7 50%, #dcc4a0 100%)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          }}
        >
          <div className="p-6 border-b border-[#8b7d6b]/30">
            <h2 className="font-game-serif text-2xl font-bold text-[#4a3a2a]">
              Notebook
            </h2>
            <p className="text-[#8b7d6b] text-sm mt-1">
              已收集的技能卡
            </p>
          </div>

          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {cards.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#8b7d6b]">还未收集技能卡哦~</p>
                <p className="text-[#8b7d6b] text-sm mt-2">完成任务后将解锁技能卡</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {cards.map((cardItem, index) => (
                  <motion.div
                    key={cardItem.id}
                    initial={{ opacity: 0, scale: 0.9, rotateY: -90 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 0.9, rotateY: 90 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="rounded-lg overflow-hidden cursor-pointer"
                    style={{
                      background: "linear-gradient(135deg, #fdfbf7 0%, #f5e6d3 50%, #e8d5b7 100%)",
                      border: "2px solid rgba(139,125,107,0.3)",
                      perspective: "1000px",
                    }}
                    onClick={() => openCard(cardItem.id)}
                  >
                    <div className="p-4">
                      <h3 className="font-game-serif text-base font-bold text-[#4a3a2a] truncate">
                        Mission{index + 1}：{cardItem.title}
                      </h3>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openCard(cardItem.id);
                        }}
                        className="mt-3 w-full py-2 bg-[#5d4a37] text-white text-xs font-serif tracking-wider hover:bg-[#4a3a2a] transition-colors rounded-full"
                      >
                        点击查看
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-[#8b7d6b]/30">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 bg-[#5d4a37] text-white font-serif tracking-wider hover:bg-[#4a3a2a] transition-colors rounded-full"
            >
              关闭 Notebook
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface FailureHintProps {
  hint: string | null;
  onDismiss: () => void;
}

export function FailureHint({ hint, onDismiss }: FailureHintProps) {
  return (
    <AnimatePresence>
      {hint && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-x-0 bottom-[12%] z-40 flex justify-center px-6"
        >
          <div className="max-w-md border-l-2 border-gold-400/50 bg-ink/20 px-5 py-3 backdrop-blur-sm">
            <p className="font-game-serif text-sm leading-relaxed text-cream-100/90">{hint}</p>
            <button
              type="button"
              onClick={onDismiss}
              className="font-game-sans mt-2 text-[10px] uppercase tracking-widest text-cream-200/50 hover:text-cream-200/80"
            >
              Continue
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { getTool } from "@/lib/game/tools";
import type { InventoryItem, ToolId } from "@/types";

interface InventoryPanelProps {
  items: InventoryItem[];
  heldItem: ToolId | null;
  visible: boolean;
  onSelectItem: (toolId: ToolId) => void;
}

export function InventoryPanel({
  items,
  heldItem,
  visible,
  onSelectItem,
}: InventoryPanelProps) {
  if (!visible || items.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-8 right-8 z-30 flex flex-col items-end gap-3"
    >
      <p className="font-game-sans text-sm uppercase tracking-[0.15em] text-cream-200/70">
        Items
      </p>
      <div className="flex flex-col gap-2">
        {items.map((item) => {
          const isTool = (item.id as ToolId) in {
            "adjustable-wrench": true,
            screwdriver: true,
            "plumber-tape": true,
            gloves: true,
          };
          const tool = isTool ? getTool(item.id as ToolId) : null;
          const isHeld = heldItem === item.id;
          return (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => isTool && onSelectItem(item.id as ToolId)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-3 border-l-4 px-4 py-3 transition-colors rounded-r-lg shadow-md ${
                isHeld
                  ? "border-gold-400/70 bg-oak-500/30"
                  : "border-sage-400/50 bg-ink/20 hover:border-sage-400/70 hover:bg-ink/30"
              }`}
            >
              {item.id === "vinegar" ? (
                <Image
                  src="/images/shower/vinegar.png"
                  alt="白醋"
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain"
                />
              ) : item.id === "plastic-bag" ? (
                <Image
                  src="/images/shower/plastic_bag.png"
                  alt="塑料袋"
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain"
                />
              ) : (
                <span className="text-2xl">{tool?.icon || "📦"}</span>
              )}
              <span className="font-game-sans text-sm text-cream-100">{item.name}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

interface ToolboxProps {
  open: boolean;
  onClose: () => void;
  onPickTool: (toolId: ToolId) => void;
  collectedTools: InventoryItem[];
}

export function Toolbox({ open, onClose, onPickTool, collectedTools }: ToolboxProps) {
  const allTools: ToolId[] = [
    "adjustable-wrench",
    "screwdriver",
    "plumber-tape",
    "gloves",
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-ink/30"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute left-1/2 top-1/2 z-50 w-72 -translate-x-1/2 -translate-y-1/2 border border-oak-500/30 bg-beige-100/95 p-5 shadow-lg"
          >
            <p className="font-game-serif mb-4 text-center text-sm text-ink/80">
              Toolbox
            </p>
            <div className="grid grid-cols-2 gap-3">
              {allTools.map((toolId) => {
                const tool = getTool(toolId);
                const collected = collectedTools.some((item) => item.id === toolId);
                return (
                  <button
                    key={toolId}
                    type="button"
                    disabled={collected}
                    onClick={() => onPickTool(toolId)}
                    className={`flex flex-col items-center gap-1 p-3 transition-all ${
                      collected
                        ? "opacity-30 cursor-default"
                        : "hover:bg-sage-200/40 cursor-pointer"
                    }`}
                  >
                    <span className="text-2xl">{tool.icon}</span>
                    <span className="font-game-sans text-[10px] text-ink/70">{tool.name}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

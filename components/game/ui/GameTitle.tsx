"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface GameTitleProps {
  visible: boolean;
  onComplete?: () => void;
}

export function GameTitle({ visible, onComplete }: GameTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={visible ? { opacity: 1 } : { opacity: 0 }}
      exit={{ opacity: 0, scale: 1.2 }}
      transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
      onAnimationComplete={() => {
        if (onComplete) setTimeout(onComplete, 4000);
      }}
      className="pointer-events-none absolute inset-0 z-50 flex flex-col items-center justify-center"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
        transition={{ delay: 0.3, duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute inset-0"
      >
        <div className="relative h-full w-full">
          <Image
            src="/images/landing_page.png"
            alt="Apartment interior"
            fill
            className="object-cover"
            priority
            quality={100}
          />
        </div>

        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.25) 100%)",
          }}
        />

        <motion.div
          className="absolute top-[20%] left-1/2 -translate-x-1/2 w-64 h-24"
          animate={{ opacity: [0.6, 0.7, 0.6] }}
          transition={{ duration: 4, repeat: Infinity }}
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(242, 235, 221, 0.95) 0%, rgba(232, 223, 208, 0.9) 100%)",
          }}
        />

        {[...Array(25)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full bg-white/20"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              width: 1 + Math.random() * 2,
              height: 1 + Math.random() * 2,
            }}
            animate={{
              y: [0, -30],
              x: [0, 6],
              opacity: [0, 0.35, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              delay: Math.random() * 3,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ delay: 0.8, duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative z-10 text-center"
      >
        <h1 className="font-game-serif text-6xl md:text-8xl font-light tracking-[0.3em] text-cream-100 drop-shadow-lg">
          HER FIRSTS
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 1.5, duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative z-10 mt-6 text-center"
      >
        <p className="font-game-sans text-lg md:text-xl tracking-[0.2em] text-cream-200/80 uppercase">
          Every first time deserves confidence.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={visible ? { opacity: [0, 0, 0.5, 0] } : { opacity: 0 }}
        transition={{ delay: 3, duration: 2 }}
        className="relative z-10 mt-8"
      >
        <p className="font-game-serif text-sm tracking-widest text-cream-200/40">
          Press any key to continue
        </p>
      </motion.div>
    </motion.div>
  );
}
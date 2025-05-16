'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface LevelUpAnimationProps {
  level: number;
  rewards: string[];
  onComplete: () => void;
}

export function LevelUpAnimation({
  level,
  rewards,
  onComplete,
}: LevelUpAnimationProps) {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 1,
          scale: [0.8, 1.2, 1],
          rotate: [0, 10, -10, 0],
        }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
      >
        <div className="relative">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl font-bold text-yellow-400 text-center mb-4 text-shadow-lg"
          >
            Level Up!
          </motion.div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-6xl font-bold text-yellow-500 text-center mb-6"
          >
            {level}
          </motion.div>

          {rewards.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <div className="text-lg text-yellow-300 mb-2">
                새로운 능력 해금!
              </div>
              {rewards.map((reward, index) => (
                <motion.div
                  key={reward}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="text-white text-lg mb-1"
                >
                  {reward}
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Particle effects */}
          <motion.div
            className="absolute inset-0"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                style={{
                  left: `${50 + Math.cos((i * 30 * Math.PI) / 180) * 100}%`,
                  top: `${50 + Math.sin((i * 30 * Math.PI) / 180) * 100}%`,
                }}
                variants={{
                  hidden: {
                    opacity: 0,
                    scale: 0,
                    x: 0,
                    y: 0,
                  },
                  visible: {
                    opacity: [1, 0],
                    scale: [0, 2],
                    x: Math.cos((i * 30 * Math.PI) / 180) * 100,
                    y: Math.sin((i * 30 * Math.PI) / 180) * 100,
                    transition: {
                      duration: 1,
                      repeat: 2,
                      repeatType: 'loop',
                    },
                  },
                }}
              />
            ))}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

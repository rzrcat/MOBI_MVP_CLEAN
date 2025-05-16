'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useHelperStore } from '@/store/useHelperStore';
import { MessageBubble } from './MessageBubble';
import { SettingsPanel } from './SettingsPanel';
import { LevelUpAnimation } from './LevelUpAnimation';

interface LevelUpState {
  level: number;
  rewards: string[];
}

export interface HelperCharacterProps {
  position?: 'bottom-right' | 'bottom-left';
  size?: 'small' | 'medium' | 'large';
  defaultMessage?: string;
}

export function HelperCharacter({}: HelperCharacterProps) {
  const {
    character,
    isSettingsOpen,
    currentAnimation,
    currentExpression,
    updateCharacter,
    setSettingsOpen,
    updateLastInteraction,
    setAnimation,
    gainExperience,
  } = useHelperStore();

  const [isDragging, setIsDragging] = useState(false);
  const [levelUpState, setLevelUpState] = useState<LevelUpState | null>(null);
  const dragStartPos = { x: 0, y: 0 };

  // Track level changes for animation
  useEffect(() => {
    const handleLevelUp = (level: number, rewards: string[]) => {
      setLevelUpState({ level, rewards });
      setAnimation('excited');
    };

    // Subscribe to level up events
    const unsubscribe = useHelperStore.subscribe(
      (state) => state.character.level,
      (level: number) => {
        // 레벨업 시 애니메이션
        const rewards = ['새로운 표정', '더 많은 상호작용']; // Example rewards
        handleLevelUp(level, rewards);
      }
    );

    return () => unsubscribe();
  }, [setAnimation]);

  // Handle drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartPos.x = e.clientX;
    dragStartPos.y = e.clientY;
  };

  // 모바일 환경에서의 터치 이벤트 처리
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches && e.touches[0]) {
      setIsDragging(true);
      dragStartPos.x = e.touches[0].clientX;
      dragStartPos.y = e.touches[0].clientY;
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const dx = e.clientX - dragStartPos.x;
      const dy = e.clientY - dragStartPos.y;

      updateCharacter({
        position: {
          x: character.settings.position.x + dx,
          y: character.settings.position.y + dy,
        },
      });

      dragStartPos.x = e.clientX;
      dragStartPos.y = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !e.touches || !e.touches[0]) return;

      const dx = e.touches[0].clientX - dragStartPos.x;
      const dy = e.touches[0].clientY - dragStartPos.y;

      updateCharacter({
        position: {
          x: character.settings.position.x + dx,
          y: character.settings.position.y + dy,
        },
      });

      dragStartPos.x = e.touches[0].clientX;
      dragStartPos.y = e.touches[0].clientY;
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        updateLastInteraction();
      }
    };

    const handleTouchEnd = () => {
      if (isDragging) {
        setIsDragging(false);
        updateLastInteraction();
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [
    isDragging,
    character.settings.position,
    updateCharacter,
    updateLastInteraction,
  ]);

  // 화면 크기에 따른 캐릭터 크기 조정
  const characterSize =
    character.settings.size === 'small'
      ? 'w-10 h-10 sm:w-12 sm:h-12'
      : character.settings.size === 'large'
        ? 'w-16 h-16 sm:w-20 sm:h-20'
        : 'w-14 h-14 sm:w-16 sm:h-16';

  if (character.settings.isHidden) return null;

  return (
    <>
      <motion.div
        style={{
          position: 'fixed',
          left: `${character.settings.position.x}px`,
          top: `${character.settings.position.y}px`,
          opacity: character.settings.opacity,
          cursor: isDragging ? 'grabbing' : 'grab',
          zIndex: 1000,
        }}
        className={`transition-all duration-300 ease-in-out ${characterSize}`}
        animate={
          currentAnimation
            ? {
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }
            : {}
        }
        transition={{
          duration: 0.5,
          ease: 'easeInOut',
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={() => {
          if (!isDragging) {
            setSettingsOpen(true);
            updateLastInteraction();
            gainExperience({ type: 'interaction' });
          }
        }}
      >
        <div className="relative group">
          <div
            className={`rounded-full bg-blue-100 hover:bg-blue-200 transition-colors p-1.5 sm:p-2
              ${character.settings.useAnimation ? 'hover:animate-bounce' : ''}`}
          >
            <Image
              src={`/images/helper/${character.type}${currentExpression ? `-${currentExpression}` : ''}.png`}
              alt={character.name}
              width={64}
              height={64}
              className="w-full h-full object-contain"
              draggable={false}
            />
          </div>

          <MessageBubble />
        </div>
      </motion.div>

      {/* Settings Panel */}
      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsPanel
            character={character}
            onSettingsChange={updateCharacter}
            onClose={() => setSettingsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Level Up Animation */}
      {levelUpState && (
        <LevelUpAnimation
          level={levelUpState.level}
          rewards={levelUpState.rewards}
          onComplete={() => {
            setLevelUpState(null);
            setAnimation(null);
          }}
        />
      )}
    </>
  );
}

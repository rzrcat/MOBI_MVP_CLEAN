'use client';

import { useState, useEffect } from 'react';
import { useHelperStore } from '@/store/useHelperStore';
import {
  DailyTask,
  getDailyTasks,
  isTaskResettable,
  resetTask,
  updateTaskProgress,
  getTaskProgress,
} from '@/utils/common/dailyTasks';

export function useDailyTasks() {
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const { addMessage, setAnimation, gainExperience } = useHelperStore();

  // Initial load and reset check
  useEffect(() => {
    const loadTasks = () => {
      let currentTasks = getDailyTasks();

      // Check for resets
      currentTasks = currentTasks.map((task) =>
        isTaskResettable(task) ? resetTask(task) : task
      );

      setTasks(currentTasks);
    };

    loadTasks();
    // Check for resets every hour
    const intervalId = setInterval(loadTasks, 60 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Progress monitoring
  useEffect(() => {
    const progress = getTaskProgress(tasks);

    // Check if all daily tasks are complete
    if (
      progress.daily.completed === progress.daily.total &&
      progress.daily.total > 0
    ) {
      addMessage({
        content: '오늘의 모든 일일 퀘스트를 완료했어요! 수고하셨습니다! 🎉',
        type: 'quest',
      });
      setAnimation('happy');
      setTimeout(() => setAnimation(null), 1000);

      // Award experience for completing all daily tasks
      gainExperience({
        type: 'daily_complete',
        multiplier: 1.5, // Bonus for completing all tasks
      });
    }

    // Check if all weekly tasks are complete
    if (
      progress.weekly.completed === progress.weekly.total &&
      progress.weekly.total > 0
    ) {
      addMessage({
        content: '이번 주의 모든 주간 퀘스트를 완료했어요! 대단해요! 🌟',
        type: 'quest',
      });
      setAnimation('happy');
      setTimeout(() => setAnimation(null), 1000);

      // Award experience for completing all weekly tasks
      gainExperience({
        type: 'weekly_complete',
        multiplier: 2, // Bigger bonus for weekly completion
      });
    }
  }, [tasks, addMessage, setAnimation, gainExperience]);

  const updateTask = (taskId: string, increment = 1) => {
    setTasks((currentTasks) => {
      const taskIndex = currentTasks.findIndex((t) => t.id === taskId);
      if (taskIndex === -1) return currentTasks;

      const task = currentTasks[taskIndex];
      const updatedTask = updateTaskProgress(task, increment);
      const newTasks = [...currentTasks];
      newTasks[taskIndex] = updatedTask;

      // If task was just completed, show a message and award experience
      if (updatedTask.isComplete && !task.isComplete) {
        addMessage({
          content: `'${updatedTask.title}' 퀘스트를 완료했어요!`,
          type: 'quest',
        });
        setAnimation('happy');
        setTimeout(() => setAnimation(null), 1000);

        gainExperience({
          type:
            updatedTask.type === 'weekly'
              ? 'weekly_complete'
              : 'quest_complete',
        });
      }

      return newTasks;
    });
  };

  return {
    tasks,
    updateTask,
    progress: getTaskProgress(tasks),
  };
}

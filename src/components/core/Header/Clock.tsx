'use client';

import { useState, useEffect } from 'react';

export const Clock = () => {
  const [time, setTime] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}:${seconds}`);
    };

    // 초기 시간 설정
    updateTime();

    // 1초마다 시간 업데이트
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="text-footnote text-ios-blue dark:text-ios-teal font-medium px-2 py-1 rounded-full bg-ios-blue/10 dark:bg-gray-800/80">
      {time}
    </div>
  );
};

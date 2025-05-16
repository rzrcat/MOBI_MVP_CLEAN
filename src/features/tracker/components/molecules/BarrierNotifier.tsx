/**
 * 결계 알리미 컴포넌트
 * 결계 시작 시간을 추적하고 사용자가 설정한 시간에 알림을 표시합니다.
 */
import React, { useEffect, useState, useRef } from 'react';

const DEFAULT_SOUNDS = [
  { name: '기본음 1', url: '/sounds/notify1.mp3' },
  { name: '기본음 2', url: '/sounds/notify2.mp3' },
  { name: '기본음 3', url: '/sounds/notify3.mp3' },
];

function getNextBarrierTimes() {
  const now = new Date();
  const times = [];
  for (let h = 0; h <= 24; h += 3) {
    const t = new Date(now);
    t.setHours(h, 0, 0, 0);
    if (t > now) times.push(t);
  }
  // 내일 00시도 추가
  if (times.length === 0) {
    const t = new Date(now);
    t.setDate(t.getDate() + 1);
    t.setHours(0, 0, 0, 0);
    times.push(t);
  }
  return times;
}

export function BarrierNotifier() {
  const [enabled, setEnabled] = useState(false);
  const [alertMinutes, setAlertMinutes] = useState<number[]>([10]);
  const [selectedSound, setSelectedSound] = useState(DEFAULT_SOUNDS[0].url);
  const [customSound, setCustomSound] = useState<string | null>(null);
  const [nextBarrier, setNextBarrier] = useState<Date | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 다음 결계 시간 계산
  useEffect(() => {
    const update = () => {
      const next = getNextBarrierTimes()[0];
      setNextBarrier(next);
    };
    update();
    const timer = setInterval(update, 1000 * 60);
    return () => clearInterval(timer);
  }, []);

  // 알림 예약
  useEffect(() => {
    if (!enabled || !nextBarrier) return;
    const now = new Date();
    const notiTimes = alertMinutes.map(
      (min) => new Date(nextBarrier.getTime() - min * 60000)
    );
    const timers: NodeJS.Timeout[] = [];
    notiTimes.forEach((t) => {
      const ms = t.getTime() - now.getTime();
      if (ms > 0) {
        timers.push(
          setTimeout(() => {
            // 브라우저 알림
            if (Notification.permission === 'granted') {
              new Notification('결계 시작 알림', {
                body: `${alertMinutes.join(', ')}분 후 결계가 시작됩니다!`,
              });
            }
            // 사운드 재생
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play();
            }
          }, ms)
        );
      }
    });
    return () => timers.forEach(clearTimeout);
  }, [enabled, nextBarrier, alertMinutes, selectedSound, customSound]);

  // 알림 권한 요청
  useEffect(() => {
    if (enabled && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, [enabled]);

  // 남은 시간 계산
  const [remain, setRemain] = useState('');
  useEffect(() => {
    if (!nextBarrier) return;
    const update = () => {
      const now = new Date();
      const diff = nextBarrier.getTime() - now.getTime();
      if (diff <= 0) {
        setRemain('곧 시작!');
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemain(`${h}시간 ${m}분 ${s}초`);
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [nextBarrier]);

  // 사용자 음원 업로드
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomSound(url);
      setSelectedSound(url);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-xl shadow space-y-4 border mt-6">
      <div className="flex items-center gap-2">
        <span className="font-bold text-blue-700">결계 알리미</span>
        <label className="ml-auto flex items-center gap-1 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={enabled}
            onChange={() => setEnabled((v) => !v)}
          />
          <span className="text-xs">ON</span>
        </label>
      </div>
      <div className="flex flex-col gap-2">
        <div>
          <span className="font-medium">다음 결계:</span>{' '}
          <span className="text-blue-600 font-mono">
            {nextBarrier ? nextBarrier.toLocaleTimeString() : '-'}
          </span>
          <span className="ml-2 text-gray-500">(남은 시간: {remain})</span>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="font-medium">알림 시간:</span>
          {alertMinutes.map((min, i) => (
            <span
              key={i}
              className="px-2 py-1 bg-blue-50 rounded border text-xs text-blue-700"
            >
              {min}분 전
              <button
                className="ml-1 text-red-400"
                onClick={() =>
                  setAlertMinutes(alertMinutes.filter((m, idx) => idx !== i))
                }
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="number"
            min={1}
            max={180}
            placeholder="분"
            className="w-16 border rounded px-2 py-1 text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const v = parseInt((e.target as HTMLInputElement).value);
                if (!isNaN(v) && v > 0 && !alertMinutes.includes(v)) {
                  setAlertMinutes([...alertMinutes, v]);
                  (e.target as HTMLInputElement).value = '';
                }
              }
            }}
          />
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="font-medium">알림음:</span>
          {DEFAULT_SOUNDS.map((s) => (
            <button
              key={s.url}
              className={`px-3 py-1 rounded border ${selectedSound === s.url ? 'bg-blue-100 border-blue-400' : 'bg-white border-gray-300'}`}
              onClick={() => setSelectedSound(s.url)}
            >
              {s.name}
            </button>
          ))}
          <label className="px-3 py-1 rounded border bg-white border-gray-300 cursor-pointer">
            사용자 음원
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleFile}
            />
          </label>
        </div>
        <audio ref={audioRef} src={selectedSound} preload="auto" />
      </div>
    </div>
  );
}

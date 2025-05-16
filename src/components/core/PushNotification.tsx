'use client';

import React, { useState, useEffect } from 'react';

interface CustomAlarm {
  id: number;
  title: string;
  body: string;
  time: string; // HH:MM 형식
}

// 보스 출현 시간 설정
const BOSS_TIMES = ['12:00', '18:00', '20:00', '22:00'];

export default function PushNotification() {
  const [title, setTitle] = useState('테스트 알림');
  const [body, setBody] = useState('이것은 테스트 알림입니다.');
  const [alarmType, setAlarmType] = useState('barrier'); // 알림 유형: barrier, boss, custom

  // 보스/결계 알림 설정
  const [firstAlertMinutes, setFirstAlertMinutes] = useState(10); // 1차 알림 (분 전)
  const [secondAlertMinutes, setSecondAlertMinutes] = useState(5); // 2차 알림 (분 전)
  const [useSecondAlert, setUseSecondAlert] = useState(true); // 2차 알림 사용 여부
  const [selectedBossTimes, setSelectedBossTimes] =
    useState<string[]>(BOSS_TIMES); // 선택된 보스 출현 시간

  // 결계/보스 알림: 정시 알림(시작 시점) 사용 여부
  const [useOnTimeAlert, setUseOnTimeAlert] = useState(true);

  // 사용자 알림 설정
  const [showCustomAlarmSection, setShowCustomAlarmSection] = useState(false);
  const [alarmTime, setAlarmTime] = useState('12:00');
  const [customAlarms, setCustomAlarms] = useState<CustomAlarm[]>([]);
  const [nextId, setNextId] = useState(1);

  // 사운드 설정 (기본음 포함)
  const audioRef = React.useRef<HTMLAudioElement>(null);

  // 경고 메시지 상태
  const [showWarning, setShowWarning] = useState(false);

  // 경고 메시지가 표시될 때 3초 후 자동으로 숨김
  useEffect(() => {
    if (showWarning) {
      const timer = setTimeout(() => {
        setShowWarning(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showWarning]);

  // 알림 타입 변경 시 제목과 내용 자동 설정
  const handleAlarmTypeChange = (type: string) => {
    setAlarmType(type);
    if (type === 'boss') {
      setTitle('보스 알림');
      setBody('보스가 곧 출현합니다! 준비하세요.');
    } else if (type === 'barrier') {
      setTitle('결계 시작 알림');
      setBody('결계가 곧 시작됩니다!');
    } else if (type === 'custom') {
      setTitle('사용자 알림');
      setBody('사용자 알림입니다.');
    }
  };

  // 보스 시간 선택 토글
  const toggleBossTime = (time: string) => {
    if (selectedBossTimes.includes(time)) {
      setSelectedBossTimes(selectedBossTimes.filter((t) => t !== time));
    } else {
      setSelectedBossTimes([...selectedBossTimes, time]);
    }
  };

  // 브라우저 권한 요청 및 알림 발송
  const sendNotification = async () => {
    if (!('serviceWorker' in navigator)) {
      alert('서비스워커를 지원하지 않는 브라우저입니다.');
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      alert('알림 권한이 필요합니다.');
      return;
    }

    try {
      if (alarmType === 'boss') {
        if (selectedBossTimes.length === 0) {
          alert('적어도 하나 이상의 보스 출현 시간을 선택해주세요.');
          return;
        }

        const timeMessages = selectedBossTimes
          .sort()
          .map(
            (time) =>
              `${time} (${firstAlertMinutes}분 전${useSecondAlert ? `, ${secondAlertMinutes}분 전` : ''})`
          );

        alert(
          `다음 보스 출현 시간에 알림이 설정되었습니다:\n${timeMessages.join('\n')}`
        );
      } else if (alarmType === 'barrier') {
        // 1차 알림
        alert(`${firstAlertMinutes}분 전 1차 알림이 설정되었습니다.`);

        // 2차 알림이 활성화된 경우
        if (useSecondAlert) {
          alert(`${secondAlertMinutes}분 전 2차 알림도 설정되었습니다.`);
        }
      } else {
        // 즉시 알림 전송
        sendNotificationNow();
      }
    } catch (e) {
      alert(
        '알림 발송 중 오류가 발생했습니다: ' +
          (e instanceof Error ? e.message : e)
      );
    }
  };

  // 실제 알림 전송 함수
  const sendNotificationNow = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;

      // 사운드 재생 시도 (실패해도 알림은 계속 진행)
      playSound();

      // 알림 전송
      if (registration.active) {
        registration.active.postMessage({
          type: 'SHOW_NOTIFICATION',
          payload: { title, body },
        });
      } else if ('showNotification' in registration) {
        registration.showNotification(title, {
          body,
          icon: '/images/icons/icon-192.png',
          badge: '/images/icons/icon-192.png',
        });
      } else {
        alert('알림을 표시할 수 없습니다. 브라우저를 다시 시작해 주세요.');
      }
    } catch (e) {
      alert(
        '알림 발송 중 오류가 발생했습니다: ' +
          (e instanceof Error ? e.message : e)
      );
    }
  };

  // 사운드 재생 함수
  const playSound = () => {
    try {
      if (audioRef.current) {
        // 기본 알림음 재생 (이전 설정된 음원이 없을 경우)
        const defaultSound =
          'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLHOw0uCpUw8HFVyNswD/92UNChhTeKEOFgVMEwIMJ1RvcTkUABAJBjM/JSFLhcTcq2QZCFmLvPvvh0ICKHey3fasbxQGMGuZxO3SfiwEDThqiLitYw8bChhJcZOWfEgaJUdwg4RtVDRHbqCkfU4LBwonWICThWI8Hxc3bLjewIExCRIHTnmdr5JlQxoMDiRpvfLNdxkJFDBjnruDVS5BZo+VdVAvFgcOH0lzmKyOaEMTBApRptXirWcHChIcTI+9sXpEHQQVK1uJt7mUakUVCQ8zV5vS6bpjCwYQK2l9kJeWdGhCHQgECzRnmczxvGYOAwcmW5Sxuoh3XDwsCgQHK16i4vzCZwoACClkkMLmrGQQBAIaQ4HB8s13EAEFKmuYvaM+EQVPjKqRTxQECChRj9LqsGIMaqqXWBEDCjJikNDosWYaFjs6HTYmXJ3L4q5eDwEEI2mpyrGINxQMVYSYgUQTAx5SksrpqVwSERIhZKTEqWEkRHGJgjkYBh1ZnN/1rFQAzLd9NQwXK16KrsaBNw87cacxCQYkW5Czlk8QEy9heIFqYTtJdaGibjsRChVFgMLhu10ACjRrqMWgSwcSRWsZ0tSicx9Qha8zBgBZqN1nBgxLjsNcAwAgUICiUDIRB7eYMw1Lj8gAACBKfblUFwYHDFCO1LAAABtJer1fHgMA1tIAAHSiRBQKAuH/wFgUDqcAADCCTrBbGyMv/a43JwLQ7rC5Tg8ACUA/hFMwGARCqqsGAItdMRkO+qMFAA==';
        audioRef.current.src = defaultSound;

        audioRef.current.oncanplaythrough = () => {
          audioRef.current?.play().catch((e) => {
            console.error('알림음 재생 실패:', e);
            setShowWarning(true);
          });
        };

        audioRef.current.onerror = () => {
          console.error('알림음 로드 실패');
          setShowWarning(true);
        };
      }
    } catch (e) {
      console.error('알림음 재생 중 오류:', e);
      setShowWarning(true);
    }
  };

  // 사용자 알림 추가
  const addCustomAlarm = () => {
    if (!title.trim()) {
      alert('알림 제목을 입력해주세요.');
      return;
    }

    const newAlarm: CustomAlarm = {
      id: nextId,
      title,
      body,
      time: alarmTime,
    };

    setCustomAlarms([...customAlarms, newAlarm]);
    setNextId(nextId + 1);
  };

  // 사용자 알림 삭제
  const removeCustomAlarm = (id: number) => {
    setCustomAlarms(customAlarms.filter((alarm) => alarm.id !== id));
  };

  return (
    <div className="p-3 sm:p-4 border rounded bg-white dark:bg-gray-800 w-full max-w-md mx-auto my-4 sm:my-8 shadow-md sm:shadow-lg">
      <h2 className="text-base sm:text-lg font-bold mb-3">푸시 알림 설정</h2>

      {/* 경고 메시지 */}
      {showWarning && (
        <div className="mb-3 p-2 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded text-xs">
          알림음 재생에 문제가 발생했습니다. 사용 중인 브라우저에서 자동 재생이
          차단되었거나 지원되지 않을 수 있습니다.
        </div>
      )}

      {/* 알림 타입 선택 */}
      <div className="mb-4">
        <label className="block text-xs sm:text-sm mb-2">알림 유형</label>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1.5 text-sm rounded-full border ${alarmType === 'barrier' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            onClick={() => handleAlarmTypeChange('barrier')}
          >
            결계 알림
          </button>
          <button
            className={`px-3 py-1.5 text-sm rounded-full border ${alarmType === 'boss' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            onClick={() => handleAlarmTypeChange('boss')}
          >
            보스 알림
          </button>
          <button
            className={`px-3 py-1.5 text-sm rounded-full border ${alarmType === 'custom' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            onClick={() => {
              handleAlarmTypeChange('custom');
              setShowCustomAlarmSection(false);
            }}
          >
            즉시 알림
          </button>
        </div>

        <button
          className="mt-2 text-xs text-blue-500 hover:text-blue-700 flex items-center"
          onClick={() => setShowCustomAlarmSection(!showCustomAlarmSection)}
        >
          <span className="mr-1">{showCustomAlarmSection ? '▼' : '▶'}</span>
          사용자 정의 알림 설정
        </button>
      </div>

      {/* 결계 알림 설정 */}
      {alarmType === 'barrier' && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded border">
          <h3 className="text-sm font-semibold mb-2">알림 시간 설정</h3>

          <div className="mb-2">
            <label className="flex items-center text-xs mb-1">
              <span className="mr-2">1차 알림:</span>
              <input
                type="number"
                min="1"
                max="60"
                className="w-16 border px-2 py-1 rounded text-sm bg-white dark:bg-gray-600"
                value={firstAlertMinutes}
                onChange={(e) =>
                  setFirstAlertMinutes(parseInt(e.target.value) || 10)
                }
              />
              <span className="ml-1">분 전</span>
            </label>
          </div>

          <div className="mb-2">
            <label className="flex items-center text-xs">
              <input
                type="checkbox"
                checked={useSecondAlert}
                onChange={(e) => setUseSecondAlert(e.target.checked)}
                className="mr-2"
              />
              <span>2차 알림 사용</span>
            </label>
          </div>

          {useSecondAlert && (
            <div className="mb-2 ml-5">
              <label className="flex items-center text-xs mb-1">
                <span className="mr-2">2차 알림:</span>
                <input
                  type="number"
                  min="1"
                  max="60"
                  className="w-16 border px-2 py-1 rounded text-sm bg-white dark:bg-gray-600"
                  value={secondAlertMinutes}
                  onChange={(e) =>
                    setSecondAlertMinutes(parseInt(e.target.value) || 5)
                  }
                />
                <span className="ml-1">분 전</span>
              </label>
            </div>
          )}

          {/* 정시 알림(시작 시점) 체크박스 */}
          <div className="mb-2">
            <label className="flex items-center text-xs">
              <input
                type="checkbox"
                checked={useOnTimeAlert}
                onChange={(e) => setUseOnTimeAlert(e.target.checked)}
                className="mr-2"
              />
              <span>결계 시작 시점에도 알림</span>
            </label>
          </div>
        </div>
      )}

      {/* 보스 알림 설정 */}
      {alarmType === 'boss' && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded border">
          <h3 className="text-sm font-semibold mb-2">보스 출현 알림 설정</h3>

          <div className="mb-3">
            <p className="text-xs mb-2">출현 시간 선택:</p>
            <div className="flex flex-wrap gap-2">
              {BOSS_TIMES.map((time) => (
                <button
                  key={time}
                  className={`px-3 py-1 text-xs rounded-full border ${
                    selectedBossTimes.includes(time)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-600'
                  }`}
                  onClick={() => toggleBossTime(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-2">
            <label className="flex items-center text-xs mb-1">
              <span className="mr-2">1차 알림:</span>
              <input
                type="number"
                min="1"
                max="60"
                className="w-16 border px-2 py-1 rounded text-sm bg-white dark:bg-gray-600"
                value={firstAlertMinutes}
                onChange={(e) =>
                  setFirstAlertMinutes(parseInt(e.target.value) || 10)
                }
              />
              <span className="ml-1">분 전</span>
            </label>
          </div>

          <div className="mb-2">
            <label className="flex items-center text-xs">
              <input
                type="checkbox"
                checked={useSecondAlert}
                onChange={(e) => setUseSecondAlert(e.target.checked)}
                className="mr-2"
              />
              <span>2차 알림 사용</span>
            </label>
          </div>

          {useSecondAlert && (
            <div className="mb-2 ml-5">
              <label className="flex items-center text-xs mb-1">
                <span className="mr-2">2차 알림:</span>
                <input
                  type="number"
                  min="1"
                  max="60"
                  className="w-16 border px-2 py-1 rounded text-sm bg-white dark:bg-gray-600"
                  value={secondAlertMinutes}
                  onChange={(e) =>
                    setSecondAlertMinutes(parseInt(e.target.value) || 5)
                  }
                />
                <span className="ml-1">분 전</span>
              </label>
            </div>
          )}

          {/* 정시 알림(보스 등장 시점) 체크박스 */}
          <div className="mb-2">
            <label className="flex items-center text-xs">
              <input
                type="checkbox"
                checked={useOnTimeAlert}
                onChange={(e) => setUseOnTimeAlert(e.target.checked)}
                className="mr-2"
              />
              <span>보스 등장 시점에도 알림</span>
            </label>
          </div>
        </div>
      )}

      {/* 알림 내용 설정 */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-2">알림 내용</h3>
        <div className="mb-2">
          <label className="block text-xs mb-1" htmlFor="push-title">
            제목
          </label>
          <input
            id="push-title"
            className="w-full border px-2 py-1 rounded text-sm bg-gray-50 dark:bg-gray-700"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-2">
          <label className="block text-xs mb-1" htmlFor="push-body">
            내용
          </label>
          <input
            id="push-body"
            className="w-full border px-2 py-1 rounded text-sm bg-gray-50 dark:bg-gray-700"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
      </div>

      {/* 알림 전송 버튼 */}
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm w-full transition"
        onClick={sendNotification}
        type="button"
      >
        {alarmType === 'custom' ? '즉시 알림 보내기' : '알림 설정하기'}
      </button>

      {/* 사용자 정의 알림 섹션 */}
      {showCustomAlarmSection && (
        <div className="mt-4 border-t pt-3">
          <h3 className="text-sm font-semibold mb-2">사용자 정의 알림 설정</h3>

          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded border">
            <div className="mb-2">
              <label className="block text-xs mb-1" htmlFor="alarm-time">
                알림 시간
              </label>
              <input
                id="alarm-time"
                type="time"
                className="w-full border px-2 py-1 rounded text-sm bg-white dark:bg-gray-600"
                value={alarmTime}
                onChange={(e) => setAlarmTime(e.target.value)}
              />
            </div>

            <button
              className="w-full bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs mt-1"
              onClick={addCustomAlarm}
              type="button"
            >
              알림 추가
            </button>
          </div>

          {/* 사용자 알림 목록 */}
          {customAlarms.length > 0 && (
            <div className="mt-2">
              <h4 className="text-xs font-semibold mb-1">설정된 알림 목록</h4>
              <div className="max-h-48 overflow-y-auto">
                {customAlarms.map((alarm) => (
                  <div
                    key={alarm.id}
                    className="flex items-center justify-between py-1 px-2 border-b text-xs"
                  >
                    <div>
                      <div className="font-semibold">{alarm.title}</div>
                      <div className="text-gray-500">
                        {alarm.time} • {alarm.body}
                      </div>
                    </div>
                    <button
                      className="text-red-500 hover:text-red-700 ml-2"
                      onClick={() => removeCustomAlarm(alarm.id)}
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 오디오 요소 */}
      <audio ref={audioRef} preload="auto" />
    </div>
  );
}

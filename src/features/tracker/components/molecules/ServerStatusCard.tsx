/**
 * 서버 상태 카드 컴포넌트
 * 게임 서버의 현재 상태를 시각적으로 표시하는 컴포넌트입니다.
 */
import { GameServer } from '@/types/games/mabinogi_mobile/index';

interface ServerStatusCardProps {
  server: GameServer;
}

export function ServerStatusCard({ server }: ServerStatusCardProps) {
  // 서버 상태에 따른 배경색 결정
  const statusColors = {
    online: {
      bg: 'bg-green-50',
      text: 'text-green-800',
      border: 'border-green-200',
      statusBg: 'bg-green-500',
    },
    maintenance: {
      bg: 'bg-red-50',
      text: 'text-red-800',
      border: 'border-red-200',
      statusBg: 'bg-red-500',
    },
    busy: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
      statusBg: 'bg-yellow-500',
    },
    crowded: {
      bg: 'bg-orange-50',
      text: 'text-orange-800',
      border: 'border-orange-200',
      statusBg: 'bg-orange-500',
    },
  };

  const colors = statusColors[server.status];

  // 서버 상태 한글화
  const statusText = {
    online: '온라인',
    maintenance: '점검 중',
    busy: '혼잡',
    crowded: '포화',
  };

  // 인구 수치를 기반으로 진행 바 계산
  const populationPercentage = server.population;

  // 인구 상태에 따른 색상 결정
  let populationColor = 'bg-green-500';
  if (populationPercentage >= 80) {
    populationColor = 'bg-red-500';
  } else if (populationPercentage >= 60) {
    populationColor = 'bg-orange-500';
  } else if (populationPercentage >= 40) {
    populationColor = 'bg-yellow-500';
  }

  return (
    <div
      className={`border ${colors.border} rounded-lg overflow-hidden ${colors.bg}`}
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{server.name}</h3>
            <p className="text-sm text-gray-600">{server.region}</p>
          </div>
          <div
            className={`px-2 py-1 rounded-full text-xs text-white ${colors.statusBg}`}
          >
            {statusText[server.status]}
          </div>
        </div>

        {server.status === 'maintenance' ? (
          <div className="mt-3">
            <p className="text-sm text-red-700">{server.maintenanceMessage}</p>
            {server.maintenanceEndTime && (
              <p className="text-sm font-medium mt-1">
                예상 완료 시간:{' '}
                {new Date(server.maintenanceEndTime).toLocaleString()}
              </p>
            )}
          </div>
        ) : (
          <div className="mt-3">
            <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
              <span>인구 수</span>
              <span>{populationPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`${populationColor} h-2 rounded-full`}
                style={{ width: `${populationPercentage}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="mt-3 text-right text-xs text-gray-500">
          마지막 확인: {new Date(server.lastChecked).toLocaleString()}
        </div>
      </div>
    </div>
  );
}

/**
 * 이벤트 카드 컴포넌트
 * 게임 이벤트 정보를 표시하는 카드형 UI 컴포넌트입니다.
 */
import Image from 'next/image';
import { GameEvent } from '@/types/games/mabinogi_mobile/index';

interface EventCardProps {
  event: GameEvent;
}

export function EventCard({ event }: EventCardProps) {
  // 이벤트 카테고리에 따른 스타일 결정
  const categoryStyles = {
    general: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      badge: 'bg-blue-100 text-blue-800',
      badgeText: '일반',
    },
    update: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      badge: 'bg-purple-100 text-purple-800',
      badgeText: '업데이트',
    },
    bonus: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      badge: 'bg-green-100 text-green-800',
      badgeText: '보너스',
    },
    community: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      badge: 'bg-yellow-100 text-yellow-800',
      badgeText: '커뮤니티',
    },
  };

  const style = categoryStyles[event.category];

  // 특별 이벤트인 경우 추가 스타일
  const specialClass = event.isSpecial ? 'border-2' : 'border';

  // 이벤트 상태 확인
  const now = new Date();
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  const isActive = now >= startDate && now <= endDate;
  const isUpcoming = now < startDate;

  // 날짜 포맷 함수
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 남은 시간 계산
  const getRemainingTime = () => {
    if (isActive) {
      // 종료까지 남은 시간
      const diffMs = endDate.getTime() - now.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(
        (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );

      if (diffDays > 0) {
        return `${diffDays}일 ${diffHours}시간 남음`;
      } else {
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        return `${diffHours}시간 ${diffMins}분 남음`;
      }
    } else if (isUpcoming) {
      // 시작까지 남은 시간
      const diffMs = startDate.getTime() - now.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(
        (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );

      if (diffDays > 0) {
        return `${diffDays}일 ${diffHours}시간 후 시작`;
      } else {
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        return `${diffHours}시간 ${diffMins}분 후 시작`;
      }
    }
    return '';
  };

  return (
    <div
      className={`${specialClass} ${style.border} ${style.bg} rounded-lg overflow-hidden`}
    >
      <div className="flex flex-col md:flex-row">
        {/* 이벤트 이미지 */}
        {event.imageUrl && (
          <div className="md:w-1/4 h-48 md:h-auto relative">
            <Image
              src={event.imageUrl}
              alt={event.title}
              layout="fill"
              objectFit="cover"
            />
          </div>
        )}

        {/* 이벤트 정보 */}
        <div className={`p-4 flex-1 ${event.imageUrl ? '' : 'w-full'}`}>
          <div className="flex justify-between items-start mb-2">
            <div>
              <span
                className={`inline-block px-2 py-1 rounded-md text-xs ${style.badge} mb-2`}
              >
                {style.badgeText}
              </span>
              {event.isSpecial && (
                <span className="inline-block ml-2 px-2 py-1 rounded-md text-xs bg-red-100 text-red-800">
                  스페셜
                </span>
              )}
            </div>

            <div className="text-sm font-medium">
              {isActive ? (
                <span className="text-green-600">{getRemainingTime()}</span>
              ) : (
                <span className="text-blue-600">{getRemainingTime()}</span>
              )}
            </div>
          </div>

          <h3 className="text-xl font-bold mb-2">{event.title}</h3>
          <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

          {/* 이벤트 기간 */}
          <div className="text-sm text-gray-700 mb-3">
            <p>시작: {formatDate(startDate)}</p>
            <p>종료: {formatDate(endDate)}</p>
          </div>

          {/* 보상 정보 */}
          {event.rewards && event.rewards.length > 0 && (
            <div className="mb-3">
              <h4 className="text-sm font-semibold mb-1">보상</h4>
              <div className="flex flex-wrap gap-1">
                {event.rewards.map((reward, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                  >
                    {reward}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 자세히 보기 링크 */}
          {event.url && (
            <div className="mt-2">
              <a
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
              >
                자세히 보기
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

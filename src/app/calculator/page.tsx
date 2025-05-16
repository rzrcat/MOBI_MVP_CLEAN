'use client';

export default function CalculatorPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">생활 계산기</h1>
        <p className="text-gray-600">
          마비노기 모바일의 다양한 생활 콘텐츠를 위한 계산기 모음입니다. (개발
          진행 중)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">경험치 계산기</h2>
          <p className="text-gray-600 mb-4">
            레벨별 필요 경험치와 획득 경험치를 계산합니다.
          </p>
          <div className="text-center p-8 text-gray-400">개발 중입니다...</div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">제작 재료 계산기</h2>
          <p className="text-gray-600 mb-4">
            아이템 제작에 필요한 재료와 비용을 계산합니다.
          </p>
          <div className="text-center p-8 text-gray-400">개발 중입니다...</div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">수익 계산기</h2>
          <p className="text-gray-600 mb-4">
            활동별 시간당 수익을 계산하고 비교합니다.
          </p>
          <div className="text-center p-8 text-gray-400">개발 중입니다...</div>
        </div>
      </div>
    </div>
  );
}

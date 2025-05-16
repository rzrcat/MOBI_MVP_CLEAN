import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
        404 - 페이지를 찾을 수 없습니다
      </h1>
      <p className="text-lg text-gray-600 mb-8 max-w-md">
        요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          홈으로 돌아가기
        </Link>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          이전 페이지로 돌아가기
        </button>
      </div>
    </div>
  );
}

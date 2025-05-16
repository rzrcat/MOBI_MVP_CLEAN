/**
 * ClassValue에 대한 타입 정의
 */
type ClassValue = string | Record<string, boolean> | null | undefined;

/**
 * 클래스 이름을 조건부로 결합하기 위한 유틸리티 함수
 * @param classes 적용할 클래스 값 목록
 * @returns 결합된 클래스 이름 문자열
 */
export function classNames(...classes: ClassValue[]): string {
  const result: string[] = [];

  for (const item of classes) {
    if (!item) continue;

    if (typeof item === 'string') {
      result.push(item);
    } else if (typeof item === 'object') {
      Object.entries(item).forEach(([key, value]) => {
        if (value) {
          result.push(key);
        }
      });
    }
  }

  return result.join(' ');
}

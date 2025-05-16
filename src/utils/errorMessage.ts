export function getErrorMessage(error: any): string {
  if (!error) return '알 수 없는 오류가 발생했습니다.';
  if (error.status === 500)
    return `서버 연결에 문제가 있습니다. (에러코드: 500)`;
  if (error.status === 403) return `권한이 없습니다. (에러코드: 403)`;
  if (error.message === 'Network Error')
    return `인터넷 연결을 확인해주세요. (에러코드: NETWORK_ERROR)`;
  if (error.status) return `오류가 발생했습니다. (에러코드: ${error.status})`;
  return `오류가 발생했습니다. (${error.message || error.code || 'UNKNOWN'})`;
}

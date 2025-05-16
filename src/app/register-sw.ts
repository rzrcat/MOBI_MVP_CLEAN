if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  // 페이지 로딩 완료 후 서비스 워커 등록
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('서비스 워커 등록 성공:', registration.scope);

      // 푸시 메시지 수신을 위한 구독 설정
      if ('PushManager' in window) {
        try {
          const subscription = await registration.pushManager.getSubscription();
          if (!subscription) {
            // 아직 구독하지 않은 경우, 필요한 시점에 구독 요청
            console.log('푸시 알림 구독이 필요합니다.');
          } else {
            // 이미 구독 중인 경우
            console.log('푸시 알림 구독 상태: 활성화');
          }
        } catch (pushError) {
          console.error('푸시 알림 구독 확인 중 오류:', pushError);
        }
      }
    } catch (error) {
      console.error('서비스 워커 등록 실패:', error);
    }
  });

  // 서비스 워커 컨트롤러 확인
  if (navigator.serviceWorker.controller) {
    console.log('이 페이지는 서비스 워커에 의해 제어되고 있습니다.');
  }

  // 서비스 워커 상태 변경 감지
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log(
      '서비스 워커가 업데이트되었습니다. 페이지를 새로고침해 주세요.'
    );
  });
}

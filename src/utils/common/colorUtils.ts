/**
 * 색상 변환 관련 유틸리티 함수 모음
 */

/**
 * HEX 색상 코드를 RGB 배열로 변환합니다.
 * @param hex HEX 색상 코드 (예: '#RRGGBB' 또는 '#RGB')
 * @returns RGB 색상 배열 [r, g, b]
 */
export function hexToRgb(hex: string): [number, number, number] {
  try {
    // 유효하지 않은 값 체크
    if (!hex || typeof hex !== 'string') {
      return [0, 0, 0];
    }

    // # 기호 제거
    let cleanHex = hex.replace(/^#/, '');

    // RGB 단축형(#RGB) 처리
    if (cleanHex.length === 3) {
      cleanHex =
        cleanHex[0] +
        cleanHex[0] +
        cleanHex[1] +
        cleanHex[1] +
        cleanHex[2] +
        cleanHex[2];
    }

    // 유효한 6자리 hex 형식이 아니면 기본값 반환
    if (cleanHex.length !== 6 || !/^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
      return [0, 0, 0];
    }

    // RGB 값 계산
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);

    return [isNaN(r) ? 0 : r, isNaN(g) ? 0 : g, isNaN(b) ? 0 : b];
  } catch (error) {
    console.error('HEX to RGB conversion error:', error);
    return [0, 0, 0];
  }
}

/**
 * RGB 값을 HEX 색상 코드로 변환합니다.
 * @param r 빨간색 (0-255)
 * @param g 초록색 (0-255)
 * @param b 파란색 (0-255)
 * @returns HEX 색상 코드 (예: '#RRGGBB')
 */
export function rgbToHex(r: number, g: number, b: number): string {
  try {
    // 유효한 범위로 제한
    const validR = Math.max(0, Math.min(255, Math.round(r)));
    const validG = Math.max(0, Math.min(255, Math.round(g)));
    const validB = Math.max(0, Math.min(255, Math.round(b)));

    // HEX 값으로 변환
    const hexR = validR.toString(16).padStart(2, '0');
    const hexG = validG.toString(16).padStart(2, '0');
    const hexB = validB.toString(16).padStart(2, '0');

    return `#${hexR}${hexG}${hexB}`;
  } catch (error) {
    console.error('RGB to HEX conversion error:', error);
    return '#000000';
  }
}

/**
 * 배경색에 따라 가독성 높은 텍스트 색상을 반환합니다.
 * @param bgColor 배경 색상 (HEX 코드)
 * @returns 텍스트 색상 (검은색 또는 흰색)
 */
export function getContrastText(bgColor: string): string {
  try {
    // 유효하지 않은 색상이면 기본값 반환
    if (!bgColor || typeof bgColor !== 'string') {
      return '#000000';
    }

    const [r, g, b] = hexToRgb(bgColor);

    // 명도 계산 (YIQ 공식 사용)
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;

    // 명도가 높으면 어두운 텍스트, 낮으면 밝은 텍스트 반환
    return yiq >= 128 ? '#000000' : '#ffffff';
  } catch (error) {
    console.error('Contrast text calculation error:', error);
    return '#000000';
  }
}

/**
 * HEX 색상에 투명도(알파값)를 적용한 rgba 색상 문자열을 반환합니다.
 * @param hex HEX 색상 코드
 * @param alpha 투명도 (0-1)
 * @returns rgba 색상 문자열
 */
export function hexToRgba(hex: string, alpha: number = 1): string {
  try {
    // 유효한 범위로 알파값 제한
    const validAlpha = Math.max(0, Math.min(1, alpha));

    // RGB 값 계산
    const [r, g, b] = hexToRgb(hex);

    return `rgba(${r}, ${g}, ${b}, ${validAlpha})`;
  } catch (error) {
    console.error('HEX to RGBA conversion error:', error);
    return 'rgba(0, 0, 0, 1)';
  }
}

/**
 * HEX 색상을 밝게 또는 어둡게 조절합니다.
 * @param hex HEX 색상 코드
 * @param amount 조절 양 (+: 밝게, -: 어둡게)
 * @returns 조절된 HEX 색상 코드
 */
export function adjustBrightness(hex: string, amount: number): string {
  try {
    const [r, g, b] = hexToRgb(hex);
    const factor = amount > 0 ? 1 : 0;

    // 각 채널 조절
    const adjustR = Math.round(
      Math.min(255, Math.max(0, r + amount * (factor - r / 255)))
    );
    const adjustG = Math.round(
      Math.min(255, Math.max(0, g + amount * (factor - g / 255)))
    );
    const adjustB = Math.round(
      Math.min(255, Math.max(0, b + amount * (factor - b / 255)))
    );

    return rgbToHex(adjustR, adjustG, adjustB);
  } catch (error) {
    console.error('Brightness adjustment error:', error);
    return hex || '#000000';
  }
}

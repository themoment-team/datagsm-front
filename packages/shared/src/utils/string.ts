/**
 * 문자열에서 첫 번째 콜론(':') 뒤의 내용을 반환합니다.
 * 콜론이 없으면 원본 문자열을 반환합니다.
 * @param str 원본 문자열 (예: "App:Description")
 * @returns 콜론 뒤의 문자열 (예: "Description")
 */
export const getAfterColon = (str: string): string => {
  const parts = str.split(':');
  if (parts.length <= 1) return str;
  return parts.slice(1).join(':').trim();
};

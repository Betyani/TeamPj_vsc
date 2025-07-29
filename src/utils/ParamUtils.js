/**
 * 객체에서 null, undefined, 빈 문자열을 제거한 새 객체를 반환
 * @param {Object} params
 * @returns {Object} 필터링된 파라미터 객체
 */

export function filterParams(params) {
  return Object.fromEntries(
    Object.entries(params).filter(([_, value]) =>
      value !== null && value !== undefined && value !== "")
  );
}
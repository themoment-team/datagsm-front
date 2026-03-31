import { EMAIL_DOMAIN } from '../constants';

/**
 * 이메일에 도메인이 붙어있지 않으면 추가합니다.
 * @returns 도메인이 포함된 이메일 주소
 */
export const formatEmailWithDomain = (email: string): string => {
  if (email.endsWith(EMAIL_DOMAIN)) {
    return email;
  }
  return `${email}${EMAIL_DOMAIN}`;
};

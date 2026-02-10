import { NextRequest, NextResponse } from 'next/server';

import { COOKIE_KEYS } from '@repo/shared/constants';
import { generateCodeChallenge, generateCodeVerifier } from '@repo/shared/utils';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;

  // OAuth callback 감지 (code 파라미터가 있으면 외부 OAuth callback)
  if (request.nextUrl.searchParams.has('code')) {
    return NextResponse.next();
  }

  // OAuth 플로우는 미들웨어 적용 안 함
  if (pathname.startsWith('/oauth') || pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  if (pathname === '/signup') {
    return NextResponse.next();
  }

  if (!accessToken) {
    const oauthBaseUrl = process.env.NEXT_PUBLIC_OAUTH_BASE_URL || 'http://localhost:8081';
    const clientId = process.env.NEXT_PUBLIC_DATAGSM_CLIENT_ID;
    const redirectUri = `${request.nextUrl.origin}/api/callback`;

    if (!clientId) {
      throw new Error('NEXT_PUBLIC_DATAGSM_CLIENT_ID 환경 변수가 설정되지 않았습니다.');
    }

    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    const oauthUrl = new URL(`${oauthBaseUrl}/v1/oauth/authorize`);
    oauthUrl.searchParams.set('client_id', clientId);
    oauthUrl.searchParams.set('redirect_uri', redirectUri);
    oauthUrl.searchParams.set('response_type', 'code');
    oauthUrl.searchParams.set('state', request.nextUrl.pathname);
    oauthUrl.searchParams.set('code_challenge', codeChallenge);
    oauthUrl.searchParams.set('code_challenge_method', 'S256');

    const response = NextResponse.redirect(oauthUrl);
    response.cookies.set('code_verifier', codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 600,
    });

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};

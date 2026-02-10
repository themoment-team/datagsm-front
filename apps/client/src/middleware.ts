import { NextRequest, NextResponse } from 'next/server';

import { COOKIE_KEYS } from '@repo/shared/constants';

function base64UrlEncode(array: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...array));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64UrlEncode(array);
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return base64UrlEncode(new Uint8Array(hash));
}

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
    const clientId = process.env.NEXT_PUBLIC_DATAGSM_CLIENT_ID!;
    const redirectUri = `${request.nextUrl.origin}/api/callback`;

    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    const statePath = request.nextUrl.pathname === '/signin' ? '/' : request.nextUrl.pathname;

    const oauthUrl = new URL(`${oauthBaseUrl}/v1/oauth/authorize`);
    oauthUrl.searchParams.set('clientId', clientId);
    oauthUrl.searchParams.set('redirectUri', redirectUri);
    oauthUrl.searchParams.set('responseType', 'code');
    oauthUrl.searchParams.set('state', statePath);
    oauthUrl.searchParams.set('codeChallenge', codeChallenge);
    oauthUrl.searchParams.set('codeChallengeMethod', 'S256');

    const response = NextResponse.redirect(oauthUrl);
    response.cookies.set('code_verifier', codeVerifier, {
      httpOnly: true,
      secure: false,
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

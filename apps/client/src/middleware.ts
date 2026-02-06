import { NextRequest, NextResponse } from 'next/server';

import { COOKIE_KEYS } from '@repo/shared/constants';

const PUBLIC_ROUTES = ['/signin', '/signup'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;

  if (PUBLIC_ROUTES.includes(pathname)) {
    if (accessToken) {
      const referer = request.headers.get('referer');
      const url = request.nextUrl.clone();

      if (referer) {
        try {
          const refererUrl = new URL(referer);

          if (
            refererUrl.origin === url.origin &&
            !PUBLIC_ROUTES.includes(refererUrl.pathname) &&
            refererUrl.pathname.startsWith('/')
          ) {
            url.pathname = refererUrl.pathname;
            url.search = refererUrl.search;
            return NextResponse.redirect(url);
          }
        } catch (error) {
          console.error('잘못된 referer URL:', error);
        }
      }
      url.pathname = '/';
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  if (!accessToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/signin';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};

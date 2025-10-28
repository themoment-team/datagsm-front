import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;

  if (pathname === '/signin') {
    if (accessToken) {
      const referer = request.headers.get('referer');
      const url = request.nextUrl.clone();

      if (referer) {
        try {
          const refererUrl = new URL(referer);

          if (
            refererUrl.origin === url.origin &&
            refererUrl.pathname !== '/signin' &&
            refererUrl.pathname.startsWith('/')
          ) {
            url.pathname = refererUrl.pathname;
            url.search = refererUrl.search;
            return NextResponse.redirect(url);
          }
        } catch {
          // new URL()이 TypeError를 던질 수 있으므로 try-catch가 필요
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
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

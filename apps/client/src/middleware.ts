import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;

  if (pathname === '/signin') {
    if (accessToken) {
      const referer = request.headers.get('referer');
      const url = request.nextUrl.clone();

      if (referer && referer.includes(url.origin) && !referer.includes('/signin')) {
        return NextResponse.redirect(referer);
      } else {
        url.pathname = '/';
        return NextResponse.redirect(url);
      }
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

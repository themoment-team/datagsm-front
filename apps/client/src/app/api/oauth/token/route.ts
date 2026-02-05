import { NextRequest, NextResponse } from 'next/server';

/**
 * OAuth 토큰 교환 API Route Handler
 *
 * 브라우저에서 직접 OAuth 서버로 요청하지 않고,
 * Next.js 서버를 통해 프록시하여 client_secret을 숨깁니다.
 *
 * 플로우:
 * 브라우저 → /api/oauth/token (client_secret 없음)
 *          ↓
 * Next.js 서버 → OAuth 서버 (client_secret 포함)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json({ message: 'code is required' }, { status: 400 });
    }

    const clientSecret = process.env.NEXT_PUBLIC_DATAGSM_CLIENT_SECRET;

    if (!clientSecret) {
      return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
    }

    // OAuth 서버로 토큰 교환 요청
    const oauthBaseUrl = process.env.NEXT_PUBLIC_OAUTH_BASE_URL;
    const response = await fetch(`${oauthBaseUrl}/v1/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        clientSecret,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Token exchange error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

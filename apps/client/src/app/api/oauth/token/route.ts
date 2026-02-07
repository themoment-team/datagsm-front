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
    const { code, code_verifier: codeVerifier } = body;

    if (!code || !codeVerifier) {
      return NextResponse.json(
        {
          error: 'invalid_request',
          error_description: 'code and code_verifier are required',
        },
        { status: 400 },
      );
    }

    const clientId = process.env.NEXT_PUBLIC_DATAGSM_CLIENT_ID;
    const clientSecret = process.env.NEXT_PUBLIC_DATAGSM_CLIENT_SECRET;
    const redirectUri = process.env.NEXT_PUBLIC_DATAGSM_REDIRECT_URI;

    if (!clientSecret || !clientId || !redirectUri) {
      return NextResponse.json(
        {
          error: 'server_error',
          error_description: 'Server configuration error',
        },
        { status: 500 },
      );
    }

    // OAuth 서버로 토큰 교환 요청
    const oauthBaseUrl = process.env.NEXT_PUBLIC_OAUTH_BASE_URL;
    const response = await fetch(`${oauthBaseUrl}/v1/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const responseData = await response.json();
    const tokenData = responseData.data;

    return NextResponse.json({
      status: '200 OK',
      code: 200,
      message: 'OK',
      data: {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        tokenType: tokenData.token_type,
        expiresIn: tokenData.expires_in,
      },
    });
  } catch (error) {
    console.error('Token exchange error:', error);
    return NextResponse.json(
      {
        error: 'server_error',
        error_description: 'Internal server error',
      },
      { status: 500 },
    );
  }
}

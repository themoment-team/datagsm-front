import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  const oauthBaseUrl = process.env.NEXT_PUBLIC_OAUTH_BASE_URL;

  if (!oauthBaseUrl) {
    return NextResponse.json(
      { error: 'server_error', error_description: 'OAuth 서버 URL이 설정되지 않았습니다.' },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(`${oauthBaseUrl}/v1/oauth/sessions/${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
    return NextResponse.json(
      { error: 'server_error', error_description: errorMessage },
      { status: 500 },
    );
  }
}

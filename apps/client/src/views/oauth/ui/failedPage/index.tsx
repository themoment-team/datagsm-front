'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@repo/shared/ui';
import { ExternalLink, X } from 'lucide-react';

const LoginFailedPage = () => {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4 pb-4">
          <div className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">
            <X className="h-10 w-10 text-red-500" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl">세션이 만료되었습니다</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-muted/50 space-y-2 rounded-lg p-4">
            <p className="text-muted-foreground text-sm">이 창을 닫고 원래 페이지로 돌아가서</p>
            <p className="text-base font-medium">다시 로그인을 진행해주세요</p>
          </div>

          <div className="text-muted-foreground flex items-center justify-center gap-2 text-sm">
            <ExternalLink className="h-4 w-4" />
            <span>창을 닫은 후 로그인을 시도했던 서비스로 돌아가세요</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginFailedPage;

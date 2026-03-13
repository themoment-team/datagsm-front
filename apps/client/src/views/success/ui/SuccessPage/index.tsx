'use client';

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/shared/ui';
import { CheckCircle2, ExternalLink } from 'lucide-react';

const SignUpSuccessPage = () => {
  const handleClose = () => {
    // 윈도우 탭 닫아버리기
    window.close();
  };

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4 pb-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl">회원가입 완료</CardTitle>
            <CardDescription className="text-base">
              DataGSM 계정이 성공적으로 생성되었습니다
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-muted/50 space-y-2 rounded-lg p-4">
            <p className="text-muted-foreground text-sm">이 창을 닫고 원래 페이지로 돌아가서</p>
            <p className="text-base font-medium">로그인을 진행해주세요</p>
          </div>

          <div className="text-muted-foreground flex items-center justify-center gap-2 text-sm">
            <ExternalLink className="h-4 w-4" />
            <span>로그인을 시도했던 서비스로 돌아가세요</span>
          </div>

          <Button onClick={handleClose} variant="outline" className="w-full">
            이 창 닫기
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpSuccessPage;

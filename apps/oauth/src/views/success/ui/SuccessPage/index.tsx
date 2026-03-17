'use client';

import { useSearchParams } from 'next/navigation';

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/shared/ui';
import { AlertCircle, CheckCircle2, ExternalLink } from 'lucide-react';

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const page = searchParams.get('page');

  const handleAction = () => {
    window.close();
  };

  const contentMap = {
    reset: {
      title: '비밀번호 재설정 완료',
      description: '비밀번호가 성공적으로 변경되었습니다',
      mainText: '새로운 비밀번호로 로그인을 진행해주세요',
      buttonText: '이 창 닫기',
      isError: false,
    },
    signup: {
      title: '회원가입 완료',
      description: 'DataGSM 계정이 성공적으로 생성되었습니다',
      mainText: '로그인을 진행해주세요',
      buttonText: '이 창 닫기',
      isError: false,
    },
  } as const;

  const defaultContent = {
    title: '잘못된 접근',
    description: '잘못된 경로로 접근했습니다',
    mainText: '로그인 페이지로 돌아가서 다시 시도해주세요',
    buttonText: undefined,
    isError: true,
  };

  const content = (page && contentMap[page as keyof typeof contentMap]) || defaultContent;

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4 pb-4">
          <div
            className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${
              content.isError ? 'bg-destructive/10' : 'bg-green-500/10'
            }`}
          >
            {content.isError ? (
              <AlertCircle className="text-destructive h-10 w-10" />
            ) : (
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            )}
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl">{content.title}</CardTitle>
            <CardDescription className="text-base">{content.description}</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-muted/50 space-y-2 rounded-lg p-4">
            <p className="text-muted-foreground text-sm">
              {content.isError ? '원활한 서비스를 위해' : '이 창을 닫고 원래 페이지로 돌아가서'}
            </p>
            <p className="text-base font-medium">{content.mainText}</p>
          </div>

          <div className="text-muted-foreground flex items-center justify-center gap-2 text-sm">
            <ExternalLink className="h-4 w-4" />
            <span>로그인을 시도했던 서비스로 돌아가세요</span>
          </div>

          {content.buttonText && (
            <Button
              onClick={handleAction}
              variant={content.isError ? 'destructive' : 'outline'}
              className="w-full"
            >
              {content.buttonText}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SuccessPage;

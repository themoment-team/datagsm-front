'use client';

import { useSearchParams } from 'next/navigation';

import { cn } from '@repo/shared/utils';
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
    <div className={cn('bg-background flex min-h-screen items-center justify-center px-4')}>
      <div
        className={cn(
          'w-full max-w-md border-2 bg-background pixel-shadow-lg',
          content.isError ? 'border-destructive' : 'border-foreground',
        )}
      >
        {/* Title bar */}
        <div
          className={cn(
            'flex items-center gap-3 border-b-2 px-5 py-3',
            content.isError
              ? 'border-destructive bg-destructive text-white'
              : 'border-foreground bg-foreground text-background',
          )}
        >
          <div
            className={cn(
              'flex h-6 w-6 flex-shrink-0 items-center justify-center text-[8px] font-pixel',
              content.isError ? 'bg-white text-destructive' : 'bg-background text-foreground',
            )}
          >
            D
          </div>
          <span className="text-[9px] font-pixel">DataGSM</span>
        </div>

        {/* Icon + title */}
        <div className={cn('flex flex-col items-center gap-4 border-b border-foreground/15 px-6 py-6 text-center')}>
          <div
            className={cn(
              'flex items-center justify-center border-2 p-4',
              content.isError ? 'border-destructive' : 'border-foreground',
            )}
          >
            {content.isError ? (
              <AlertCircle className="text-destructive h-8 w-8" />
            ) : (
              <CheckCircle2 className="h-8 w-8 text-foreground" />
            )}
          </div>
          <div>
            <h1 className={cn('text-lg font-bold text-foreground')}>{content.title}</h1>
            <p className={cn('mt-1 text-sm text-muted-foreground')}>{content.description}</p>
          </div>
        </div>

        {/* Body */}
        <div className={cn('space-y-4 px-6 py-5')}>
          <div className={cn('border border-foreground/20 bg-muted/30 px-4 py-3')}>
            <p className={cn('text-xs text-muted-foreground font-mono')}>
              {content.isError ? '원활한 서비스를 위해' : '이 창을 닫고 원래 페이지로 돌아가서'}
            </p>
            <p className={cn('mt-1 text-sm font-medium text-foreground')}>{content.mainText}</p>
          </div>

          <div className={cn('flex items-center gap-2 text-xs text-muted-foreground font-mono')}>
            <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
            <span>로그인을 시도했던 서비스로 돌아가세요</span>
          </div>
        </div>

        {content.buttonText && (
          <div className={cn('px-6 pb-6')}>
            <button
              onClick={handleAction}
              className={cn(
                'w-full cursor-pointer border-2 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all font-mono',
                content.isError
                  ? 'border-destructive bg-destructive text-white hover:bg-background hover:text-destructive'
                  : 'border-foreground bg-foreground text-background hover:bg-background hover:text-foreground',
              )}
            >
              {content.buttonText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessPage;

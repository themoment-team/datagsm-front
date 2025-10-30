'use client';

import { GoogleIcon } from '@repo/shared/assets';
import { cn } from '@repo/shared/lib';
import { Button, Card } from '@repo/shared/ui';
import { Database } from 'lucide-react';

interface SigninFormProps {
  title: string;
  subtitle?: string;
  onGoogleLogin: () => void;
}

const SigninForm = ({ title, subtitle, onGoogleLogin }: SigninFormProps) => {
  return (
    <Card className={cn('w-full max-w-md p-8')}>
      <div className={cn('text-center')}>
        <div
          className={cn(
            'bg-primary/10 mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full',
          )}
        >
          <Database className={cn('text-primary h-8 w-8')} />
        </div>
        <h1 className={cn('text-3xl font-bold')}>{title}</h1>
      </div>

      <div className={cn('space-y-4')}>
        <Button className={cn('h-12 w-full text-base')} size="lg" onClick={onGoogleLogin}>
          <GoogleIcon />
          Google 계정으로 로그인
        </Button>

        {subtitle && <p className={cn('text-muted-foreground text-center text-sm')}>{subtitle}</p>}
      </div>
    </Card>
  );
};

export default SigninForm;

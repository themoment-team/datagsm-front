'use client';

import GoogleIcon from '@repo/shared/assets/GoogleIcon';
import { Database } from 'lucide-react';

import { Button } from '../Button';
import { Card } from '../Card';

interface SigninFormProps {
  title: string;
  subtitle?: string;
  onGoogleLogin?: () => void;
}

const SigninForm = ({ title, subtitle, onGoogleLogin }: SigninFormProps) => {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center">
          <div className="bg-primary/10 mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full">
            <Database className="text-primary h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold">{title}</h1>
        </div>

        <div className="space-y-4">
          <Button className="h-12 w-full text-base" size="lg" onClick={onGoogleLogin}>
            <GoogleIcon />
            Google 계정으로 로그인
          </Button>

          {subtitle && <p className="text-muted-foreground text-center text-sm">{subtitle}</p>}
        </div>
      </Card>
    </div>
  );
};

export default SigninForm;

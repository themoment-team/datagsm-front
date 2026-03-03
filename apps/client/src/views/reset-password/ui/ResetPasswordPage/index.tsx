import { cn } from '@repo/shared/utils';

import { ResetPasswordForm } from '@/widgets/reset-password';

const ResetPasswordPage = () => {
  return (
    <div className={cn('bg-background flex min-h-screen items-center justify-center px-4')}>
      <ResetPasswordForm />
    </div>
  );
};

export default ResetPasswordPage;

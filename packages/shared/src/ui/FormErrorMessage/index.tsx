import { cn } from '@repo/shared/utils';

interface FormErrorMessageProps {
  error?: { message?: string } | any;
  className?: string;
}

const FormErrorMessage = ({ error, className }: FormErrorMessageProps) => {
  if (!error || !error.message) return null;

  return <p className={cn('text-sm text-red-500', className)}>{error.message}</p>;
};

export default FormErrorMessage;

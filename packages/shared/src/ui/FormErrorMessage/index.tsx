import { cn } from '@repo/shared/utils';
import { FieldError } from 'react-hook-form';

interface FormErrorMessageProps {
  error?: FieldError;
  className?: string;
}

const FormErrorMessage = ({ error, className }: FormErrorMessageProps) => {
  if (!error) return null;

  return <p className={cn('text-sm text-red-500', className)}>{error.message}</p>;
};

export default FormErrorMessage;

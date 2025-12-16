import { CommonPagination } from '@/shared/ui';

interface StudentPaginationProps {
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const StudentPagination = (props: StudentPaginationProps) => {
  return <CommonPagination {...props} />;
};

export default StudentPagination;

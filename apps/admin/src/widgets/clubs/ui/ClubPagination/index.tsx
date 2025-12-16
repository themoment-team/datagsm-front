import { CommonPagination } from '@/shared/ui';

interface ClubPaginationProps {
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ClubPagination = (props: ClubPaginationProps) => {
  return <CommonPagination {...props} />;
};

export default ClubPagination;

import { useRef } from 'react';

import { clubUrl } from '@repo/shared/api';
import { Button } from '@repo/shared/ui';
import { cn } from '@repo/shared/utils';
import { useQueryClient } from '@tanstack/react-query';
import { Download, Upload } from 'lucide-react';
import { toast } from 'sonner';

import { downloadExcel } from '@/shared/utils';

import { useUploadClubExcel } from '../../model/useUploadClubExcel';

const ClubExcelActions = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  const { mutate: uploadExcel } = useUploadClubExcel({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
      toast.success('Excel 업로드에 성공했습니다.');
    },
    onError: (error) => {
      console.error('Excel 업로드 실패:', error);
      toast.error('Excel 업로드에 실패했습니다.');
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadExcel(file);
    }
    e.target.value = '';
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className={cn('gap-2 bg-transparent')}
        onClick={() =>
          downloadExcel({
            url: clubUrl.getClubExport(),
            fileName: '동아리목록',
          })
        }
      >
        <Download className={cn('h-4 w-4')} />
        Excel 다운로드
      </Button>
      <Button
        variant="outline"
        size="sm"
        className={cn('gap-2 bg-transparent')}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className={cn('h-4 w-4')} />
        Excel 업로드
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        className={cn('hidden')}
        onChange={handleFileChange}
      />
    </>
  );
};

export default ClubExcelActions;

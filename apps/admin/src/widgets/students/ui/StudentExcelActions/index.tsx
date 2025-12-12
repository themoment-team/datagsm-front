import { studentUrl } from '@repo/shared/api';
import { Button } from '@repo/shared/ui';
import { Download, Upload } from 'lucide-react';

import { downloadExcel } from '@/shared/utils';

const StudentExcelActions = () => {
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="cursor-pointer gap-2 bg-transparent"
        onClick={() =>
          downloadExcel({
            url: studentUrl.getStudentExcel(),
            fileName: '학생목록',
          })
        }
      >
        <Download className="h-4 w-4" />
        Excel 다운로드
      </Button>
      <Button variant="outline" size="sm" className="cursor-pointer gap-2 bg-transparent">
        <Upload className="h-4 w-4" />
        Excel 업로드
      </Button>
    </>
  );
};

export default StudentExcelActions;

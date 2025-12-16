import { Button } from '@repo/shared/ui';
import { Download, Upload } from 'lucide-react';

const ClubExcelActions = () => {
  return (
    <>
      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
        <Download className="h-4 w-4" />
        Excel 다운로드
      </Button>
      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
        <Upload className="h-4 w-4" />
        Excel 업로드
      </Button>
    </>
  );
};

export default ClubExcelActions;

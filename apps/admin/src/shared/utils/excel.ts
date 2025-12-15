import { get } from '@repo/shared/api';
import { toast } from 'sonner';

interface DownloadExcelOptions {
  url: string;
  fileName: string;
  successMessage?: string;
  errorMessage?: string;
}

export const downloadExcel = async ({
  url,
  fileName,
  successMessage = 'Excel 다운로드에 성공했습니다.',
  errorMessage = 'Excel 다운로드에 실패했습니다.',
}: DownloadExcelOptions) => {
  try {
    const response = await get<Blob>(url, {
      responseType: 'blob',
    });

    const today = new Date();
    const dateString = [
      today.getFullYear(),
      (today.getMonth() + 1).toString().padStart(2, '0'),
      today.getDate().toString().padStart(2, '0'),
    ].join('-');

    const blobUrl = window.URL.createObjectURL(response);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.setAttribute('download', `${fileName}_${dateString}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);

    toast.success(successMessage);
  } catch (error) {
    console.error(error);
    toast.error(errorMessage);
  }
};

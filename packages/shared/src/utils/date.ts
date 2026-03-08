export const minutesToMs = (minutes: number) => minutes * 60 * 1000;

export const formatDate = (date: string | Date) => {
  const d = new Date(date);
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

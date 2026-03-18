import { post, studentQueryKeys, studentUrl } from '@repo/shared/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useGraduateThirdGrade = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: studentQueryKeys.postGraduateThirdGrade(),
    mutationFn: () => post(studentUrl.postGraduateThirdGrade()),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['students'],
      });
    },
  });
};

import { z } from 'zod';

export const ApplicationFormSchema = z.object({
  applicationName: z.string().min(1, '애플리케이션 이름을 입력해주세요.'),
  applicationScopes: z
    .array(
      z.object({
        applicationScope: z.string().min(1, '권한 범위를 입력해주세요.'),
        applicationDescription: z.string().min(1, '권한 설명을 입력해주세요.'),
      }),
    )
    .min(1, '최소 하나 이상의 권한 범위를 추가해주세요.'),
});

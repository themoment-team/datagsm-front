import { z } from 'zod';

export const ApplicationFormSchema = z.object({
  applicationName: z.string().min(1, { message: '애플리케이션 이름을 입력해주세요.' }),
  applicationScopes: z
    .array(
      z.object({
        scopeId: z.number().optional(),
        applicationScope: z.string().min(1, { message: '권한 범위를 입력해주세요.' }),
        applicationDescription: z.string().min(1, { message: '권한 설명을 입력해주세요.' }),
      }),
    )
    .min(1, { message: '최소 한 개 이상의 권한 범위가 필요합니다.' }),
});

export type ApplicationFormType = z.infer<typeof ApplicationFormSchema>;

export const ApplicationFilterSchema = z.object({
  name: z.string().optional(),
});

export type ApplicationFilterType = z.infer<typeof ApplicationFilterSchema>;

import { z } from 'zod';

export const ClientFormSchema = z.object({
  name: z.string().min(1, { message: '클라이언트 이름을 입력해주세요.' }),
  redirectUrls: z
    .array(z.string().url({ message: '올바른 URL 형식이 아닙니다.' }))
    .min(1, { message: '최소 한 개 이상의 리다이렉트 URL이 필요합니다.' }),
  scopes: z.array(z.string()).min(1, { message: '최소 한 개 이상의 권한을 선택해주세요.' }),
});

export type ClientFormType = z.infer<typeof ClientFormSchema>;

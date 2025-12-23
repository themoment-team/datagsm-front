import z from 'zod';

export const ApiKeyFormSchema = z.object({
  scopes: z.array(z.string()).min(1, { message: '권한 범위를 최소 1개 이상 선택해주세요.' }),
  description: z.string().min(1, { message: '설명을 입력해주세요.' }),
});

export type ApiKeyType = z.infer<typeof ApiKeyFormSchema>;

export type CreateApiKeyType = z.infer<typeof ApiKeyFormSchema>;

export type UpdateApiKeyType = z.infer<typeof ApiKeyFormSchema>;

import { z } from 'zod';

export const ApiKeyFilterSchema = z.object({
  id: z.string().optional(),
  accountId: z.string().optional(),
  scope: z.string().optional(),
  isExpired: z.enum(['all', 'true', 'false']).optional(),
  isRenewable: z.enum(['all', 'true', 'false']).optional(),
});

export type ApiKeyFilterType = z.infer<typeof ApiKeyFilterSchema>;

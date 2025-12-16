import { z } from 'zod';

export const ClubFilterSchema = z.object({
  clubType: z.string().optional(),
});

export type ClubFilterType = z.infer<typeof ClubFilterSchema>;

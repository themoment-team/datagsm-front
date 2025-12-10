import { z } from 'zod';

export const StudentFilterSchema = z.object({
  grade: z.string().optional(),
  classNum: z.string().optional(),
  sex: z.string().optional(),
  role: z.string().optional(),
  status: z.string().optional(),
});

export type StudentFilterType = z.infer<typeof StudentFilterSchema>;

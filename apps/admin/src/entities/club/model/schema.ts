import { z } from 'zod';

export const ClubFilterSchema = z.object({
  clubType: z.string().optional(),
});

export type ClubFilterType = z.infer<typeof ClubFilterSchema>;

export const AddClubSchema = z.object({
  name: z.string().min(1, { message: '동아리명을 입력해주세요.' }),
  type: z.enum(['MAJOR_CLUB', 'JOB_CLUB', 'AUTONOMOUS_CLUB'], {
    message: '동아리 타입을 선택해주세요.',
  }),
});

export type AddClubType = z.infer<typeof AddClubSchema>;

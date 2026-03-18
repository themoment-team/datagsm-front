import { z } from 'zod';

export const ClubFilterSchema = z.object({
  clubName: z.string().optional(),
  clubType: z.string().optional(),
});

export type ClubFilterType = z.infer<typeof ClubFilterSchema>;

export const AddClubSchema = z.object({
  name: z.string().min(1, { message: '동아리명을 입력해주세요.' }),
  type: z.enum(['MAJOR_CLUB', 'AUTONOMOUS_CLUB'], {
    message: '동아리 종류를 선택해주세요.',
  }),
  leaderId: z.number({ message: '동아리 부장을 선택해주세요.' }).min(1),
  participantIds: z.array(z.number()).min(1, { message: '한 명 이상의 팀원을 선택해주세요.' }),
});

export type AddClubType = z.infer<typeof AddClubSchema>;

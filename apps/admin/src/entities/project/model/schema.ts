import { z } from 'zod';

export const ProjectFilterSchema = z.object({
  projectName: z.string().optional(),
  clubId: z.number().optional(),
  status: z.enum(['ACTIVE', 'ENDED']).optional(),
});

export type ProjectFilterType = z.infer<typeof ProjectFilterSchema>;

export const AddProjectSchema = z
  .object({
    name: z.string().min(1, { message: '프로젝트명을 입력해주세요.' }),
    description: z.string().min(1, { message: '프로젝트 설명을 입력해주세요.' }),
    startYear: z
      .number({ message: '시작 연도를 입력해주세요.' })
      .int()
      .min(1900, { message: '1900년 이후의 연도를 입력해주세요.' }),
    clubId: z.number().nullable().optional(),
    participantIds: z.array(z.number()).min(1, { message: '한 명 이상의 팀원을 선택해주세요.' }),
    status: z.enum(['ACTIVE', 'ENDED'], {
      message: '운영 상태를 선택해주세요.',
    }),
    endYear: z.number().int().min(1900, { message: '1900년 이후의 연도를 입력해주세요.' }).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.status === 'ACTIVE') {
      return;
    }

    if (data.endYear === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '종료 연도를 입력해주세요.',
        path: ['endYear'],
      });
      return;
    }

    if (data.endYear < data.startYear) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '종료 연도는 시작 연도보다 크거나 같아야 합니다.',
        path: ['endYear'],
      });
    }
  });

export type AddProjectType = z.infer<typeof AddProjectSchema>;

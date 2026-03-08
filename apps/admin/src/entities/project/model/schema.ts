import { z } from 'zod';

export const ProjectFilterSchema = z.object({
  projectName: z.string().optional(),
  clubId: z.number().optional(),
});

export type ProjectFilterType = z.infer<typeof ProjectFilterSchema>;

export const AddProjectSchema = z.object({
  name: z.string().min(1, { message: '프로젝트명을 입력해주세요.' }),
  description: z.string().min(1, { message: '프로젝트 설명을 입력해주세요.' }),
  clubId: z.number().nullable().optional(),
  participantIds: z.array(z.number()).min(1, { message: '한 명 이상의 팀원을 선택해주세요.' }),
});

export type AddProjectType = z.infer<typeof AddProjectSchema>;

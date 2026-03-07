import { z } from 'zod';

export const ProjectFilterSchema = z.object({
  searchTerm: z.string().optional(),
  clubId: z.number().optional(),
});

export type ProjectFilterType = z.infer<typeof ProjectFilterSchema>;

export const AddProjectSchema = z.object({
  name: z.string().min(1, { message: '프로젝트명을 입력해주세요.' }),
  description: z.string().min(1, { message: '프로젝트 설명을 입력해주세요.' }),
  clubId: z.number().optional(),
});

export type AddProjectType = z.infer<typeof AddProjectSchema>;

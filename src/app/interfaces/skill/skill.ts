export type IMiniSkillWithoutCategory = {
  id: number;
  name: string;
};
export type IMiniSkill = IMiniSkillWithoutCategory & {
  category: { id: number; name: string };
};

export type IMiniCategory = {
  id: number;
  name: string;
};

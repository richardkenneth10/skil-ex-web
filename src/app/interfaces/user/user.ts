export type IUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  bio: string | null;
  avatarUrl: string | null;
  role: "USER" | "ADMIN";
  createdAt: Date;
  updatedAt: Date;
};

export type IMiniUser = {
  id: number;
  name: string;
  bio: string | null;
  avatarUrl: string | null;
  updatedAt: Date;
};

export type SignalingUserRole = "TEACHER" | "LEARNER";

export type SignalingUser = {
  id: string;
  role: SignalingUserRole;
};

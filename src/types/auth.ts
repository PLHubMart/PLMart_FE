import { UserAward, UserCertification, UserExperience, UserProject, UserSkill, UserSocialProfile } from "./profile";

export enum EUser {
  Admin = 0,
  User = 1
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  dateOfBirth: string;
  role: EUser;
}

export interface RegisterResponse {
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  isRegistered: boolean; 
}

export interface RefreshRequest {
  userId: string;
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message?: string;
}

export interface ResetPasswordRequest {
  userId: string;
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message?: string;
}

export interface UserInfoResponse {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  phoneNumber: string;
  dateOfBirth: string;
  description?: string;
  career: number;
  careerName?: string;
  position: number;
  positionName?: string;
  level: number;
  levelName?: string;
  role: number;
  roleName?: string;
  workingCity: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  cvUrl?: string; // CV file URL from profile
  companyId?: string; 
  awards?: UserAward[];
  certifications?: UserCertification[];
  experiences?: UserExperience[];
  skills?: UserSkill[];
  socialProfiles?: UserSocialProfile[];
  projects?: UserProject[];
}

export interface UpdateAdditionalInfoRequest {
  role: number;
  career?: number | string;
  position?: number | string;
  level?: number | string;
  workingCity?: string;
  companyId?: string | null;
}

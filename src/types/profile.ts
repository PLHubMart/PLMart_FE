export interface UserAward {
  id: string;
  title: string;
  issueDate: string;
  description?: string;
}

export interface UserCertification {
  id: string;
  name: string;
  organization: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface UserExperience {
  id: string;
  companyName: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  location?: string;
}

export interface UserProject {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  projectUrl?: string;
  technologies: string[];
}

export interface UserSkill {
  id: string;
  name: string;
  level: number; // 1-5 or similar
}

export interface UserSocialProfile {
  id: string;
  platform: string;
  url: string;
}

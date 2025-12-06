import { Submission } from "./submission";

export type Badge = {
  badgeId: string;
  collectionName: string;
  name: string;
  badgeUrl: string;
  description: string;
  type: string[];
};

export type BadgeWithSubmissions = Badge & {
  submissions: Submission[];
};

export type CreateBadge = {
  collectionName: string;
  name: string;
  file: string;
  description: string;
  type: string[];
};

export type UpdateBadge = {
  collectionName?: string;
  name?: string;
  file?: string;
  description?: string;
  type?: string[];
};

export type DeleteResponse = {
  badgeId: string;
};

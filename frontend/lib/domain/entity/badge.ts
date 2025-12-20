import { Submission } from "./submission";

export interface Badge {
  badgeId: string;
  collectionName: string;
  name: string;
  file: string;
  description: string;
  type: string[];
  submissionStatus: number; //  (0: no submission, 1: under review, 2: accepted, 3: rejected)
  submissionId: string;
}

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

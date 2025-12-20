<<<<<<< HEAD
export interface Submission {
  submissionId: string;
  userId: string;
  badgeId: string;
  reviewer: number; // Count of reviewers
  file: string; // S3 url
  description: string;
}
=======
export type Submission = {
  badgeId: string;
  submissionId: string;
  userId: string;
  reviewer: number; // (Count of reviewers)
  file: string; // (S3 url)
  description: string;
};
>>>>>>> origin/main

export type Submission = {
  badgeId: string;
  submissionId: string;
  userId: string;
  reviewer: number; // (Count of reviewers)
  file: string; // (S3 url)
  description: string;
};

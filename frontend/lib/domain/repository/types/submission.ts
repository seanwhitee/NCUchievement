export type SubmissionOutput = {
  badge_id: string;
  submission_id: string;
  user_id: string;
  reviewer: number; // (Count of reviewers)
  file: string; // (S3 url)
  description: string;
};

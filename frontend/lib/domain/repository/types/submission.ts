export interface SubmissionOutput {
  submission_id: string;
  user_id: string;
  badge_id: string;
  reviewer: number; // Count of reviewers
  file: string; // S3 url
  description: string;
}

export type BadgeOutput = {
  badge_id: string;
  collection_name: string;
  name: string;
  badge_url: string;
  description: string;
  type: string[];
  submission_status: number; //  (0: no submission, 1: under review, 2: accepted, 3: rejected)
  submission_id: string;
};

export type CreateBadgeInput = {
  collection_name: string;
  name: string;
  file: string; // base64
  description: string;
  type: string[]; // (submission file types)
};

export type UpdateBadgeInput = {
  collection_name?: string;
  name?: string;
  description?: string;
  file?: string; // (base64),
  type?: string[]; // (submission file types)
};

export type DeleteOutput = {
  badge_id: string;
};

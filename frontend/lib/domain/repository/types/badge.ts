export type BadgeOutput = {
  badge_id: string;
  collection_name: string;
  name: string;
  file: string;
  description: string;
  type: string[]; // (submission file types)
  submission_status: number;
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

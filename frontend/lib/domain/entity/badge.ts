export type Badge = {
  badgeId: string;
  collectionName: string;
  name: string;
  badgeUrl: string;
  description: string;
  type: string[]; // (submission file types)
};

export type CreateBadge = {
  collectionName: string;
  name: string;
  file: string; // base64
  description: string;
  type: string[]; // (submission file types)
};

export type UpdateBadge = {
  collectionName?: string;
  name?: string;
  file?: string; // base64
  description?: string;
  type?: string[]; // (submission file types)
};

export type DeleteResponse = {
  badgeId: string;
};

import { BACKEND_BASE_URL } from "@/lib/env";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { tryCatch } from "@/utils/tryCatch";
import {
  BadgeOutput,
  CreateBadgeInput,
  DeleteOutput,
  UpdateBadgeInput,
} from "./types/badge";

import { Badge, CreateBadge, DeleteResponse } from "../entity/badge";

export const badgeRepo = {
  getBadges: async (userId: string): Promise<Badge[]> => {
    const [badges, err] = await tryCatch<BadgeOutput[]>(() =>
      fetchWithAuth(`${BACKEND_BASE_URL}/badges?user_id=${userId}`)
    );
    if (err) throw err;
    return badges!.map(badgeRepo.toEntity);
  },
  submit: async (badgeId: string, description: string, fileBase64: string) => {
    const [data, err] = await tryCatch(() =>
      fetch(`${BACKEND_BASE_URL}/badge/${badgeId}/submission`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, file: fileBase64 }),
      })
    );
  },
  createBadge: async (entity: CreateBadge): Promise<Badge> => {
    const { collectionName, ...rest } = entity;
    const apiInput: CreateBadgeInput = {
      collection_name: collectionName,
      ...rest,
    };

    const [data, err] = await tryCatch<BadgeOutput>(() =>
      fetchWithAuth(`${BACKEND_BASE_URL}/badge`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(apiInput),
      })
    );

    if (err) throw err;
    return badgeRepo.toEntity(data!);
  },
  updateBadge: async (id: string, input: UpdateBadgeInput): Promise<Badge> => {
    const [data, err] = await tryCatch<BadgeOutput>(() =>
      fetchWithAuth(`${BACKEND_BASE_URL}/badge/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify(input),
      })
    );
    if (err) throw err;

    return badgeRepo.toEntity(data!);
  },
  delete: async (id: string): Promise<DeleteResponse> => {
    const [data, err] = await tryCatch<DeleteOutput>(() =>
      fetchWithAuth(`${BACKEND_BASE_URL}/badge/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "DELETE",
      })
    );
    if (err) throw err;
    return {
      badgeId: data!.badge_id,
    };
  },
  toEntity: (output: BadgeOutput): Badge => {
    const {
      badge_id,
      collection_name,
      submission_status,
      submission_id,
      ...rest
    } = output;
    return {
      badgeId: badge_id,
      collectionName: collection_name,
      submissionStatus: submission_status,
      submissionId: submission_id,
      ...rest,
    };
  },
};

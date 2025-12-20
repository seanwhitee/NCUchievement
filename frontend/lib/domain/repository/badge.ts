import { BACKEND_BASE_URL } from "@/lib/env";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { tryCatch } from "@/utils/tryCatch";
import {
  BadgeOutput,
  CreateBadgeInput,
  DeleteOutput,
  UpdateBadgeInput,
} from "./types/badge";
import { BACKEND_BASE_URL } from "@/lib/env";
import { Badge, CreateBadge, DeleteResponse } from "../entity/badge";
import { tryCatch } from "@/utils/tryCatch";

const baseUrl = `${BACKEND_BASE_URL}/api/badges`;

export const badgeRepo = {
  getBadges: async (): Promise<Badge[]> => {
    // TODO: remove mock data after api integration
    // const [data, err] = await tryCatch<BadgeOutput[]>(() =>
    //   fetchWithAuth(baseUrl).then((res) => res.json())
    // );
    // if (err) throw err;
    // return data!.map(badgeRepo.mapToEntity);
    const mockBadges = [
      {
        badge_id: "mockBadgeId",
        collection_name: "mockCollectionName",
        name: "mockName",
        badge_url: "mockBadgeUrl",
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        type: ["mocktype"],
        submission_status: 0,
        submission_id: "mockSubmissionId",
      },

      {
        badge_id: "mockBadgeId1",
        collection_name: "mockCollectionName",
        name: "mockName1",
        badge_url: "mockBadgeUrl1",
        description: "mockDesciption1",
        type: ["mocktype"],
        submission_status: 1,
        submission_id: "mockSubmissionId1",
      },
      {
        badge_id: "mockBadgeId2",
        collection_name: "mockCollectionName2",
        name: "mockName2",
        badge_url: "mockBadgeUrl2",
        description: "mockDesciption2",
        type: ["mocktype2"],
        submission_status: 2,
        submission_id: "mockSubmissionId",
      },
      {
        badge_id: "mockBadgeId3",
        collection_name: "mockCollectionName2",
        name: "mockName3",
        badge_url: "mockBadgeUrl3",
        description: "mockDesciption3",
        type: ["mocktype3"],
        submission_status: 3,
        submission_id: "mockSubmissionId3",
      },
    ];

    return mockBadges.map(badgeRepo.mapToEntity);
  },

  submit: async (badgeId: string, description: string, fileBase64: string) => {
    // TODO: remove mock data after api integration
    // const [data, err] = await tryCatch(() =>
    //   fetch(`${baseUrl}/${badgeId}/submission`, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ description, file: fileBase64 }),
    //   })
    // );

    const [data, err] = await tryCatch(async () => {
      const mockData = {
        submissionId: "mockSubmissionId",
        userId: "mockUserId",
        reviewer: 1, // count of reviewer
      };

      return new Response(JSON.stringify(mockData), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    });
    if (err) throw err;
    return data;
import { Badge, CreateBadge, DeleteResponse } from "../entity/badge";

export const badgeRepo = {
  getBadges: async (): Promise<Badge[]> => {
    const [badges, err] = await tryCatch<BadgeOutput[]>(() =>
      fetchWithAuth(`${BACKEND_BASE_URL}/badges`)
    );
    if (err) throw err;
    return badges!.map(badgeRepo.toEntity);
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
    const { badge_id, collection_name, ...rest } = output;
    return {
      badgeId: badge_id,
      collectionName: collection_name,
      ...rest,
    };
  },
};

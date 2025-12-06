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
  getBadges: async (): Promise<Badge[]> => {
    // const [, err] = await tryCatch<BadgeOutput>(() =>
    //   fetchWithAuth(`${BACKEND_BASE_URL}/api/badges`)
    // );
    // if (err) throw err;
    // TODO: remove mock data after api integration
    const mockBadges: Badge[] = [
      {
        badgeId: "1",
        badgeUrl: "/icon.png",
        collectionName: "collection 1",
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        name: "Having three meals in same rest",
        type: ["image/png"],
      },
      {
        badgeId: "2",
        badgeUrl: "/icon.png",
        collectionName: "collection 2",
        description: "test badge 2",
        name: "Having three meals in same rest 22222",
        type: ["image/png"],
      },
      {
        badgeId: "3",
        badgeUrl: "/icon.png",
        collectionName: "collection 1",
        description: "test badge 3",
        name: "Having three meals in same rest 222222222211113454",
        type: ["image/png"],
      },
    ];
    return mockBadges;
  },
  createBadge: async (entity: CreateBadge): Promise<Badge> => {
    // const { collectionName, ...rest } = entity;
    // const apiInput: CreateBadgeInput = {
    //   collection_name: collectionName,
    //   ...rest,
    // };
    // const [data, err] = await tryCatch<BadgeOutput>(() =>
    //   fetchWithAuth(`${BACKEND_BASE_URL}/api/badge`, {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     method: "POST",
    //     body: JSON.stringify(apiInput),
    //   })
    // );
    // if (err) throw err;

    // TODO: remove mock data after api integration
    const mock: Badge = {
      badgeId: "4",
      badgeUrl: "/icon.png",
      collectionName: "collection 3",
      description: "test badge 4",
      name: "Having three meals in same rest 4",
      type: ["image/png"],
    };
    return mock;
  },
  updateBadge: async (id: string, input: UpdateBadgeInput): Promise<Badge> => {
    // const [data, err] = await tryCatch<BadgeOutput>(() =>
    //   fetchWithAuth(`${BACKEND_BASE_URL}/api/badge/${id}`, {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     method: "PUT",
    //     body: JSON.stringify(input),
    //   })
    // );
    // if (err) throw err;
    // TODO: remove mock data after api integration
    const data: BadgeOutput = {
      badge_id: "1",
      badge_url: "/icon.png",
      collection_name: "collection 1",
      description: "Lorem Ipsum is simply dummy text.",
      name: "Having three meals in same rest",
      type: ["image/png"],
    };
    return badgeRepo.toEntity(data!);
  },
  delete: async (id: string): Promise<DeleteResponse> => {
    // const [data, err] = await tryCatch<DeleteOutput>(() =>
    //   fetchWithAuth(`${BACKEND_BASE_URL}/api/badge/${id}`, {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     method: "DELETE",
    //   })
    // );
    // if (err) throw err;
    // return {
    //   badgeId: data!.badge_id,
    // };
    // TODO: remove mock data after api integration
    return {
      badgeId: "1",
    };
  },
  toEntity: (output: BadgeOutput): Badge => {
    const { badge_id, collection_name, badge_url, ...rest } = output;
    return {
      badgeId: badge_id,
      collectionName: collection_name,
      badgeUrl: badge_url,
      ...rest,
    };
  },
};

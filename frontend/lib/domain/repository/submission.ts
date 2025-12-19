import { BACKEND_BASE_URL } from "@/lib/env";
import { Submission } from "../entity/submission";
import { SubmissionOutput } from "./types/submission";
import { tryCatch } from "@/utils/tryCatch";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

const baseUrl = `${BACKEND_BASE_URL}/api/submission`;

export const submissionRepo = {
  getSubmission: async (submissionId: string): Promise<Submission> => {
    // GET /api/submission/{submission_id}
    // TODO: remove mock data after api integration
    // const [data, err] = await tryCatch<SubmissionOutput>(() =>
    //   fetchWithAuth(`${BACKEND_BASE_URL}/api/submission/${submissionId}`, {
    //     method: "GET",
    //   })
    // );
    // if (err) throw err;
    // return submissionRepo.toEntity(data!);
    const mockData = {
      submissionId: "mockSubmissionId",
      userId: "mockUserId",
      badgeId: "mockBadgeId",
      reviewer: 1, // Count of reviewers
      file: "https://www.alleycat.org/wp-content/uploads/2019/03/FELV-cat.jpg", // S3 url
      description:
        "In the heart of a bustling city, there lies a small, hidden garden that few people know about. Its entrance is tucked between two tall, gray buildings, and a narrow cobblestone path leads visitors into a world of calm and serenity. Birds chirp melodiously in the trees, and colorful flowers bloom in carefully arranged patterns. The air carries the faint scent of jasmine and lavender, calming the mind and soothing the soul. People who discover this oasis often find themselves lingering for hours, reading, sketching, or simply enjoying the quiet. It serves as a gentle reminder that even in the midst of chaos, pockets of peace can be found if one takes the time to look.",
    };
    return mockData;
  },

  getRandomSubmissions: async (): Promise<Submission[]> => {
    // TODO: remove mock data after api integration
    // const [data, err] = await tryCatch<SubmissionOutput[]>(() =>
    //   fetchWithAuth(`${BACKEND_BASE_URL}/review/random`, {
    //     method: "GET",
    //   })
    // );
    // if (err) throw err;
    // return data!.map(submissionRepo.toEntity);

    const mockSubmissions = [
      {
        submissionId: "mockSubmissionId",
        userId: "mockUserId",
        badgeId: "mockBadgeId",
        reviewer: 1, // Count of reviewers
        file: "https://www.alleycat.org/wp-content/uploads/2019/03/FELV-cat.jpg", // S3 url
        description:
          "In the heart of a bustling city, there lies a small, hidden garden that few people know about. Its entrance is tucked between two tall, gray buildings, and a narrow cobblestone path leads visitors into a world of calm and serenity. Birds chirp melodiously in the trees, and colorful flowers bloom in carefully arranged patterns. The air carries the faint scent of jasmine and lavender, calming the mind and soothing the soul. People who discover this oasis often find themselves lingering for hours, reading, sketching, or simply enjoying the quiet. It serves as a gentle reminder that even in the midst of chaos, pockets of peace can be found if one takes the time to look.",
      },
      {
        submissionId: "mockSubmissionId2",
        userId: "mockUserId2",
        badgeId: "mockBadgeId2",
        reviewer: 1, // Count of reviewers
        file: "https://www.alleycat.org/wp-content/uploads/2019/03/FELV-cat.jpg", // S3 url
        description:
          "In the heart of a bustling city, there lies a small, hidden garden that few people know about. Its entrance is tucked between two tall, gray buildings, and a narrow cobblestone path leads visitors into a world of calm and serenity. Birds chirp melodiously in the trees, and colorful flowers bloom in carefully arranged patterns. The air carries the faint scent of jasmine and lavender, calming the mind and soothing the soul. People who discover this oasis often find themselves lingering for hours, reading, sketching, or simply enjoying the quiet. It serves as a gentle reminder that even in the midst of chaos, pockets of peace can be found if one takes the time to look.",
      },
    ];
    return mockSubmissions;
  },
  getSubmissions: async () => {
    const [data, err] = await tryCatch<SubmissionOutput[]>(() =>
      fetchWithAuth(`${BACKEND_BASE_URL}/submissions`)
    );
    if (err) throw err;

    return data!.map(submissionRepo.toEntity);
  },
  review: async (
    submissionId: string,
    isApproved: boolean
  ): Promise<Submission> => {
    const [data, err] = await tryCatch<SubmissionOutput>(() =>
      fetchWithAuth(`${BACKEND_BASE_URL}/review/${submissionId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ is_approved: isApproved }),
      })
    );

    if (err) throw err;
    return submissionRepo.toEntity(data!);
  },

  toEntity: (output: SubmissionOutput): Submission => {
    const { badge_id, submission_id, user_id, ...rest } = output;
    return {
      badgeId: badge_id,
      submissionId: submission_id,
      userId: user_id,
      ...rest,
    };
  },
};

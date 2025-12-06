import { tryCatch } from "@/utils/tryCatch";
import { SubmissionOutput } from "./types/submission";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { BACKEND_BASE_URL } from "@/lib/env";
import { Submission } from "../entity/submission";

export const submissionRepo = {
  getSubmissions: async () => {
    // const [data, err] = await tryCatch<SubmissionOutput[]>(() =>
    //   fetchWithAuth(`${BACKEND_BASE_URL}/api/submissions`)
    // );
    // if (err) throw err;

    // return data!.map(submissionRepo.toEntity);
    // TODO: Remove mock data after api integration
    const submissions: Submission[] = [
      {
        badgeId: "1",
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        file: "https://unsplash.com/s/photos/image",
        reviewer: 1,
        submissionId: "123",
        userId: "mockId2",
      },
    ];
    return submissions;
  },
  review: async (
    submissionId: string,
    isApproved: boolean
  ): Promise<Submission> => {
    // const [data, err] = await tryCatch<SubmissionOutput>(() =>
    //   fetchWithAuth(`${BACKEND_BASE_URL}/api/review/${submissionId}`, {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     method: "POST",
    //     body: JSON.stringify({ is_approved: isApproved }),
    //   })
    // );

    // if (err) throw err;
    // return submissionRepo.toEntity(data!);
    return {
      badgeId: "1",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      file: "https://unsplash.com/s/photos/image",
      reviewer: 2,
      submissionId: "123",
      userId: "mockId2",
    } as Submission;
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

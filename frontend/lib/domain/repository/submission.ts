import { tryCatch } from "@/utils/tryCatch";
import { SubmissionOutput } from "./types/submission";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { BACKEND_BASE_URL } from "@/lib/env";
import { Submission } from "../entity/submission";

export const submissionRepo = {
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

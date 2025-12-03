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
        description: "This is my submission 1, pls review.",
        file: "testfile",
        reviewer: 1,
        submissionId: "123",
        userId: "mockId2",
      },
    ];
    return submissions;
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

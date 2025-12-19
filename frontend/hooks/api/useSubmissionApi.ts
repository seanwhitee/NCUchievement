import { toast } from "@/components/AppToast";
import { submissionRepo } from "@/lib/domain/repository/submission";
import { useEffect } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

export const useSubmissionApi = () => {
  const {
    data: submissions,
    isLoading: getLoading,
    error: getError,
    mutate: mutateSubmissions,
  } = useSWR("submissionRepo.getSubmissions", () =>
    submissionRepo.getSubmissions()
  );

  const {
    data: randomSubmissions,
    isLoading: getRandomLoading,
    error: getRandomError,
    mutate: mutateRandomSubmissions,
  } = useSWR("submissionRepo.getRandomSubmissions", () =>
    submissionRepo.getRandomSubmissions()
  );

  const {
    trigger: review,
    isMutating: reviewLoading,
    error: reviewError,
  } = useSWRMutation(
    "submissionRepo.review",
    (_, { arg }: { arg: { id: string; isApproved: boolean } }) =>
      submissionRepo.review(arg.id, arg.isApproved)
  );

  useEffect(() => {
    if (getError) toast({ title: "Get submissions error", type: "error" });
    if (reviewError)
      toast({ title: "Review submissions error", type: "error" });
    if (getRandomError)
      toast({ title: "Get random submissions error", type: "error" });
  }, [getError, reviewError, getRandomError]);

  return {
    query: {
      submissions,
      randomSubmissions,
    },
    mutation: {
      review,
      mutateSubmissions,
      mutateRandomSubmissions,
    },
    loading: {
      getLoading,
      reviewLoading,
      getRandomLoading,
    },
  };
};

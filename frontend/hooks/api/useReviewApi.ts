import { toast } from "@/components/AppToast";
import { submissionRepo } from "@/lib/domain/repository/submission";
import { useEffect } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

export const useReviewApi = () => {
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
    if (reviewError)
      toast({ title: "Review submissions error", type: "error" });
    if (getRandomError)
      toast({ title: "Get random submissions error", type: "error" });
  }, [reviewError, getRandomError]);

  return {
    query: {
      randomSubmissions,
    },
    mutation: {
      review,
      mutateRandomSubmissions,
    },
    loading: {
      reviewLoading,
      getRandomLoading,
    },
  };
};

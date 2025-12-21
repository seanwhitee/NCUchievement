import { toast } from "@/components/AppToast";
import { Submission } from "@/lib/domain/entity/submission";
import { submissionRepo } from "@/lib/domain/repository/submission";
import { useEffect } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import useSWRImmutable from "swr/immutable";

export const useReviewApi = () => {
  const {
    data: randomSubmissions,
    isLoading: getRandomLoading,
    error: getRandomError,
    mutate: mutateRandomSubmissions,
  } = useSWRImmutable(
    "submissionRepo.getRandomSubmissions",
    () => submissionRepo.getRandomSubmissions(),
    {
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        // Never retry on 404.
        if (error.status === 404) return;
        if (retryCount >= 5) return;
        // Retry after 10 seconds.
        setTimeout(() => revalidate({ retryCount }), 10000);
      },
    }
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

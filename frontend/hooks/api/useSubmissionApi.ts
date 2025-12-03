import { toast } from "@/components/AppToast";
import { submissionRepo } from "@/lib/domain/repository/submission";
import { useEffect } from "react";
import useSWR from "swr";

export const useSubmissionApi = () => {
  const {
    data: submissions,
    isLoading: getLoading,
    error: getError,
  } = useSWR("submissionRepo.getSubmissions", () =>
    submissionRepo.getSubmissions()
  );

  useEffect(() => {
    if (getError) toast({ title: "Get submissions error", type: "error" });
  }, [getError]);

  return {
    query: {
      submissions,
    },
    loading: {
      getLoading,
    },
  };
};

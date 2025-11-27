import { toast } from "@/components/AppToast";
import { oauthRepo } from "@/lib/domain/repository/oauth";
import { useEffect } from "react";
import useSWR from "swr";

export const useUserApi = () => {
  const {
    data: currentUser,
    isLoading: getUserLoading,
    error: getUserError,
  } = useSWR("oauthRepo.me", () => oauthRepo.me());

  useEffect(() => {
    if (getUserError) toast({ title: "Get user failed", type: "error" });
  });

  return {
    query: {
      currentUser,
    },
    loading: {
      getUserLoading,
    },
  };
};

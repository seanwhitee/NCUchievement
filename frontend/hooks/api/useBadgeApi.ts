import { toast } from "@/components/AppToast";
import { CreateBadge } from "@/lib/domain/entity/badge";
import { badgeRepo } from "@/lib/domain/repository/badge";
import { useEffect } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { UpdateBadge } from "../../lib/domain/entity/badge";

export const useBadgeApi = (userId?: string) => {
  const {
    data: badges,
    isLoading: getBadgesLoading,
    error: getBadgesError,
    mutate: mutateBadges,
  } = useSWR(userId ? "badgeRepo.getBadges" : null, () =>
    badgeRepo.getBadges(userId!)
  );
  const {
    trigger: submit,
    isMutating: submitLoading,
    error: submitError,
  } = useSWRMutation(
    "badgeRepo.submit",
    (
      _,
      {
        arg,
      }: { arg: { badgeId: string; description: string; fileBase64: string } }
    ) => badgeRepo.submit(arg.badgeId, arg.description, arg.fileBase64)
  );

  const {
    trigger: createBadge,
    isMutating: createLoading,
    error: createError,
  } = useSWRMutation(
    "badgeRepo.createBadge",
    (_, { arg }: { arg: { entity: CreateBadge } }) =>
      badgeRepo.createBadge(arg.entity)
  );

  const {
    trigger: updateBadge,
    isMutating: updateLoading,
    error: updateError,
  } = useSWRMutation(
    "badgeRepo.updateBadge",
    (_, { arg }: { arg: { id: string; entity: UpdateBadge } }) =>
      badgeRepo.updateBadge(arg.id, arg.entity)
  );

  const {
    trigger: deleteBadge,
    isMutating: deleteLoading,
    error: deleteError,
  } = useSWRMutation(
    "badgeRepo.delete",
    (_, { arg }: { arg: { id: string } }) => badgeRepo.delete(arg.id)
  );

  useEffect(() => {
    if (getBadgesError) toast({ type: "error", title: "Get badges error" });
    if (createError) toast({ type: "error", title: "Create badge error" });
    if (updateError) toast({ type: "error", title: "Update badge error" });
    if (deleteError) toast({ type: "error", title: "Delete badge error" });
    if (submitError) toast({ type: "error", title: "Submit badge error" });
  }, [getBadgesError, createError, updateError, deleteError, submitError]);

  return {
    query: {
      badges,
    },
    mutation: {
      mutateBadges,
      createBadge,
      updateBadge,
      deleteBadge,
      submit,
    },
    loading: {
      getBadgesLoading,
      createLoading,
      updateLoading,
      deleteLoading,
      submitLoading,
    },
  };
};

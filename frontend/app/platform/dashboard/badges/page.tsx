"use client";

import { Button } from "@/components/ui/button";
import { useBadgeApi } from "@/hooks/api/useBadgeApi";
import { useMemo, useState } from "react";
import { groupBy } from "ramda";
import { Badge, UpdateBadge } from "@/lib/domain/entity/badge";
import { Accordion } from "@/components/ui/accordion";
import CollectionContainer from "@/components/CollectionContainer";
import { Plus } from "lucide-react";
import CreateBadgeDialog, {
  FormValues,
} from "@/components/dashboard/CreateBadgeDialog";

const createDefaultValues: FormValues = {
  collectionName: "",
  description: "",
  file: "",
  name: "",
  type: [],
};
const BadgesPage = () => {
  const {
    query: { badges },
    mutation: { mutateBadges, createBadge, updateBadge, deleteBadge },
  } = useBadgeApi();

  const groupByCollection = useMemo(() => {
    const sortedBadges = (badges ?? []).toSorted((a, b) =>
      a.collectionName.localeCompare(b.collectionName)
    );
    return groupBy((b: Badge) => b.collectionName)(sortedBadges);
  }, [badges]);

  const [createDefault, setCreateDefault] = useState<undefined | FormValues>(
    undefined
  );

  const handleCreate = async (values: FormValues) => {
    const created = await createBadge({ entity: values });

    mutateBadges([...(badges ?? []), created]);
    setCreateDefault(undefined);
  };

  const handleUpdate = async (id: string, entity: UpdateBadge) => {
    const updated = await updateBadge({ id, entity });

    mutateBadges([
      ...(badges ?? []).map((b) => (b.badgeId === id ? updated : b)),
    ]);
  };

  const handleDelete = async (id: string) => {
    const { badgeId } = await deleteBadge({ id });
    mutateBadges([...(badges ?? []).filter((b) => b.badgeId !== badgeId)]);
  };
  return (
    <div className="flex flex-col">
      <Button
        className="bg-neutral-50 hover:bg-neutral-50/50 text-black self-end"
        onClick={() => setCreateDefault(createDefaultValues)}
      >
        <Plus />
        Create Badge
      </Button>
      <Accordion type="single" collapsible className="py-3 flex flex-col gap-2">
        {Object.entries(groupByCollection).map(([collectionName, badges]) => (
          <CollectionContainer
            key={collectionName}
            name={collectionName}
            badges={badges ?? []}
            onBadgeUpdate={handleUpdate}
            onBadgeDelete={handleDelete}
          />
        ))}
      </Accordion>
      {createDefault && (
        <CreateBadgeDialog
          isOpen={!!createDefault}
          defaultValues={createDefault}
          onCancel={() => setCreateDefault(undefined)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
};

export default BadgesPage;

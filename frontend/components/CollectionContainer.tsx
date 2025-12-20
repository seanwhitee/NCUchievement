import type {
  BadgeWithSubmissions,
  UpdateBadge,
} from "../lib/domain/entity/badge";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import AppBadge from "./AppBadge";

const CollectionContainer = ({
  name,
  badges,
  onSubmissionReview,
  onBadgeUpdate,
  onBadgeDelete,
}: {
  name: string;
  badges: BadgeWithSubmissions[];
  onSubmissionReview: (id: string, isApproved: boolean) => void;
  onBadgeUpdate: (id: string, entity: UpdateBadge) => void;
  onBadgeDelete: (id: string) => void;
}) => {
  return (
    <AccordionItem value={name} className="border-none">
      <AccordionTrigger className="bg-neutral-100 px-3">
        {name}
      </AccordionTrigger>
      <AccordionContent className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 place-items-center gap-2 pt-3 ">
        {badges.map((b) => (
          <AppBadge
            key={b.badgeId}
            {...b}
            onSubmissionReview={onSubmissionReview}
            onUpdate={onBadgeUpdate}
            onDelete={onBadgeDelete}
          />
        ))}
      </AccordionContent>
    </AccordionItem>
  );
};

export default CollectionContainer;

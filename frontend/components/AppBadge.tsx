import { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type {
  BadgeWithSubmissions,
  UpdateBadge,
} from "@/lib/domain/entity/badge";
import { Button } from "./ui/button";
import { EllipsisVertical } from "lucide-react";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip";
import UpdateBadgeDialog, { FormValues } from "./dashboard/UpdateBadgeDialog";

import SubmissionsDialog from "./dashboard/SubmissionsDialog";

export type BadgeProps = BadgeWithSubmissions & {
  onUpdate: (id: string, entity: UpdateBadge) => void;
  onDelete: (id: string) => void;
  onSubmissionReview: (id: string, isApproved: boolean) => void;
};
const AppBadge = ({
  onUpdate,
  onDelete,
  onSubmissionReview,
  ...rest
}: BadgeProps) => {
  const { name, description, badgeUrl, type, submissions } = rest;

  const [defaultBadge, setDefault] = useState<undefined | FormValues>(
    undefined
  );

  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleUpdate = (entity: UpdateBadge) => {
    onUpdate(rest.badgeId, entity);
    setDefault(undefined);
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <Tooltip>
          <TooltipTrigger asChild>
            <CardTitle className="truncate">{name}</CardTitle>
          </TooltipTrigger>
          <TooltipContent>
            <p>{name}</p>
          </TooltipContent>
        </Tooltip>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"} size={"icon"}>
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuItem
                onClick={() =>
                  setDefault({
                    collectionName: rest.collectionName,
                    description: rest.description,
                    file: "",
                    name: rest.name,
                    type: rest.type,
                  })
                }
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDialogOpen(true)}>
                Submissions
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(rest.badgeId)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-3">
        <Image src={badgeUrl} alt="badge-pic" width={100} height={100} />
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="w-full text-center truncate">{description}</p>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p>{description}</p>
          </TooltipContent>
        </Tooltip>
        <div>
          {type.map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
      </CardContent>
      {defaultBadge && (
        <UpdateBadgeDialog
          isOpen={!!defaultBadge}
          defaultValues={defaultBadge}
          onUpdate={handleUpdate}
          onCancel={() => setDefault(undefined)}
        />
      )}
      {isDialogOpen && (
        <SubmissionsDialog
          isOpen={isDialogOpen}
          submissions={submissions}
          onClose={() => setDialogOpen(false)}
          onReview={onSubmissionReview}
        />
      )}
    </Card>
  );
};

export default AppBadge;

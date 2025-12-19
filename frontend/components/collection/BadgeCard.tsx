import { Clock, LucideProps, Trophy, Flag, AlertCircle } from "lucide-react";
import { Badge } from "@/lib/domain/entity/badge";
import { Button } from "../ui/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { STATUS_CONFIG, SubmissionStatus } from "./config";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge as UIBadge } from "../ui/badge";

interface Props {
  badge: Badge;
  handleSubmit: (badge: Badge) => void;
  status: SubmissionStatus;
}

export const BadgeCard = ({ badge, handleSubmit, status }: Props) => {
  const config = STATUS_CONFIG[status];
  const StatusIcon = config.icon || Trophy;
  const isCompleted = status === "accepted";
  return (
    <Card
      onClick={() => handleSubmit(badge)}
      className={`transition-all hover:shadow-md hover:-translate-y-1 flex flex-col h-[250px] overflow-hidden ${
        isCompleted
          ? "bg-emerald-50/40 dark:bg-emerald-900/25"
          : "bg-white dark:bg-black dark:border-gray-700"
      }`}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 flex-1">
          <StatusIcon
            className={`w-5 h-5 ${
              isCompleted ? "text-emerald-500" : "text-slate-400"
            }`}
          />
          <span
            className={`dark:text-white ${
              isCompleted ? "text-slate-900" : "text-slate-700"
            }`}
          >
            {badge.name}
          </span>
        </CardTitle>
        <CardDescription className="text-sm pl-8 line-clamp-3 mt-2 mr-2 -ml-8  dark:text-gray-300">
          {badge.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 mt-auto">
        <UIBadge className={`${config.tagStyle} border-0 text-xs`}>
          {config.label}
        </UIBadge>
      </CardContent>
    </Card>
  );
};

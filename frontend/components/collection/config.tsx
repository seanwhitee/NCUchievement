import { LucideProps, Flag, Clock, Trophy, AlertCircle } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export type ViewMode = "form" | "history";

export type SubmissionStatus =
  | "noSubmission"
  | "underReview"
  | "accepted"
  | "rejected";

export const STATUS_CONFIG: Record<
  SubmissionStatus,
  {
    label: string;
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
    tagStyle: string;
  }
> = {
  noSubmission: {
    label: "No Submission",
    icon: Flag,
    tagStyle:
      "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  },
  underReview: {
    label: "Under Review",
    icon: Clock,
    tagStyle:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-200",
  },
  accepted: {
    label: "Accepted",
    icon: Trophy,
    tagStyle:
      "bg-emerald-100/50 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-200",
  },
  rejected: {
    label: "Rejected",
    icon: AlertCircle,
    tagStyle:
      "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-200",
  },
};

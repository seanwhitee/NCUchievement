import { Submission } from "@/lib/domain/entity/submission";
import { selectBadges } from "@/redux/badge/badgeSlice";
import { useAppSelector } from "@/redux/hooks/useAppSelector";
import { Clock, FileText } from "lucide-react";

interface Props {
  submissions: Submission[] | undefined;
  selectedId: string;
  handleSelect: (id: string) => void;
}

export const SubmissionList = ({
  submissions,
  selectedId,
  handleSelect,
}: Props) => {
  const badges = useAppSelector(selectBadges);

  const getBadgeName = (sub: Submission) => {
    const badge = badges?.find((b) => b.badgeId === sub.badgeId);
    return badge?.name;
  };

  return (
    <div className="w-1/5 border-r border-gray-200 dark:border-gray-800  bg-white flex flex-col dark:bg-black ">
      <div className="p-5 border-b border-gray-100 dark:border-gray-800 ">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Review{" "}
        </h1>
        <p className="text-sm text-slate-500 mt-1 dark:text-gray-100/70 ">
          Review Pending Items: {submissions?.length}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {submissions?.map((sub) => (
          <div
            key={sub.submissionId}
            onClick={() => handleSelect(sub.submissionId)}
            className={`p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer transition-colors hover:bg-slate-100/40 
                ${
                  selectedId === sub.submissionId
                    ? "bg-blue-50/80 border-l-4 border-l-blue-500 dark:bg-slate-500/70"
                    : "border-l-4 border-l-transparent"
                }
              `}
          >
            <div className="flex justify-between items-start mb-1">
              <span className="font-semibold text-slate-700 dark:text-white truncate pr-2">
                {getBadgeName(sub)}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-200`}
              >
                <Clock size={12} />
                pending
              </span>
            </div>
            <div className="flex justify-between items-center text-sm text-slate-500 mt-2">
              <span className="flex items-center gap-1 dark:text-gray-100/70">
                <FileText size={14} /> Reviewer: {sub.reviewer}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import { History, PenLine } from "lucide-react";
import { ViewMode } from "./config";

interface Props {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export const SubmissionModeToggle = ({ mode, onChange }: Props) => {
  return (
    <div className="flex p-1 mb-6 bg-gray-100 dark:bg-zinc-900 rounded-xl w-fit">
      <button
        onClick={() => onChange("history")}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
          ${
            mode === "history"
              ? "bg-white dark:bg-zinc-700/70 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          }
        `}
      >
        <History size={16} />
        Previous Submission
      </button>
      <button
        onClick={() => onChange("form")}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 
          ${
            mode === "form"
              ? "bg-white dark:bg-zinc-700/70 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          }
        `}
      >
        <PenLine size={16} />
        Resubmit
      </button>
    </div>
  );
};

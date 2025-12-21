import { Badge } from "@/lib/domain/entity/badge";
import { BadgeCheckIcon, Trophy, Upload, X } from "lucide-react";
import { FileUpload } from "../ui/file-upload";
import { useEffect, useRef, useState } from "react";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { badgeRepo } from "@/lib/domain/repository/badge";
import { STATUS_CONFIG, SubmissionStatus, ViewMode } from "./config";
import { SubmissionModeToggle } from "./SubmissionModeToggle";
import { SubmissionForm } from "./SubmissionForm";
import { SubmissionView } from "./SubmissionViewer";
import { cn } from "@/lib/utils";
import { Badge as UIBadge } from "../ui/badge";
import { FireworksBackground } from "../animate-ui/components/backgrounds/fireworks";
import Image from "next/image";

export const BadgeModal = ({
  badge,
  onClose,
  status,
}: {
  badge: Badge;
  onClose: () => void;
  status: SubmissionStatus;
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>("form");
  useEffect(() => {
    if (status === "noSubmission") {
      setViewMode("form");
    } else {
      setViewMode("history");
    }
  }, [status]);

  const showModeToggle = status === "rejected";
  const isAccpted = status === "accepted";

  const config = STATUS_CONFIG[status];
  const StatusIcon = config.icon || Trophy;

  const [showFirework, setShowFirework] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFirework(false); // 5 秒後關閉
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      >
        {isAccpted && showFirework && (
          <FireworksBackground fireworkSpeed={10} particleSpeed={7} />
        )}
      </div>

      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-white dark:bg-black rounded-3xl shadow-xl overflow-hidden animate-in zoom-in-90 fade-in duration-300 border border-gray-200 dark:border-gray-800">
        {/* Header */}
        <div className="h-32 relative shrink-0 flex items-center px-8 border-b">
          <StatusIcon
            size={130}
            className="absolute -right-3 -bottom-7 text-white/20 rotate-12"
          />

          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 rounded-2xl bg-white/50 dark:bg-black/30 backdrop-blur-sm border border-white/20 shadow-sm">
              {badge.file ? (
                <Image
                  src={badge.file}
                  alt="badge image"
                  width={36}
                  height={36}
                />
              ) : (
                <StatusIcon className="text-slate-400" size={36} />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {badge.name}
              </h2>
              <span className="text-gray-700 dark:text-gray-100/70 text-xs opacity-90">
                Collection • {badge.collectionName}
              </span>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/30 text-white backdrop-blur-sm transition"
        >
          <X size={18} />
        </button>

        {/* Body */}
        <div className="p-8 space-y-8 overflow-y-auto">
          {/* Description */}
          <section>
            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Challenge Description
            </h4>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {badge.description}
            </p>
          </section>

          <div
            className="animate-in fade-in slide-in-from-bottom-2 duration-300"
            key={viewMode}
          >
            {showModeToggle && (
              <SubmissionModeToggle mode={viewMode} onChange={setViewMode} />
            )}

            {viewMode === "form" && (
              <SubmissionForm badge={badge} onClose={onClose} />
            )}
            {viewMode === "history" && <SubmissionView badge={badge} />}
          </div>
        </div>
      </div>
    </div>
  );
};

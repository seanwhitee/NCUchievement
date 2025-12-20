import { Badge } from "@/lib/domain/entity/badge";
import { Submission } from "@/lib/domain/entity/submission";
import { CheckCircle, XCircle, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Badge as UIBadge } from "../ui/badge";
// import { useSubmissionApi } from "@/hooks/api/useSubmissionApi";
import { useReviewApi } from "@/hooks/api/useReviewApi";

interface Props {
  selectedSubmission: Submission | undefined;
  badges: Badge[];
}

export const ReviewCard = ({ selectedSubmission, badges }: Props) => {
  const [badge, setBadge] = useState<Badge>();
  const {
    query: { randomSubmissions },
    mutation: { review, mutateRandomSubmissions },
    loading: { getRandomLoading, reviewLoading },
  } = useReviewApi();

  const [fileUrl, setFileUrl] = useState<string>("");

  useEffect(() => {
    if (selectedSubmission) {
      const badge = badges?.find(
        (b) => b.badgeId === selectedSubmission?.badgeId
      );
      setBadge(badge);
      setFileUrl(selectedSubmission.file);
    }
  }, [selectedSubmission]);

  const [isApproved, setIsapproved] = useState<boolean>(true);
  const fileExtension = fileUrl?.split(".").pop()?.toLowerCase();

  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
  const videoExtensions = ["mp4", "webm", "ogg"];
  const handleSubmit = async (id: string, isApproved: boolean) => {
    await review({ id, isApproved });
    mutateRandomSubmissions();
  };

  return (
    <div className="flex-1 overflow-y-auto p-8">
      {selectedSubmission && badge ? (
        <div className="max-w-3xl mx-auto">
          {/* badge & submission information */}
          <div className="bg-white dark:bg-black p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 mb-6">
            <div className="border-b">
              <h2 className="flex items-center gap-2 font-bold text-gray-800 dark:text-gray-100 text-2xl uppercase tracking-wider font-semibold">
                {badge.name}
              </h2>
              <div className="flex items-center justify-between mb-2 mt-1">
                <span className="text-gray-700 dark:text-gray-100/70 text-xs opacity-90">
                  Collection • {badge.collectionName}
                </span>
                <UIBadge variant="secondary">
                  Reviewer: {selectedSubmission.reviewer}
                </UIBadge>
              </div>
            </div>
            <section className="grid gap-2">
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-4 ">
                Challenge Description
              </h4>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {badge.description}
              </p>
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-4 mb-2">
                Submission description
              </h4>
              <Card className="w-full min-h-32 dark:bg-secondary/60">
                <CardContent>{selectedSubmission.description}</CardContent>
              </Card>
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-4 mb-2">
                File
              </h4>
              {imageExtensions.includes(fileExtension!) && (
                <img src={fileUrl} alt="S3 media" className="w-full min-h-32" />
              )}
              {videoExtensions.includes(fileExtension!) && (
                <video src={fileUrl} controls className="w-full min-h-32">
                  video not support in your browser
                </video>
              )}
            </section>
          </div>

          {/* review card */}
          <div className="bg-white dark:bg-black p-6 rounded-xl shadow-sm dark:border-gray-800 border border-gray-200">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 dark:text-gray-200">
              <CheckCircle size={20} className="text-blue-600 " />
              review
            </h3>

            <form>
              <div className="mb-6">
                <div className="flex gap-4">
                  <label
                    className={`flex-1 p-3 rounded-lg border cursor-pointer flex items-center justify-center gap-2 transition-all
                      ${
                        isApproved
                          ? "bg-green-50 border-green-500 text-green-700 ring-1 ring-green-500 dark:text-green-400 dark:bg-green-900/20 dark:border-green-500"
                          : "border-gray-200 hover:bg-gray-50 dark:text-white dark:hover:bg-slate-800/50"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      value="approve"
                      className="hidden"
                      checked={isApproved}
                      onChange={() => setIsapproved(true)}
                    />
                    <CheckCircle size={18} />
                    Approve
                  </label>

                  <label
                    className={`flex-1 p-3 rounded-lg border cursor-pointer flex items-center justify-center gap-2 transition-all
                      ${
                        !isApproved
                          ? "bg-red-50 border-red-500 text-red-700 ring-1 ring-red-500 dark:text-red-400 dark:bg-red-900/15 dark:border-red-500"
                          : "border-gray-200 hover:bg-gray-50 dark:text-white dark:hover:bg-slate-800/50"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      value="reject"
                      className="hidden"
                      checked={!isApproved}
                      onChange={() => setIsapproved(false)}
                    />
                    <XCircle size={18} />
                    Reject
                  </label>
                </div>
              </div>

              {/* submit button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  onClick={() =>
                    handleSubmit(selectedSubmission.submissionId, isApproved)
                  }
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-800/70 dark:hover:bg-blue-500/50 font-semibold rounded-lg shadow-sm transition-all active:scale-95"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* no submission selected */
        <div className="h-full flex flex-col items-center justify-center text-slate-400">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-full shadow-sm mb-4">
            <ChevronRight size={48} className="text-slate-300 ml-1" />
          </div>
          <p className="text-lg font-medium">
            Please select one submission on the left to start review
          </p>
        </div>
      )}
    </div>
  );
};

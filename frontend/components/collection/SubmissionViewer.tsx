import { Badge } from "@/lib/domain/entity/badge";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useEffect, useState } from "react";
import { submissionRepo } from "@/lib/domain/repository/submission";
import { Card, CardContent } from "../ui/card";
import { Badge as UIBadge } from "../ui/badge";
export const SubmissionView = ({ badge }: { badge: Badge }) => {
  const [submitDescription, setSubmitDescription] = useState<string>();
  const [fileUrl, setFileUrl] = useState<string>("");
  const [reviwerCount, setReviewCount] = useState<number>();
  useEffect(() => {
    const init = async () => {
      try {
        const data = await submissionRepo.getSubmission(badge.submissionId);
        setSubmitDescription(data.description);
        setFileUrl(data.file);
        setReviewCount(data.reviewer);
      } catch (err) {
        console.error("Failed to fetch badges:", err);
      }
    };
    init();
  }, []);

  const fileExtension = fileUrl.split(".").pop()?.toLowerCase();
  if (!fileExtension) return null;
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
  const videoExtensions = ["mp4", "webm", "ogg"];

  return (
    <div>
      <section className="grid gap-2">
        <UIBadge variant="secondary" className="mb-2">
          Reviewer: {reviwerCount}{" "}
        </UIBadge>
        <Label
          htmlFor="message"
          className="text-sm font-semld text-gray-500 dark:text-gray-400 uppercase ibotracking-wider "
        >
          Submission
        </Label>
        <Card className="w-full min-h-32 dark:bg-secondary/60">
          <CardContent>{submitDescription}</CardContent>
        </Card>
        <Label
          htmlFor="message"
          className="text-sm font-semld text-gray-500 dark:text-gray-400 uppercase ibotracking-wider mt-2 "
        >
          File
        </Label>
        {imageExtensions.includes(fileExtension) && (
          <img
            src={fileUrl}
            alt="S3 media"
            className="w-full min-h-32 object-contain"
          />
        )}
        {videoExtensions.includes(fileExtension) && (
          <video src={fileUrl} controls className="w-full min-h-32">
            video not support in your browser
          </video>
        )}
      </section>
    </div>
  );
};

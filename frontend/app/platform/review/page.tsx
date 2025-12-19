"use client";

import { toast } from "@/components/AppToast";
import { SubmissionList } from "@/components/review/SubmissionList";
import { Submission } from "@/lib/domain/entity/submission";
import { submissionRepo } from "@/lib/domain/repository/submission";
import { selectBadges } from "@/redux/badge/badgeSlice";
import { useAppSelector } from "@/redux/hooks/useAppSelector";
import {
  CheckCircle,
  ChevronRight,
  Clock,
  FileText,
  XCircle,
} from "lucide-react";
import { SetStateAction, useEffect, useState } from "react";
import { Badge as UIBadge } from "../../../components/ui/badge";
import { Badge } from "@/lib/domain/entity/badge";
import { Label } from "@radix-ui/react-label";
import { Card, CardContent } from "@/components/ui/card";
import { useSubmissionApi } from "@/hooks/api/useSubmissionApi";
import { Button } from "@/components/ui/button";
import { ReviewCard } from "@/components/review/ReviewCard";

const ReviewPage = () => {
  const badges = useAppSelector(selectBadges);
  const {
    query: { randomSubmissions },
    mutation: { review, mutateRandomSubmissions },
    loading: { getRandomLoading, reviewLoading },
  } = useSubmissionApi();

  const [selectedId, setSelectedId] = useState<string>("");
  const selectedSubmission = randomSubmissions?.find(
    (s) => s.submissionId === selectedId
  );
  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  if (!randomSubmissions || randomSubmissions.length === 0) {
    return (
      <div>
        No more pending submissions
        <Button onClick={() => mutateRandomSubmissions()}>Try again</Button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-black text-slate-800">
      <SubmissionList
        key="submission-list"
        submissions={randomSubmissions}
        selectedId={selectedId}
        handleSelect={handleSelect}
      />
      <ReviewCard selectedSubmission={selectedSubmission} badges={badges} />
    </div>
  );
};

export default ReviewPage;

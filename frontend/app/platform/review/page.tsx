"use client";

import { SubmissionList } from "@/components/review/SubmissionList";
import { selectBadges } from "@/redux/badge/badgeSlice";
import { useAppSelector } from "@/redux/hooks/useAppSelector";
import { Button } from "@/components/ui/button";
import { ReviewCard } from "@/components/review/ReviewCard";
import { useReviewApi } from "@/hooks/api/useReviewApi";
import { useState } from "react";
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import { Loading } from "@/components/review/Loading";

const ReviewPage = () => {
  const badges = useAppSelector(selectBadges);
  const {
    query: { randomSubmissions },
    mutation: { review, mutateRandomSubmissions },
    loading: { getRandomLoading, reviewLoading },
  } = useReviewApi();

  const [selectedId, setSelectedId] = useState<string>("");
  const selectedSubmission = randomSubmissions?.find(
    (s) => s.submissionId === selectedId
  );
  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  if (getRandomLoading) {
    return <Loading />;
  }

  if (!randomSubmissions || randomSubmissions.length === 0) {
    // console.log(randomSubmissions)
    return (
      <div className="flex items-center">
        No more pending submissions
        <Button className="ml-5" onClick={() => mutateRandomSubmissions()}>
          Try again
        </Button>
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

"use client";

import { BadgeCard } from "@/components/collection/BadgeCard";
import { BadgeModal } from "@/components/collection/BadgeModal";
import { SubmissionStatus } from "@/components/collection/config";
import { Badge } from "@/lib/domain/entity/badge";
import { badgeRepo } from "@/lib/domain/repository/badge";
import { VariantProps } from "class-variance-authority";
import { BadgeSwissFranc, CheckCircle, FolderOpen, Trophy } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Badge as UIBadge } from "../../../components/ui/badge";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/hooks/useAppSelector";
import { stat } from "fs";
import { selectBadges } from "@/redux/badge/badgeSlice";

const CollectionPage = () => {
  const [error, setError] = useState<string | null>(null);
  const badges = useAppSelector(selectBadges);

  const groupedBadges = useMemo(() => {
    return badges.reduce((groups, badge) => {
      const category = badge.collectionName || "Others";

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(badge);
      return groups;
    }, {} as Record<string, Badge[]>);
  }, [badges]);

  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const handleOpenModal = (badge: Badge) => {
    setSelectedBadge(badge);
  };

  const handleCloseModal = () => {
    setSelectedBadge(null);
  };

  const convertSubmissionStatus = (status: number): SubmissionStatus => {
    switch (status) {
      case 0:
        return "noSubmission";
      case 1:
        return "underReview";
      case 2:
        return "accepted";
      case 3:
        return "rejected";
      default:
        return "noSubmission";
    }
  };

  const countRemainingChallenges = (badges: Badge[]): number => {
    let total = 0;
    badges.forEach((badge) => {
      if (badge.submissionStatus == 0 || badge.submissionStatus == 3) {
        total += 1;
      }
    });
    return total;
  };

  if (error)
    return <div className="p-10 text-center text-red-500">{error}</div>;
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="mb-8 border-l-4 border-blue-500 pl-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          Collections
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          There are still {countRemainingChallenges(badges)} challenges to go
        </p>
      </div>

      {Object.entries(groupedBadges).map(([category, badges]) => (
        <div key={category} className="mb-12">
          {/* Category titles */}
          <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              {category}
            </h3>
            <UIBadge className="font-bold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 h-6 min-w-6 rounded-full px-1 tabular-nums ml-2">
              {badges.length}
            </UIBadge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map((badge) => (
              <BadgeCard
                key={badge.badgeId}
                badge={badge}
                handleSubmit={handleOpenModal}
                status={
                  convertSubmissionStatus(badge.submissionStatus) ??
                  "noSubmission"
                }
              />
            ))}
          </div>
        </div>
      ))}
      {selectedBadge && (
        <BadgeModal
          badge={selectedBadge}
          onClose={handleCloseModal}
          status={
            convertSubmissionStatus(selectedBadge.submissionStatus) ??
            "noSubmission"
          }
        />
      )}
    </div>
  );
};

export default CollectionPage;

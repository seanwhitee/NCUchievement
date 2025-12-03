import { Button } from "../ui/button";
import { Submission } from "../../lib/domain/entity/submission";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SubmissionCard from "../SubmissionCard";

const SubmissionsDialog = ({
  submissions,
  isOpen,
  onClose,
  onReview,
}: {
  submissions: Submission[];
  isOpen?: boolean;
  onClose: () => void;
  onReview: (id: string, isApproved: boolean) => void;
}) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent
        className="space-y-4 min-w-4/5 max-h-5/6 overflow-auto"
        showCloseButton={false}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Submissions</DialogTitle>
        </DialogHeader>
        {submissions.map((s, index) => (
          <SubmissionCard
            key={s.submissionId}
            title={`#${index + 1}`}
            {...s}
            onReview={onReview}
          />
        ))}
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubmissionsDialog;

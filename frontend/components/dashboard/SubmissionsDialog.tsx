import { Button } from "../ui/button";
import { Submission } from "../../lib/domain/entity/submission";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import SubmissionCard from "../SubmissionCard";

const SubmissionsDialog = ({
  submissions,
  isOpen,
  onClose,
}: {
  submissions: Submission[];
  isOpen?: boolean;
  onClose: () => void;
}) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent
        className="space-y-4"
        showCloseButton={false}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Submissions</DialogTitle>
        </DialogHeader>
        {submissions.map((s, index) => (
          <SubmissionCard key={s.submissionId} title={`#${index + 1}`} {...s} />
        ))}
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubmissionsDialog;

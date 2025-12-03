import { Submission } from "@/lib/domain/entity/submission";
import { Card, CardHeader, CardTitle } from "./ui/card";

export type SubmissionCardProps = Submission & {
  title: string;
};
const SubmissionCard = ({
  title,
  description,
  file,
  reviewer,
}: SubmissionCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
    </Card>
  );
};

export default SubmissionCard;

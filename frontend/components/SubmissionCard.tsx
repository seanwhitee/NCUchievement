import { Submission } from "@/lib/domain/entity/submission";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Form } from "./ui/form";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { SelectField } from "./react-hook-form/SelectField";

const schema = z.object({
  approved: z.boolean(),
});

export type SubmissionCardProps = Submission & {
  title: string;
  onReview: (id: string, isApproved: boolean) => void;
};

const CardItem = ({
  label,
  children,
  className,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        [className],
        "flex flex-col gap-3 shadow-sm p-3 rounded-lg"
      )}
    >
      <Label className="font-semibold">{label}</Label>
      {children}
    </div>
  );
};

const SubmissionCard = ({
  submissionId,
  title,
  description,
  file,
  reviewer,
  onReview,
}: SubmissionCardProps) => {
  const form = useForm({
    defaultValues: { approved: false },
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-sm">
        <CardItem label="Review Count">
          <p>{reviewer}</p>
        </CardItem>
        <CardItem label="Description">
          <p>{description}</p>
        </CardItem>

        <CardItem label="File to review">
          <a
            className="underline"
            href={file}
            target="_blank"
            rel="noopener noreferrer"
          >
            {file}
          </a>
        </CardItem>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(({ approved }) =>
              onReview(submissionId, approved)
            )}
          >
            <CardItem
              label="Approval"
              className="border border-blue-400 shadow-lg"
            >
              <div className="flex flex-col gap-2">
                <SelectField
                  control={form.control}
                  name="approved"
                  options={[
                    { label: "Reject", value: "reject" },
                    { label: "Approve", value: "approve" },
                  ]}
                  transform={{
                    input: (value: boolean | undefined) =>
                      value === true ? "approve" : "reject",
                    output: (value) => (value === "approve" ? true : false),
                  }}
                />
                <CardAction className="self-end">
                  <Button
                    type="submit"
                    className="bg-neutral-100 hover:bg-neutral-100/50 text-black"
                  >
                    Submit
                  </Button>
                </CardAction>
              </div>
            </CardItem>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SubmissionCard;

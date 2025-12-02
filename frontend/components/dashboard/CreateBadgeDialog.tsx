"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { InputField } from "../react-hook-form/InputField";
import Selector from "../Selector";
import { Label } from "../ui/label";
import { TextareaField } from "../react-hook-form/TextareaField";

const schema = z.object({
  collectionName: z.string().min(1),
  name: z.string().min(1),
  file: z.string().min(1, { message: "No file chosen" }), // base64
  description: z.string().min(10),
  type: z.array(z.string()).min(1), // (submission file types)
});
export type FormValues = z.infer<typeof schema>;

const CreateBadgeDialog = ({
  defaultValues,
  isOpen,
  onCreate,
  onCancel,
}: {
  defaultValues: FormValues;
  isOpen?: boolean;
  onCreate: (values: FormValues) => void;
  onCancel: () => void;
}) => {
  const form = useForm({
    defaultValues,
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  return (
    <Dialog open={isOpen}>
      <DialogContent
        className="space-y-4"
        showCloseButton={false}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Create Badge</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onCreate)}
            className="flex flex-col gap-4"
          >
            <InputField control={form.control} name="name" label="Badge Name" />
            <InputField
              control={form.control}
              name="collectionName"
              label="Collection"
            />
            <TextareaField
              control={form.control}
              name="description"
              label="Description"
            />
            <InputField
              control={form.control}
              name="file"
              label="Image"
              type="file"
              accept="image/png, image/jpeg"
            />
            <Controller
              control={form.control}
              name="type"
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <Label>Submission file type</Label>
                  <Selector
                    isMultiple
                    options={[
                      { label: "PNG", value: "image/png" },
                      { label: "JPEG", value: "image/jpeg" },
                    ]}
                    value={field.value ?? []}
                    onChange={field.onChange}
                  />
                </div>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                className="bg-white hover:bg-white/50 text-black"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!form.formState.isValid}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBadgeDialog;

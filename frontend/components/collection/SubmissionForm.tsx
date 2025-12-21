import { toast } from "@/components/AppToast";
import { useBadgeApi } from "@/hooks/api/useBadgeApi";
import { Badge } from "@/lib/domain/entity/badge";
import { useRef, useState } from "react";
import { FileUpload } from "../ui/file-upload";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

export const SubmissionForm = ({
  badge,
  onClose,
}: {
  badge: Badge;
  onClose: () => void;
}) => {
  const [submitDescription, setSubmitDescription] = useState("");
  const expectedType = badge.type.map((type) => type.replace("/*", ""));

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };
  const [fileBase64, setFileBase64] = useState<string>();

  const {
    mutation: { submit, mutateBadges },
    loading: { submitLoading },
  } = useBadgeApi();

  const isValidType = useRef(false);
  function checkIsValidFileType(file: File) {
    isValidType.current = badge.type.some((t) =>
      file.type.startsWith(t.replace("/*", "/"))
    );
  }

  const handleFileUpload = async (selectedFile: File) => {
    try {
      const base64Result = await convertFileToBase64(selectedFile);
      setFileBase64(base64Result);
      checkIsValidFileType(selectedFile);
      if (!isValidType.current)
        toast({
          title: "File type incorrect",
          type: "warning",
        });
    } catch (error) {
      console.error("Base64 conversion failed:", error);
    }
  };

  const handleSubmit = async () => {
    if (!fileBase64 || !submitDescription) {
      // alert("Please provide both a description and a file.");
      toast({
        title: "Please provide both a description and a file.",
        type: "warning",
      });
      return;
    }
    try {
      await submit({
        badgeId: badge.badgeId,
        description: submitDescription,
        fileBase64,
      });
      mutateBadges();
      alert("Submission success!");
      onClose();
    } catch (error) {
      console.error("Submission error:", error);
      // alert("Failed to submit. Please try again.");
      toast({
        title: "Failed to submit. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div>
      {/* Textarea */}
      <section className="grid gap-2">
        <Label
          htmlFor="message"
          className="text-sm font-semld text-gray-500 dark:text-gray-400 uppercase ibotracking-wider "
        >
          Submission
        </Label>
        <Textarea
          placeholder="Type something about your submission..."
          id="message"
          className="rounded-xl h-32 overflow-y-auto resize-none mt-1"
          value={submitDescription}
          onChange={(e) => setSubmitDescription(e.target.value)}
        />
      </section>

      {/* Upload */}
      <section>
        <Label
          htmlFor="message"
          className="text-sm font-semld text-gray-500 dark:text-gray-400 uppercase ibotracking-wider mt-4"
        >
          File Type :{" "}
          {expectedType.map((type, index) => (
            <span key={index}>{type}</span>
          ))}
        </Label>
        <div className="w-full max-w-4xl h-48 mt-4 overflow-y-auto mx-auto border border-dashed rounded-xl border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-zinc-800/40 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
          <FileUpload onChange={handleFileUpload} />
        </div>
      </section>

      {/* Footer Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={onClose}
          className="px-5 py-2.5 rounded-xl font-medium text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          Cancel
        </button>

        <button
          className="px-6 py-2.5 rounded-xl font-semibold bg-gray-800 text-white hover:bg-gray-700 dark:bg-white dark:text-black dark:hover:bg-gray-200 shadow-md shadow-blue-500/30 transition active:scale-95"
          onClick={handleSubmit}
          disabled={submitLoading || !isValidType}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

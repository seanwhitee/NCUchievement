import { ControllerRenderProps, FieldValues, Path } from "react-hook-form";
import { BaseFieldProps } from "./form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

export function InputField<T extends FieldValues, V = string>({
  control,
  name,
  label,
  description,
  placeholder,
  className,
  disabled,
  accept,
  type = "text",
}: BaseFieldProps<T> & React.ComponentProps<"input">) {
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<T, Path<T> & (string | undefined)>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // This includes "data:image/png;base64," prefix
      // If your teammate wants just the base64 part:
      // const base64 = base64String.split(',')[1];
      field.onChange(base64String);
    };
    reader.readAsDataURL(file);
  };
  return (
    <FormField
      control={control}
      name={name}
      disabled={disabled}
      render={({ field }) => (
        <FormItem className={cn(className)}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input
              placeholder={placeholder}
              type={type}
              accept={accept}
              {...field}
              onChange={(event) => {
                if (type === "file") {
                  handleFileChange(event, field);
                } else {
                  field.onChange(event.target.value);
                }
              }}
              value={type === "file" ? undefined : field.value}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

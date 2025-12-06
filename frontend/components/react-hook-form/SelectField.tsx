import { FieldValues } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { BaseFieldProps } from "./form";

export function SelectField<T extends FieldValues, V = string>({
  control,
  name,
  label,
  description,
  placeholder,
  options,
  transform,
}: BaseFieldProps<T> & {
  options: { value: string; label: string }[];
  transform?: {
    input: (value?: V) => string;
    output: (value: string) => V;
  };
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <Select
            onValueChange={(value) => {
              const transformed = transform ? transform.output(value) : value;
              field.onChange(transformed);
            }}
            value={transform ? transform.input(field.value) : field.value}
          >
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

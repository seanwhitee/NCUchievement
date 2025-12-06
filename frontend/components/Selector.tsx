import { useMemo } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export type SelectorItem = {
  label: string;
  value: string;
};

type ExtendItem = SelectorItem & {
  className?: string;
};

const SelectorItem = ({
  label,
  value,
  className,
  onClick,
}: SelectorItem & { onClick: (value: string) => void; className?: string }) => {
  return (
    <Button
      type="button"
      className={cn(
        "flex items-center justify-start bg-neutral-100 text-black hover:bg-neutral-100/50 border-2 border-neutral-200",
        [className]
      )}
      onClick={() => onClick(value)}
    >
      {label}
    </Button>
  );
};

const Selector = ({
  options,
  value = [],
  isMultiple,
  onChange,
}: {
  options: SelectorItem[];
  value?: string[];
  isMultiple?: boolean;
  onChange?: (values: string[]) => void;
}) => {
  const handleSelect = (val: string) => {
    const alreadySelected = value.includes(val);
    if (!isMultiple) {
      const newValue = alreadySelected ? [] : [val];
      onChange?.(newValue);
    } else {
      const newValue = alreadySelected
        ? value.filter((v) => v !== val)
        : [...value, val];
      onChange?.(newValue);
    }
  };

  const extendItems: ExtendItem[] = useMemo(
    () =>
      options.map((o) => ({
        ...o,
        className: value?.includes(o.value)
          ? "border-blue-400"
          : "border-neutral-200",
      })),
    [options, value]
  );

  return (
    <div className="flex flex-col gap-2">
      {extendItems.map((o) => (
        <SelectorItem
          key={o.value}
          label={o.label}
          value={o.value}
          className={o.className}
          onClick={handleSelect}
        />
      ))}
    </div>
  );
};

export default Selector;

import { useId, type ComponentProps } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type TextareaFieldProps = ComponentProps<typeof Textarea> & {
  label: string;
  hint?: string;
  error?: string;
};

// A labelled multi-line text box, with its validation message (or hint) underneath
export function TextareaField({ label, hint, error, className, ...props }: TextareaFieldProps) {
  const id = useId();
  const message = error ?? hint;
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? `${id}-hint` : undefined}
        className="bg-card px-3"
        {...props}
      />
      {message && (
        <p id={`${id}-hint`} className={cn("text-xs", error ? "text-destructive" : "text-muted-foreground")}>
          {message}
        </p>
      )}
    </div>
  );
}

export type SelectOption = { value: string; label: string };

type SelectFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  hideLabel?: boolean;
};

// A labelled dropdown. Values are strings: the Select does not allow "" as a value.
export function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  className,
  hideLabel,
}: SelectFieldProps) {
  const id = useId();
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={id} className={cn(hideLabel && "sr-only")}>
        {label}
      </Label>
      <Select value={value || undefined} onValueChange={onChange}>
        <SelectTrigger id={id} className="h-10! w-full bg-card px-3">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

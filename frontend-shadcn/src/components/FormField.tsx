import { useId, type ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FormFieldProps = ComponentProps<typeof Input> & {
  label: string;
  error?: string;
  hint?: string;
};

// A labelled text input with its validation message underneath
function FormField({ label, error, hint, className, ...inputProps }: FormFieldProps) {
  const id = useId();
  const messageId = `${id}-message`;
  const message = error ?? hint;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
        className="h-10 bg-card px-3"
        {...inputProps}
      />
      {message && (
        <p
          id={messageId}
          className={cn(
            "text-xs",
            error ? "text-destructive" : "text-muted-foreground",
          )}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default FormField;

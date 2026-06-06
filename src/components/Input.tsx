import { useId, type InputHTMLAttributes, type Ref } from "react";
import { cn } from "@/lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  ref?: Ref<HTMLInputElement>;
  error?: string;
};

export function Input({
  ref,
  className,
  type = "text",
  error,
  ...props
}: InputProps) {
  const errorId = useId();
  return (
    <div className="w-full">
      <input
        ref={ref}
        type={type}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "h-10 w-full border-0 border-b bg-transparent px-0",
          "placeholder:text-typo-muted",
          "transition-colors focus:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error
            ? "border-state-error"
            : "border-base-300 focus:border-typo-primary",
          className,
        )}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-state-error mt-1.5 text-sm">
          {error}
        </p>
      )}
    </div>
  );
}

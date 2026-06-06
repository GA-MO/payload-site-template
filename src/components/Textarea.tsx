import type { Ref, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  ref?: Ref<HTMLTextAreaElement>;
};

export function Textarea({
  ref,
  className,
  rows = 4,
  ...props
}: TextareaProps) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(
        "block w-full resize-none border-0 border-b border-base-300 bg-transparent px-0 py-2.5",
        "placeholder:text-typo-muted",
        "transition-colors focus:border-typo-primary focus:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

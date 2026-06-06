import type { Ref, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { Caret } from "@/components/icons/Caret";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  placeholder?: string;
  ref?: Ref<HTMLSelectElement>;
};

export function Select({
  ref,
  className,
  children,
  placeholder,
  defaultValue,
  ...props
}: SelectProps) {
  const hasPlaceholder = placeholder !== undefined;
  const resolvedDefault =
    defaultValue ?? (hasPlaceholder ? "" : undefined);

  return (
    <div className="relative w-full">
      <select
        ref={ref}
        defaultValue={resolvedDefault}
        className={cn(
          "h-10 w-full appearance-none border-0 border-b border-base-300 bg-transparent px-0 pr-6",
          "transition-colors focus:border-typo-primary focus:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          hasPlaceholder &&
            "[&:has(option[value='']:checked)]:text-typo-muted",
          className,
        )}
        {...props}
      >
        {hasPlaceholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {children}
      </select>
      <Caret className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2" />
    </div>
  );
}

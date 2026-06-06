import type { SVGProps } from "react";
import { cn } from "@/lib/cn";

type IconProps = Omit<SVGProps<SVGSVGElement>, "width" | "height"> & {
  size?: number | string;
};

// Inlined from src/assets/previous.svg with currentColor theming.
export function PreviousArrow({ size = 24, className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
      {...props}
      className={cn("shrink-0", className)}
    >
      <path
        d="M18 12H6"
        stroke="currentColor"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
      <path
        d="M10 7L5 12L10 17"
        stroke="currentColor"
        strokeLinecap="square"
      />
    </svg>
  );
}

// Inlined from src/assets/next.svg with currentColor theming.
export function NextArrow({ size = 24, className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
      {...props}
      className={cn("shrink-0", className)}
    >
      <path
        d="M6 12H18"
        stroke="currentColor"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
      <path
        d="M14 7L19 12L14 17"
        stroke="currentColor"
        strokeLinecap="square"
      />
    </svg>
  );
}

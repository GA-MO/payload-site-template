import type { SVGProps } from "react";
import { cn } from "@/lib/cn";

type IconProps = Omit<SVGProps<SVGSVGElement>, "width" | "height"> & {
  size?: number | string;
};

// Inlined from src/assets/dropdown.svg with currentColor theming.
export function Caret({ size = 6, className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 6 6"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      {...props}
      className={cn("shrink-0", className)}
    >
      <path d="M2.68205 5.34603L5.08204e-05 2.70605e-05H5.34605L2.68205 5.34603Z" />
    </svg>
  );
}

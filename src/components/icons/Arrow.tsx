import type { SVGProps } from "react";
import { cn } from "@/lib/cn";

type ArrowProps = Omit<SVGProps<SVGSVGElement>, "width" | "height"> & {
  size?: number | string;
};

function IconSvg({ size = 24, className, ...props }: ArrowProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
      {...props}
      className={cn("shrink-0", className)}
    />
  );
}

export function ArrowRight(props: ArrowProps) {
  return (
    <IconSvg {...props}>
      <g transform="translate(4.5 6)">
        <path
          d="M0.525667 6H13.1417"
          stroke="currentColor"
          strokeLinecap="square"
          strokeLinejoin="round"
        />
        <path
          d="M8.93634 0.743326L14.193 6L8.93634 11.2567"
          stroke="currentColor"
          strokeLinecap="square"
        />
      </g>
    </IconSvg>
  );
}

export function ArrowLeft(props: ArrowProps) {
  return (
    <IconSvg {...props}>
      <g transform="translate(4.5 6)">
        <path
          d="M14.4107 6H1.79466"
          stroke="currentColor"
          strokeLinecap="square"
          strokeLinejoin="round"
        />
        <path
          d="M6 0.743326L0.743326 6L6 11.2567"
          stroke="currentColor"
          strokeLinecap="square"
        />
      </g>
    </IconSvg>
  );
}

export function ArrowUp(props: ArrowProps) {
  return (
    <IconSvg {...props}>
      <g transform="rotate(-90 12 12) translate(4.5 6)">
        <path
          d="M0.525667 6H13.1417"
          stroke="currentColor"
          strokeLinecap="square"
          strokeLinejoin="round"
        />
        <path
          d="M8.93634 0.743326L14.193 6L8.93634 11.2567"
          stroke="currentColor"
          strokeLinecap="square"
        />
      </g>
    </IconSvg>
  );
}

export function ArrowDown(props: ArrowProps) {
  return (
    <IconSvg {...props}>
      <g transform="rotate(90 12 12) translate(4.5 6)">
        <path
          d="M0.525667 6H13.1417"
          stroke="currentColor"
          strokeLinecap="square"
          strokeLinejoin="round"
        />
        <path
          d="M8.93634 0.743326L14.193 6L8.93634 11.2567"
          stroke="currentColor"
          strokeLinecap="square"
        />
      </g>
    </IconSvg>
  );
}

export function ArrowDiagonal(props: ArrowProps) {
  return (
    <IconSvg {...props}>
      <g transform="translate(-0.33 -2.62)">
        <path
          d="M7.72656 19.2134L16.2118 10.7281"
          stroke="currentColor"
          strokeLinecap="square"
          strokeLinejoin="round"
        />
        <path
          d="M9.84766 10.021H16.9187V17.0921"
          stroke="currentColor"
          strokeLinecap="square"
        />
      </g>
    </IconSvg>
  );
}

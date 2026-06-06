import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  className?: string;
};

export function Breadcrumb({
  items,
  separator = "/",
  className,
}: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("text-sm", className)}
    >
      <ol className="flex items-center gap-2">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li
              key={i}
              className={cn(
                "flex items-center gap-2",
                isLast ? "min-w-0" : "shrink-0",
              )}
            >
              {item.href && !isLast ? (
                <a
                  href={item.href}
                  className="transition-colors hover:text-typo-secondary"
                >
                  {item.label}
                </a>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={cn(
                    isLast ? "truncate text-typo-muted" : "text-typo-primary",
                  )}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span aria-hidden="true" className="text-typo-muted">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

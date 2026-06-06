"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";
import type { ManualSection } from "@/lib/manual";

export function ManualOnThisPage({ headings }: { headings: ManualSection[] }) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const els = headings.map((h) => document.getElementById(h.id)).filter((el): el is HTMLElement => el !== null);
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "0px 0px -75% 0px", threshold: 0 },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length) return null;

  return (
    <nav className="manual-toc">
      <span className="manual-toc__title">On this page</span>
      <ul className="manual-toc__list">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={cn(
                "manual-toc__link",
                h.depth === 3 && "manual-toc__link--sub",
                activeId === h.id && "is-active",
              )}
            >
              {h.heading}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

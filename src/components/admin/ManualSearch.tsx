"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/cn";
import type { ManualSection } from "@/lib/manual";

function makeSnippet(text: string, term: string): string {
  const i = text.toLowerCase().indexOf(term);
  if (i === -1) return "";
  const start = Math.max(0, i - 40);
  const end = Math.min(text.length, i + term.length + 70);
  return `${start > 0 ? "…" : ""}${text.slice(start, end).trim()}${end < text.length ? "…" : ""}`;
}

export function ManualSearch({ sections }: { sections: ManualSection[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (term.length < 2) return [];
    return sections
      .map((s) => {
        const inHeading = s.heading.toLowerCase().includes(term);
        const inText = s.text.toLowerCase().includes(term);
        if (!inHeading && !inText) return null;
        return { section: s, score: inHeading ? 0 : 1, snippet: makeSnippet(s.text, term) };
      })
      .filter((r): r is { section: ManualSection; score: number; snippet: string } => r !== null)
      .sort((a, b) => a.score - b.score)
      .slice(0, 8);
  }, [query, sections]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  function go(section: ManualSection) {
    router.push(`/admin/manual?doc=${section.slug}${section.id ? `#${section.id}` : ""}`);
    setQuery("");
    setOpen(false);
    inputRef.current?.blur();
  }

  function onInputKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
      return;
    }
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[active].section);
    }
  }

  const showResults = open && query.trim().length >= 2;

  return (
    <div className="manual-search" ref={rootRef}>
      <svg className="manual-search__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
        <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <input
        ref={inputRef}
        className="manual-search__input"
        type="text"
        placeholder="Search the manual…"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onInputKey}
      />
      <kbd className="manual-search__kbd">⌘K</kbd>

      {showResults && (
        <div className="manual-search__panel">
          {results.length === 0 ? (
            <p className="manual-search__empty">No results for “{query.trim()}”.</p>
          ) : (
            <ul className="manual-search__list">
              {results.map((r, i) => (
                <li key={`${r.section.slug}-${r.section.id}-${i}`}>
                  <button
                    type="button"
                    className={cn("manual-search__result", i === active && "is-active")}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(r.section)}
                  >
                    <span className="manual-search__crumb">{r.section.docTitle}</span>
                    <span className="manual-search__title">{r.section.heading}</span>
                    {r.snippet && <span className="manual-search__snippet">{r.snippet}</span>}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

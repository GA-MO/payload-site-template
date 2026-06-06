import { promises as fs } from "fs";
import path from "path";

import GithubSlugger from "github-slugger";

// The CMS manual lives as Markdown under docs/cms-manual/ (the authoring source,
// also renders on GitHub). The admin Manual view reads these files at runtime.
// Add a new doc here AND drop the file under docs/cms-manual/<slug>.md.
export type ManualDoc = { slug: string; title: string; group: string };

export const MANUAL_DOCS: ManualDoc[] = [
  { slug: "README", title: "Overview", group: "Getting started" },
  { slug: "00-getting-started", title: "Getting Started", group: "Getting started" },
];

export const MANUAL_GROUPS = ["Getting started"] as const;

// One heading and the prose beneath it — the unit search matches against.
export type ManualSection = {
  slug: string;
  docTitle: string;
  heading: string;
  id: string;
  depth: number;
  text: string;
};

const MANUAL_DIR = path.join(process.cwd(), "docs", "cms-manual");

export function isValidDoc(slug: string): boolean {
  return MANUAL_DOCS.some((doc) => doc.slug === slug);
}

export function readManualDoc(slug: string): Promise<string> {
  const safe = isValidDoc(slug) ? slug : "README";
  return fs.readFile(path.join(MANUAL_DIR, `${safe}.md`), "utf8");
}

export function readManualImage(name: string): Promise<Buffer> {
  return fs.readFile(path.join(MANUAL_DIR, "images", path.basename(name)));
}

function stripMarkdown(line: string): string {
  return line
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`>#|]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Splits a doc into sections at each heading. Ids match rehype-slug (same
// github-slugger, reset per doc) so search results can deep-link to a heading.
function parseSections(slug: string, docTitle: string, md: string): ManualSection[] {
  const slugger = new GithubSlugger();
  const sections: ManualSection[] = [];
  let current: ManualSection | null = null;
  let inFence = false;

  const flush = () => {
    if (current) {
      current.text = current.text.trim();
      sections.push(current);
    }
  };

  for (const line of md.split("\n")) {
    if (line.trim().startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    const heading = inFence ? null : line.match(/^(#{1,6})\s+(.+?)\s*$/);
    if (heading) {
      flush();
      const depth = heading[1].length;
      const text = stripMarkdown(heading[2]);
      current = { slug, docTitle, heading: depth === 1 ? docTitle : text, id: depth === 1 ? "" : slugger.slug(text), depth, text: "" };
    } else if (current) {
      current.text += " " + stripMarkdown(line);
    } else {
      current = { slug, docTitle, heading: docTitle, id: "", depth: 1, text: stripMarkdown(line) };
    }
  }
  flush();
  return sections;
}

export async function buildManualIndex(): Promise<ManualSection[]> {
  const perDoc = await Promise.all(
    MANUAL_DOCS.map(async (doc) => parseSections(doc.slug, doc.title, await readManualDoc(doc.slug))),
  );
  return perDoc.flat();
}

export async function getManualDocHeadings(slug: string): Promise<ManualSection[]> {
  const doc = MANUAL_DOCS.find((d) => d.slug === slug) ?? MANUAL_DOCS[0];
  const sections = parseSections(doc.slug, doc.title, await readManualDoc(doc.slug));
  return sections.filter((s) => s.id && s.depth >= 2 && s.depth <= 3);
}

import type { AdminViewServerProps } from "payload";
import type { PluggableList } from "unified";

import { DefaultTemplate } from "@payloadcms/next/templates";
import { Gutter } from "@payloadcms/ui";
import Link from "next/link";
import Markdown from "react-markdown";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { ManualOnThisPage } from "@/components/admin/ManualOnThisPage";
import { ManualSearch } from "@/components/admin/ManualSearch";
import { cn } from "@/lib/cn";
import { MANUAL_DOCS, MANUAL_GROUPS, buildManualIndex, getManualDocHeadings, isValidDoc, readManualDoc } from "@/lib/manual";

// Rewrite the Markdown's relative links/images to work inside the admin view:
// other docs → ?doc= query, images → the gated manual-assets route.
function transformUrl(url: string): string {
  if (/^(https?:|mailto:|#)/.test(url)) return url;
  if (url.startsWith("images/")) return `/admin/manual-assets/${url.slice("images/".length)}`;
  const md = url.match(/^([\w-]+)\.md$/);
  if (md) return md[1] === "README" ? "/admin/manual" : `/admin/manual?doc=${md[1]}`;
  return url;
}

const rehypePlugins: PluggableList = [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]];

export async function ManualView({ initPageResult, params, searchParams }: AdminViewServerProps) {
  const docParam = typeof searchParams?.doc === "string" ? searchParams.doc : "README";
  const activeSlug = isValidDoc(docParam) ? docParam : "README";

  const [content, index, headings] = await Promise.all([
    readManualDoc(activeSlug),
    buildManualIndex(),
    getManualDocHeadings(activeSlug),
  ]);

  return (
    <DefaultTemplate
      i18n={initPageResult.req.i18n}
      locale={initPageResult.locale}
      params={params}
      payload={initPageResult.req.payload}
      permissions={initPageResult.permissions}
      searchParams={searchParams}
      user={initPageResult.req.user || undefined}
      visibleEntities={initPageResult.visibleEntities}
    >
      <Gutter>
        <div className="manual">
          <header className="manual__topbar">
            <span className="manual__brand">CMS Manual</span>
            <ManualSearch sections={index} />
          </header>

          <div className="manual__layout">
            <aside className="manual__nav">
              {MANUAL_GROUPS.map((group) => (
                <div key={group} className="manual__nav-group">
                  <span className="manual__nav-heading">{group}</span>
                  <ul className="manual__nav-list">
                    {MANUAL_DOCS.filter((doc) => doc.group === group).map((doc) => {
                      const href = doc.slug === "README" ? "/admin/manual" : `/admin/manual?doc=${doc.slug}`;
                      return (
                        <li key={doc.slug}>
                          <Link
                            href={href}
                            className={cn("manual__nav-link", doc.slug === activeSlug && "is-active")}
                          >
                            {doc.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </aside>

            <article className="manual__content">
              <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={rehypePlugins} urlTransform={transformUrl}>
                {content}
              </Markdown>
            </article>

            <aside className="manual__aside">
              <ManualOnThisPage headings={headings} />
            </aside>
          </div>
        </div>
      </Gutter>
    </DefaultTemplate>
  );
}

import path from "path";

import config from "@payload-config";
import { getPayload } from "payload";

import { readManualImage } from "@/lib/manual";

const CONTENT_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

// Serves the manual's screenshots, gated behind admin auth so the manual stays
// private. Source of truth is docs/cms-manual/images — no duplicated copy.
export async function GET(req: Request, { params }: { params: Promise<{ name: string }> }) {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: req.headers });
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { name } = await params;
  const contentType = CONTENT_TYPES[path.extname(name).toLowerCase()];
  if (!contentType) return new Response("Not found", { status: 404 });

  try {
    const file = await readManualImage(name);
    return new Response(new Uint8Array(file), {
      headers: { "Content-Type": contentType, "Cache-Control": "private, max-age=3600" },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

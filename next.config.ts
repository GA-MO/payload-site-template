import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  // Self-contained server bundle for the Docker runtime stage.
  output: "standalone",
  // Uncached data is excluded from the build-time prerender, so pages render at
  // request time and the DB isn't needed during `next build`.
  cacheComponents: true,
  // Force `jose` into the traced node_modules; Payload's auth statically imports
  // it and Turbopack's standalone build otherwise omits it.
  // See https://github.com/vercel/next.js/issues/88844.
  outputFileTracingIncludes: {
    "**": ["./node_modules/jose/**/*"],
  },
};

export default withPayload(nextConfig);

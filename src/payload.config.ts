import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import sharp from "sharp";

import { Media } from "./collections/Media";
import { Users } from "./collections/Users";
import { migrations } from "./migrations";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "",
  admin: {
    user: Users.slug,
    theme: "light",
    components: {
      afterNavLinks: ["@/components/admin/ManualNavLink#ManualNavLink"],
      views: {
        manual: {
          Component: "@/components/admin/ManualView#ManualView",
          path: "/manual",
        },
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Media, Users],
  globals: [],
  upload: {
    limits: { fileSize: 20_000_000 },
    abortOnLimit: true,
    responseOnLimit: "File is larger than the 20MB limit — please upload a smaller file.",
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
    prodMigrations: migrations,
  }),
  sharp,
});

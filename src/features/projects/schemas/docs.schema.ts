import { z } from "zod";

/** GET /projects/:repo/docs (tanpa envelope). 404 = repo tidak punya docs/*.md. */
export const repoDocsSchema = z.object({
    files: z.array(
        z.object({
            path: z.string(),
            blobUrl: z.string(),
            content: z.string(),
        }),
    ),
});
export type RepoDocs = z.infer<typeof repoDocsSchema>;
export type RepoDoc = RepoDocs["files"][number];

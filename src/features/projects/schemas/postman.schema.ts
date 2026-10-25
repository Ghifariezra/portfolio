import { z } from "zod";

const keyValueSchema = z.object({ key: z.string(), value: z.string() });

const requestSchema = z.object({
    kind: z.literal("request"),
    name: z.string(),
    method: z.string(),
    url: z.string(),
    description: z.string().optional(),
    headers: z.array(keyValueSchema),
    body: z.object({ lang: z.string(), code: z.string() }).optional(),
    tests: z.string().optional(),
    prerequest: z.string().optional(),
});
export type PostmanRequest = z.infer<typeof requestSchema>;

export type PostmanFolder = {
    kind: "folder";
    name: string;
    description?: string;
    items: PostmanNode[];
    requestCount: number;
};
export type PostmanNode = PostmanRequest | PostmanFolder;

// Folder bisa berisi folder lagi, jadi skemanya rekursif lewat z.lazy.
const folderSchema: z.ZodType<PostmanFolder> = z.object({
    kind: z.literal("folder"),
    name: z.string(),
    description: z.string().optional(),
    items: z.array(z.lazy(() => nodeSchema)),
    requestCount: z.number(),
});
const nodeSchema: z.ZodType<PostmanNode> = z.union([requestSchema, folderSchema]);

/** GET /projects/:repo/postman (tanpa envelope). 404 = repo tidak punya collection. */
export const postmanSourceSchema = z.object({
    path: z.string(),
    blobUrl: z.string(),
    collection: z.object({
        name: z.string(),
        description: z.string().optional(),
        variables: z.array(keyValueSchema),
        items: z.array(nodeSchema),
        requestCount: z.number(),
    }),
});
export type PostmanSource = z.infer<typeof postmanSourceSchema>;

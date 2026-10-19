import { pageHead } from "@/lib/seo";

/** head() untuk halaman admin: judul biasa + noindex supaya tidak masuk mesin pencari. */
export const adminHead = (title: string) => ({
    meta: [...pageHead(`${title} | Admin`).meta, { name: "robots", content: "noindex, nofollow" }],
});

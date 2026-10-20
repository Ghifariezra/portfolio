import { SITE } from "@/config/site";

/** head() untuk halaman admin: judul biasa + noindex supaya tidak masuk mesin pencari. Tanpa OG/canonical. */
export const adminHead = (title: string) => ({
    meta: [{ title: `${title} | Admin | ${SITE.fullName}` }, { name: "robots", content: "noindex, nofollow" }],
});
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { brutalButtonClass } from "@/components/ui/button-styles";
import { cvDocumentQuery } from "@/features/admin/cv/api/cv-variant-admin-api";
import { downloadCvPdf } from "@/features/cv/lib/download-cv";

type Status = "idle" | "loading" | "error";

/**
 * Unduh PDF dari varian yang sedang dibuka, lewat endpoint admin (/cv-variants/:id/resolved).
 * Berbeda dari tombol publik: datanya termasuk nomor telepon, dan variannya tidak harus yang default.
 */
export function CvAdminDownload({ id }: { id: string }) {
    const queryClient = useQueryClient();
    const [status, setStatus] = useState<Status>("idle");

    async function handleClick() {
        setStatus("loading");
        try {
            // staleTime 0: selalu ambil data tersimpan terbaru, bukan cache.
            const cv = await queryClient.fetchQuery({ ...cvDocumentQuery(id), staleTime: 0 });
            await downloadCvPdf(cv);
            setStatus("idle");
        } catch (error) {
            console.error("[cv] failed to generate from admin", error);
            setStatus("error");
        }
    }

    return (
        <div className="mt-10 max-w-2xl border-t-2 border-border pt-6">
            <button
                type="button"
                onClick={handleClick}
                disabled={status === "loading"}
                className={`${brutalButtonClass("primary")} disabled:cursor-wait disabled:opacity-60`}
            >
                {status === "loading" ? "Generating..." : "Download PDF (with phone)"}
            </button>
            <p className="mt-2 text-xs text-muted-foreground">
                Memakai data tersimpan, jadi simpan dulu perubahan di form di atas. Nomor telepon ikut tercetak.
            </p>
            {status === "error" && (
                <p role="alert" className="mt-2 font-mono text-xs text-destructive">
                    Could not generate the CV. Try again.
                </p>
            )}
        </div>
    );
}
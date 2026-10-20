import { DownloadSimple } from "@phosphor-icons/react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { cvQuery } from "@/features/cv/lib/cv-query";
import { downloadCvPdf } from "@/features/cv/lib/download-cv";

type Status = "idle" | "loading" | "error";

export function DownloadCvButton() {
    const queryClient = useQueryClient();
    const [status, setStatus] = useState<Status>("idle");

    async function handleClick() {
        setStatus("loading");
        try {
            // fetchQuery memakai cache React Query: klik kedua dalam 5 menit tidak menembak API lagi.
            const cv = await queryClient.fetchQuery(cvQuery());
            await downloadCvPdf(cv);
            setStatus("idle");
        } catch (error) {
            console.error("[cv] failed to generate", error);
            setStatus("error");
        }
    }

    return (
        <div className="flex flex-wrap items-center gap-3">
            <button
                type="button"
                onClick={handleClick}
                disabled={status === "loading"}
                className="inline-flex cursor-pointer items-center gap-2 border-2 border-border bg-primary px-4 py-2 font-mono text-xs font-bold text-primary-foreground shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:cursor-wait disabled:opacity-60"
            >
                <DownloadSimple size={16} weight="bold" />
                {status === "loading" ? "Generating..." : "Download CV"}
            </button>
            {status === "error" && (
                <p role="alert" className="font-mono text-xs text-destructive">
                    Could not generate the CV. Try again.
                </p>
            )}
        </div>
    );
}

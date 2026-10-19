import type { ReactNode } from "react";
import { brutalButtonClass } from "@/components/ui/button-styles";
import { ErrorState } from "@/components/ui/error-state";

interface FormFooterProps {
    error: Error | null;
    /** Baris utama sudah tersimpan, tapi langkah berikutnya gagal. */
    partial: boolean;
    pending: boolean;
    submitLabel: string;
    cancel: ReactNode;
}

export function FormFooter({ error, partial, pending, submitLabel, cancel }: FormFooterProps) {
    return (
        <>
            {error && (
                <ErrorState
                    message={
                        partial
                            ? `Data utama sudah tersimpan, tapi langkah berikutnya gagal: ${error.message}. Perbaiki lalu simpan lagi.`
                            : error.message
                    }
                />
            )}
            <div className="flex gap-3">
                <button type="submit" disabled={pending} className={brutalButtonClass("primary")}>
                    {pending ? "Saving..." : submitLabel}
                </button>
                {cancel}
            </div>
        </>
    );
}

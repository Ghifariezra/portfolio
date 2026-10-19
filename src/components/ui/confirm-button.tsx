import { useState } from "react";
import { cn } from "@/lib/utils";

interface ConfirmButtonProps {
    onConfirm: () => void;
    label?: string;
    confirmLabel?: string;
    disabled?: boolean;
}

/** Aksi destruktif dua langkah: klik pertama meminta konfirmasi, klik kedua menjalankan. Kehilangan fokus = batal. */
export function ConfirmButton({ onConfirm, label = "Delete", confirmLabel = "Sure?", disabled }: ConfirmButtonProps) {
    const [armed, setArmed] = useState(false);

    return (
        <button
            type="button"
            disabled={disabled}
            onBlur={() => setArmed(false)}
            onClick={() => {
                if (armed) {
                    setArmed(false);
                    onConfirm();
                } else {
                    setArmed(true);
                }
            }}
            className={cn(
                "cursor-pointer border-2 px-3 py-1 font-mono text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50",
                armed
                    ? "border-destructive bg-destructive text-white"
                    : "border-border hover:border-destructive hover:text-destructive",
            )}
        >
            {armed ? confirmLabel : label}
        </button>
    );
}

import { useRouter } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { brutalButtonClass } from "@/components/ui/button-styles";
import { ErrorState } from "@/components/ui/error-state";
import { FormField } from "@/components/ui/form-field";
import { inputClass } from "@/components/ui/form-styles";
import { ApiError, verifyAdminToken } from "@/lib/api";
import { adminToken } from "@/lib/auth/admin-token";

/** Hanya path di dalam /admin yang boleh jadi tujuan setelah login (cegah open redirect). */
const safeNext = (next?: string) => (next?.startsWith("/admin") ? next : "/admin");

function loginErrorMessage(err: unknown): string {
    if (err instanceof ApiError) {
        if (err.status === 401) return "Token ditolak server. Cek lagi nilai ADMIN_API_TOKEN.";
        return err.message; // 503: "ADMIN_API_TOKEN is not configured" / "Profile has not been seeded yet"
    }
    return "Tidak bisa menghubungi API. Pastikan wrangler dev jalan dan VITE_API_URL benar.";
}

export function LoginPage({ next }: { next?: string }) {
    const router = useRouter();
    const [token, setToken] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    async function onSubmit(e: FormEvent) {
        e.preventDefault();
        const value = token.trim();
        if (!value) return;

        setBusy(true);
        setError(null);
        try {
            await verifyAdminToken(value);
            adminToken.set(value);
            router.history.push(safeNext(next));
        } catch (err) {
            setError(loginErrorMessage(err));
        } finally {
            setBusy(false);
        }
    }

    return (
        <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6">
            <header>
                <h1 className="font-heading text-3xl font-bold">Admin</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Masukkan ADMIN_API_TOKEN dari Worker. Token disimpan di tab ini saja dan hilang saat tab ditutup.
                </p>
            </header>

            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <FormField label="Token" htmlFor="token">
                    <input
                        id="token"
                        type="password"
                        autoComplete="off"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        className={inputClass}
                    />
                </FormField>

                {error && <ErrorState message={error} />}

                <button type="submit" disabled={busy || !token.trim()} className={brutalButtonClass("primary")}>
                    {busy ? "Checking..." : "Sign in"}
                </button>
            </form>
        </main>
    );
}

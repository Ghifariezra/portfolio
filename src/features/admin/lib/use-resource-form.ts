import { useMutation } from "@tanstack/react-query";
import { type FormEvent, useState } from "react";
import { fieldErrors } from "@/lib/api";
import { useRefreshAfterWrite } from "./admin-resource";

export interface SaveContext<F> {
    form: F;
    /** null = belum pernah tersimpan. Berubah setelah POST berhasil lewat onCreated. */
    id: string | null;
    onCreated: (id: string) => void;
}

interface UseResourceFormOptions<F> {
    initial: F;
    /** null = entitas baru. */
    id: string | null;
    save: (ctx: SaveContext<F>) => Promise<unknown>;
    onSaved: () => void;
}

/** State + submit untuk form admin: error per field, dan penanganan "baris utama tersimpan tapi langkah berikutnya gagal". */
export function useResourceForm<F extends object>({ initial, id, save, onSaved }: UseResourceFormOptions<F>) {
    const refresh = useRefreshAfterWrite();
    const mutation = useMutation({ mutationFn: save, onSettled: refresh });

    const [form, setForm] = useState<F>(initial);
    const [savedId, setSavedId] = useState<string | null>(id);

    const set = <K extends keyof F>(key: K, value: F[K]) => setForm((f) => ({ ...f, [key]: value }));

    /** POST berhasil, tapi PUT berikutnya gagal. */
    const partial = id === null && savedId !== null && mutation.isError;

    function submit(e: FormEvent) {
        e.preventDefault();
        mutation.mutate({ form, id: savedId, onCreated: setSavedId }, { onSuccess: onSaved });
    }

    return { form, set, submit, savedId, partial, errors: fieldErrors(mutation.error), mutation };
}

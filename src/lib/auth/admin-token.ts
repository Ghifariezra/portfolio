import { useSyncExternalStore } from "react";

// Token admin SENGAJA tidak lewat VITE_*: variabel VITE_ ikut tertanam di bundle publik.
// Disimpan di sessionStorage (hilang saat tab ditutup) plus memori sebagai cadangan kalau storage diblokir.
const STORAGE_KEY = "portfolio.admin.token";

let memory: string | null = null;
const listeners = new Set<() => void>();
const notify = () => {
    for (const listener of listeners) listener();
};

function readStorage(): string | null {
    try {
        return sessionStorage.getItem(STORAGE_KEY);
    } catch {
        return null;
    }
}

export const adminToken = {
    get: (): string | null => memory ?? readStorage(),

    set(token: string) {
        memory = token;
        try {
            sessionStorage.setItem(STORAGE_KEY, token);
        } catch {
            // storage diblokir: token tetap di memori, hilang saat reload
        }
        notify();
    },

    clear() {
        memory = null;
        try {
            sessionStorage.removeItem(STORAGE_KEY);
        } catch {
            // abaikan
        }
        notify();
    },

    subscribe(listener: () => void) {
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    },
};

/** Re-render komponen saat token berubah (login, logout, atau 401 dari server). */
export const useAdminToken = () => useSyncExternalStore(adminToken.subscribe, adminToken.get, () => null);

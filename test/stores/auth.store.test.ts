import { beforeEach, describe, expect, it } from "vitest";
// Sesuaikan path import dengan struktur foldermu
import type { UpsertUserForm } from "@/lib/schemas/user.schema";
import { useAuthStore } from "@/lib/stores/auth.store";

describe("useAuthStore Specification", () => {
    // Reset global state dan storage sebelum setiap test agar tidak bocor antar-test
    beforeEach(() => {
        // 1. Reset state Zustand kembali ke default
        useAuthStore.setState({
            isAuthenticated: false,
            profile: undefined,
        });

        // 2. Bersihkan mock sessionStorage dari jsdom
        sessionStorage.clear();
    });

    describe("Initial State", () => {
        it("harus memiliki state awal isAuthenticated = false dan profile = undefined", () => {
            const state = useAuthStore.getState();

            expect(state.isAuthenticated).toBe(false);
            expect(state.profile).toBeUndefined();
        });
    });

    describe("Actions", () => {
        it("setIsAuthenticated: harus mengubah status autentikasi", () => {
            // Act
            useAuthStore.getState().setIsAuthenticated(true);

            // Assert
            expect(useAuthStore.getState().isAuthenticated).toBe(true);
        });

        it("setProfile: harus menyimpan data profil user", () => {
            const mockProfile = {
                username: "admin_ezdev",
                email: "admin@ezdev.xyz"
            } as unknown as UpsertUserForm;

            // Act
            useAuthStore.getState().setProfile(mockProfile);

            // Assert
            expect(useAuthStore.getState().profile).toEqual(mockProfile);
        });

        it("logout: harus mengembalikan state ke kondisi awal (false dan undefined)", () => {
            // Arrange: Pura-pura user sedang login
            useAuthStore.setState({
                isAuthenticated: true,
                profile: { username: "admin_ezdev" } as unknown as UpsertUserForm,
            });

            // Act
            useAuthStore.getState().logout();

            // Assert
            const state = useAuthStore.getState();
            expect(state.isAuthenticated).toBe(false);
            expect(state.profile).toBeUndefined();
        });
    });

    describe("Persist Middleware", () => {
        it("harus menyimpan state ke dalam sessionStorage dengan key 'precision-auth-storage'", () => {
            // Act: Ubah state
            useAuthStore.getState().setIsAuthenticated(true);

            // Assert: Cek apakah storage langsung ter-update
            const storedData = sessionStorage.getItem("precision-auth-storage");
            expect(storedData).not.toBeNull();

            // Parsing JSON dari storage untuk memastikan isinya benar
            const parsedData = JSON.parse(storedData as string);
            expect(parsedData.state.isAuthenticated).toBe(true);
        });

        it("harus menghapus data profile di sessionStorage saat logout", () => {
            // Arrange
            useAuthStore.getState().setProfile({ username: "test_user" } as unknown as UpsertUserForm);

            // Act
            useAuthStore.getState().logout();

            // Assert
            const storedData = sessionStorage.getItem("precision-auth-storage");
            const parsedData = JSON.parse(storedData as string);

            expect(parsedData.state.isAuthenticated).toBe(false);
            // profile biasanya tidak ter-serialize atau tersimpan sebagai null/undefined di JSON
            expect(parsedData.state.profile).toBeUndefined();
        });
    });
});
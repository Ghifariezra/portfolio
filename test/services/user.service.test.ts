import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
// Sesuaikan path import dengan struktur foldermu
import { userService, UserService } from "../../src/lib/services/user.service";
import type { LoginForm, UpsertUserForm } from "@/lib/schemas/user.schema";

describe("UserService Specification", () => {
    describe("Singleton Pattern", () => {
        it("harus mengembalikan instance yang sama setiap kali getInstance dipanggil", () => {
            const instance1 = UserService.getInstance();
            const instance2 = UserService.getInstance();

            expect(instance1).toBe(instance2);
        });

        it("variabel yang di-export (userService) harus merujuk ke instance tunggal", () => {
            const instance = UserService.getInstance();
            expect(userService).toBe(instance);
        });
    });

    describe("API Endpoint Invocations", () => {
        let getSpy: any;
        let postSpy: any;
        let putSpy: any;

        beforeEach(() => {
            // Pasang spy untuk masing-masing HTTP method pada apiClient
            getSpy = vi.spyOn(userService["api"], "get");
            postSpy = vi.spyOn(userService["api"], "post");
            putSpy = vi.spyOn(userService["api"], "put");
        });

        afterEach(() => {
            vi.restoreAllMocks();
        });

        describe("getMe", () => {
            it("harus memanggil endpoint '/user/me' dengan method GET", async () => {
                const mockResponse = { success: true, data: { name: "Admin" } };
                getSpy.mockResolvedValue(mockResponse);

                const result = await userService.getMe();

                expect(getSpy).toHaveBeenCalledTimes(1);
                expect(getSpy).toHaveBeenCalledWith("/user/me");
                expect(result).toEqual(mockResponse);
            });
        });

        describe("logout", () => {
            it("harus memanggil endpoint '/user/logout' dengan method POST tanpa payload", async () => {
                const mockResponse = { success: true };
                postSpy.mockResolvedValue(mockResponse);

                const result = await userService.logout();

                expect(postSpy).toHaveBeenCalledTimes(1);
                // Pastikan dipanggil tanpa argumen payload tambahan
                expect(postSpy).toHaveBeenCalledWith("/user/logout");
                expect(result).toEqual(mockResponse);
            });
        });

        describe("login", () => {
            it("harus memanggil endpoint '/user/login' dengan method POST beserta payload login", async () => {
                // Gunakan as any atau as LoginForm jika schema aslimu butuh properti spesifik
                const mockPayload = {
                    username: "admin",
                    password: "securepassword123",
                } as unknown as LoginForm;

                const mockResponse = {
                    success: true,
                    data: { token: "dummy-jwt-token", user: { username: "admin" } }
                };
                postSpy.mockResolvedValue(mockResponse);

                const result = await userService.login(mockPayload);

                expect(postSpy).toHaveBeenCalledTimes(1);
                // Pastikan dipanggil dengan URL dan payload yang benar
                expect(postSpy).toHaveBeenCalledWith("/user/login", mockPayload);
                expect(result).toEqual(mockResponse);
            });
        });

        describe("upsertProfile", () => {
            it("harus memanggil endpoint '/user' dengan method PUT beserta payload profil", async () => {
                const mockPayload = {
                    name: "Admin User",
                    email: "admin@ezdev.xyz",
                } as unknown as UpsertUserForm;

                const mockResponse = { success: true };
                putSpy.mockResolvedValue(mockResponse);

                const result = await userService.upsertProfile(mockPayload);

                expect(putSpy).toHaveBeenCalledTimes(1);
                // Pastikan dipanggil dengan PUT, bukan POST
                expect(putSpy).toHaveBeenCalledWith("/user", mockPayload);
                expect(result).toEqual(mockResponse);
            });

            it("harus meneruskan error (reject) jika proses upsert gagal", async () => {
                const mockPayload = {} as UpsertUserForm;
                const mockError = { success: false, error: "Validation failed" };

                putSpy.mockRejectedValue(mockError);

                await expect(userService.upsertProfile(mockPayload)).rejects.toEqual(mockError);
            });
        });
    });
});
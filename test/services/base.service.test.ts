import { describe, expect, it } from "vitest";
// Sesuaikan path import di bawah dengan lokasi file aslimu
import { BaseService } from "../../src/lib/services/base.service";
import { apiClient } from "@/utils/middleware";

// 1. Arrange: Buat Concrete Class (Kelas Nyata) khusus untuk kebutuhan testing
class DummyService extends BaseService {
    /**
     * Membuat fungsi public semata-mata untuk mengambil 
     * properti 'api' yang bersifat protected dari BaseService
     */
    public getApiInstance() {
        return this.api;
    }
}

describe("BaseService Specification", () => {
    it("harus mewariskan instance apiClient dengan benar ke class turunannya", () => {
        // 2. Act: Inisialisasi class dummy yang kita buat
        const testService = new DummyService();
        const inheritedApi = testService.getApiInstance();

        // 3. Assert: Pastikan api yang diwariskan adalah benar-benar instance apiClient dari middleware
        // Kita menggunakan .toBe() karena kita ingin memastikan referensi memori (object reference)-nya sama persis
        expect(inheritedApi).toBe(apiClient);
    });

    it("instance class turunan harus terdefinisi", () => {
        const testService = new DummyService();
        expect(testService).toBeInstanceOf(BaseService);
    });
});
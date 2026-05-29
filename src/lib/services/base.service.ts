import { apiClient } from "@/utils/middleware";

export abstract class BaseService {
	/**
	 * Menyediakan apiClient ke semua class turunan (protected).
	 * Sehingga class anak cukup memanggil `this.api`
	 */
	protected readonly api = apiClient;

	// Nantinya kamu bisa menambahkan fungsi utility global di sini,
	// seperti format response, global error handling, dll.
}

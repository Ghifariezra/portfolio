// src/lib/services/contact.service.ts
import type { ContactForm } from "@/lib/schemas/contact.schema";
import type { AppResponse } from "@/utils/middleware";
import { BaseService } from "./base.service";

export class ContactService extends BaseService {
	private static instance: ContactService;

	private constructor() {
		super();
	}

	public static getInstance(): ContactService {
		if (!ContactService.instance) {
			ContactService.instance = new ContactService();
		}
		return ContactService.instance;
	}

	/**
	 * Kirim pesan melalui form public portofolio.
	 * Sesuai spesifikasi API: PUT /api/v1/messages
	 */
	public async sendMessage(payload: ContactForm): Promise<AppResponse> {
		// Objek data baru yang sudah di-mapping
		const data = {
			name: payload.name,
			email: payload.email,
			message: payload.message,
			phone_number: payload.phone,
		};

		return this.api.put<
			unknown,
			AppResponse,
			typeof data // TypeScript otomatis mendeteksi struktur objek 'data' di atas
		>("/messages", data);
	}
}

export const contactService = ContactService.getInstance();

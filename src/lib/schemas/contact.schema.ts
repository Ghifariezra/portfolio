import { z } from "zod";
import { sanitizeText } from "@/utils/xss";

export const contactSchema = z.object({
	name: z
		.string()
		.min(2, "Name must be at least 2 characters")
		.transform(sanitizeText),

	email: z.string().email("Invalid email address").transform(sanitizeText),

	phone: z
		.string()
		.optional()
		.transform((val) => (val ? sanitizeText(val) : val)),

	message: z
		.string()
		.min(10, "Message must be at least 10 characters")
		.transform(sanitizeText),
});

export type ContactForm = z.infer<typeof contactSchema>;

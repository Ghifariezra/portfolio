import { z } from "zod";
import { sanitizeText } from "@/utils/xss";

export const loginSchema = z.object({
	// Email tidak perlu di-sanitize karena z.string().email()
	// sudah memiliki validasi ketat, tapi kita pastikan bersih dari tag
	email: z.string().email("Invalid email address").transform(sanitizeText),
	password: z.string().min(1, "Password is required"),
});

export type LoginForm = z.infer<typeof loginSchema>;

export const upsertUserSchema = z.object({
	id: z.string().uuid(),
	username: z
		.string()
		.min(3, "Username must be at least 3 characters")
		.transform(sanitizeText),
	email: z.string().email("Invalid email address").transform(sanitizeText),
	role: z.string().default("user"),
	about_me: z
		.string()
		.optional()
		.transform((val) => (val ? sanitizeText(val) : val)),
	fullname: z
		.string()
		.optional()
		.transform((val) => (val ? sanitizeText(val) : val)),

	// URL tetap divalidasi formatnya, namun kita sanitize tag-nya
	image: z
		.string()
		.url("Invalid URL")
		.optional()
		.or(z.literal(""))
		.transform((val) => (val ? sanitizeText(val) : val)),
	cv_url: z
		.string()
		.url("Invalid URL")
		.optional()
		.or(z.literal(""))
		.transform((val) => (val ? sanitizeText(val) : val)),
	linkedin: z
		.string()
		.url("Invalid URL")
		.optional()
		.or(z.literal(""))
		.transform((val) => (val ? sanitizeText(val) : val)),
	github: z
		.string()
		.url("Invalid URL")
		.optional()
		.or(z.literal(""))
		.transform((val) => (val ? sanitizeText(val) : val)),
});

export type UpsertUserForm = z.infer<typeof upsertUserSchema>;

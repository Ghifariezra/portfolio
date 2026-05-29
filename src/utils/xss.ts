// Lakukan Named Imports agar TypeScript mengenali Class dan Helper-nya
import { FilterXSS, getDefaultWhiteList, safeAttrValue } from "xss";

// ==========================================
// 1. STRICT MODE (Hapus Semua HTML)
// Digunakan untuk input teks biasa (Name, Title, Slug, Role)
// ==========================================
const strictXssFilter = new FilterXSS({
	whiteList: {}, // KOSONG = Tidak ada tag HTML yang diizinkan
	stripIgnoreTag: true, // Hapus tag-nya (misal <b>Halo</b> jadi Halo)
	stripIgnoreTagBody: ["script", "style"], // Hapus isi tag berbahaya
});

// ==========================================
// 2. RICH TEXT MODE (Bolehkan HTML Aman)
// Digunakan untuk konten dari WYSIWYG Editor (Blog/Project Content)
// ==========================================
const richTextXssFilter = new FilterXSS({
	whiteList: {
		...getDefaultWhiteList(),
		// Jika butuh iframe (YouTube), uncomment baris di bawah:
		// iframe: ['src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen']
	},
	stripIgnoreTag: true,
	stripIgnoreTagBody: ["script", "style"],

	// Gunakan Arrow Function dan beri tipe data eksplisit untuk memuaskan Biome & TS
	safeAttrValue: (tag: string, name: string, value: string, cssFilter: any) => {
		if (tag === "a" && name === "href") {
			// Pastikan link hanya diawali http/https/mailto
			if (
				value.startsWith("http://") ||
				value.startsWith("https://") ||
				value.startsWith("mailto:")
			) {
				return value;
			}
			return ""; // Tolak javascript:alert() dan serangan serupa
		}
		// Gunakan helper bawaan untuk tag & atribut lainnya
		return safeAttrValue(tag, name, value, cssFilter);
	},
});

// ==========================================
// EXPORT HELPERS
// ==========================================
export const sanitizeText = (val: string) => strictXssFilter.process(val);
export const sanitizeHtml = (val: string) => richTextXssFilter.process(val);

import { describe, expect, it } from "vitest";
import { sanitizeHtml, sanitizeText } from "../../src/utils/xss";

describe("XSS Utilities Specification", () => {
	// ==========================================================
	// TESTING UNTUK STRICT MODE (sanitizeText)
	// ==========================================================
	describe("sanitizeText (Strict Mode)", () => {
		it("harus menghapus seluruh tag HTML tanpa menyisakan apa pun selain teks biasa", () => {
			const dirtyInput =
				"<b>Halo</b>, ini adalah teks dengan format <i>miring</i>.";
			const expectedOutput = "Halo, ini adalah teks dengan format miring.";

			const result = sanitizeText(dirtyInput);
			expect(result).toBe(expectedOutput);
		});

		it("harus membersihkan tag <script> beserta isi di dalamnya (stripIgnoreTagBody)", () => {
			const dirtyInput = '<script>alert("Hacked!")</script>Teks yang tersisa';

			const result = sanitizeText(dirtyInput);
			expect(result).toBe("Teks yang tersisa");
			expect(result).not.toContain("<script>");
			expect(result).not.toContain("alert");
		});

		it("harus membiarkan teks biasa yang sudah aman tetap utuh", () => {
			const safeInput = "Halo, nama saya Ghifari";

			const result = sanitizeText(safeInput);
			expect(result).toBe(safeInput);
		});
	});

	// ==========================================================
	// TESTING UNTUK RICH TEXT MODE (sanitizeHtml)
	// ==========================================================
	describe("sanitizeHtml (Rich Text Mode)", () => {
		it("harus mengizinkan tag HTML dasar yang aman untuk kebutuhan artikel/blog", () => {
			const richInput =
				"<h1>Judul Konten</h1><p>Ini paragraf dengan teks <strong>tebal</strong>.</p>";

			const result = sanitizeHtml(richInput);
			expect(result).toContain("<h1>Judul Konten</h1>");
			expect(result).toContain("<p>");
			expect(result).toContain("<strong>tebal</strong>");
		});

		it("harus menghapus skrip berbahaya tetapi tetap mempertahankan struktur HTML yang aman", () => {
			const compoundInput =
				'<div><p>Konten artikel aman</p><script>console.log("XSS")</script></div>';

			const result = sanitizeHtml(compoundInput);
			expect(result).toContain("<div><p>Konten artikel aman</p></div>");
			expect(result).not.toContain("<script>");
			expect(result).not.toContain("console.log");
		});

		it("harus mengizinkan atribut href dengan protokol valid (http, https, mailto)", () => {
			const inputHttp = '<a href="http://ezdev.xyz">Website HTTP</a>';
			const inputHttps = '<a href="https://github.com">Website HTTPS</a>';
			const inputMailto = '<a href="mailto:test@example.com">Hubungi Saya</a>';

			expect(sanitizeHtml(inputHttp)).toContain('href="http://ezdev.xyz"');
			expect(sanitizeHtml(inputHttps)).toContain('href="https://github.com"');
			expect(sanitizeHtml(inputMailto)).toContain(
				'href="mailto:test@example.com"'
			);
		});

		it("harus menangkal dan mengosongkan URL skrip berbahaya pada tautan (javascript:)", () => {
			const exploitInput =
				"<a href=\"javascript:alert('malicious')\">Klik Tautan Palsu</a>";

			const result = sanitizeHtml(exploitInput);
			// Sesuai implementasi, href yang tidak valid akan mengembalikan string kosong ("")
			expect(result).toContain("<a href>");
			expect(result).not.toContain("javascript:alert");
		});
	});

	// ==========================================================
	// TESTING UNTUK EDGE CASES
	// ==========================================================
	describe("Edge Cases Handling", () => {
		it("harus mengembalikan string kosong jika input string kosong", () => {
			expect(sanitizeText("")).toBe("");
			expect(sanitizeHtml("")).toBe("");
		});
	});
});

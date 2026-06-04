/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: Wajib untuk render tabel Pandas & Shiki */
/** biome-ignore-all lint/suspicious/noExplicitAny: ... */

import { CaretDown, CaretUp, Spinner } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useTheme } from "next-themes";
import { memo, useEffect, useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { codeToHtml } from "shiki";

// ============================================================================
// 1. KOMPONEN SHIKI HIGHLIGHTER
// ============================================================================
const CodeHighlighter = memo(function CodeHighlighter({
	code,
}: {
	code: string;
}) {
	const { resolvedTheme } = useTheme();
	const [html, setHtml] = useState<string>("");

	useEffect(() => {
		let isMounted = true;
		const theme = resolvedTheme === "dark" ? "github-dark" : "github-light";

		codeToHtml(code, { lang: "python", theme })
			.then((res) => {
				if (isMounted) setHtml(res);
			})
			.catch(console.error);

		return () => {
			isMounted = false;
		};
	}, [code, resolvedTheme]);

	if (!html) {
		return (
			<pre className="p-5 overflow-x-auto text-sm font-mono text-foreground/90 bg-background border-b border-border/50">
				<code>{code}</code>
			</pre>
		);
	}

	return (
		<div
			className="text-sm font-mono border-b border-border/50 [&>pre]:bg-transparent! [&>pre]:p-5 [&>pre]:m-0 [&>pre]:overflow-x-auto"
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	);
});

// ============================================================================
// 2. KONFIGURASI & KOMPONEN MARKDOWN
// ============================================================================
const markdownComponents: Components = {
	h1: ({ node, ...props }) => (
		<h1 className="font-heading text-2xl font-bold mt-4 mb-2" {...props} />
	),
	h2: ({ node, ...props }) => (
		<h2 className="font-heading text-xl font-bold mt-4 mb-2" {...props} />
	),
	h3: ({ node, ...props }) => (
		<h3 className="font-heading text-lg font-bold mt-3 mb-2" {...props} />
	),
	p: ({ node, ...props }) => (
		<p className="font-sans mb-3 leading-relaxed" {...props} />
	),
	a: ({ node, ...props }) => (
		<a
			className="text-primary underline font-bold hover:text-primary/80 transition-colors"
			target="_blank"
			rel="noopener noreferrer"
			{...props}
		/>
	),
	img: ({ node, ...props }) => (
		<img
			className="max-w-full h-auto inline-block my-2"
			{...props}
			alt={props.alt || ""}
		/>
	),
	ul: ({ node, ...props }) => (
		<ul className="list-disc pl-6 mb-3 space-y-1" {...props} />
	),
	ol: ({ node, ...props }) => (
		<ol className="list-decimal pl-6 mb-3 space-y-1" {...props} />
	),
	strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
	code: ({ node, className, children, ...props }) => {
		const isInline = !className;
		return isInline ? (
			<code
				className="bg-muted px-1.5 py-0.5 rounded font-mono text-[11px] font-bold border border-border"
				{...props}
			>
				{children}
			</code>
		) : (
			<code className={className} {...props}>
				{children}
			</code>
		);
	},
};

const ColabMarkdownCell = memo(function ColabMarkdownCell({
	sourceCode,
}: {
	sourceCode: string;
}) {
	return (
		<div className="p-5 text-sm text-foreground border-b-2 border-border last:border-0 bg-muted/20">
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				rehypePlugins={[rehypeRaw]}
				components={markdownComponents}
			>
				{sourceCode}
			</ReactMarkdown>
		</div>
	);
});

// ============================================================================
// 3. KOMPONEN OUTPUT KODE (CHART, TABEL, TEXT)
// ============================================================================
const ColabCodeOutput = memo(function ColabCodeOutput({
	outputs,
	cellIndex,
}: {
	outputs: any[];
	cellIndex: number;
}) {
	if (!outputs || outputs.length === 0) return null;

	return (
		<div className="p-5 overflow-x-auto bg-muted/10 flex flex-col gap-4">
			{outputs.map((out: any, outIdx: number) => {
				const key = `out-${cellIndex}-${outIdx}`;

				if (out.data?.["image/png"]) {
					return (
						<img
							key={key}
							src={`data:image/png;base64,${out.data["image/png"]}`}
							alt={`Output Chart ${outIdx}`}
							className="max-w-full h-auto bg-white p-2 rounded border border-border/50 shadow-sm"
						/>
					);
				}

				if (out.data?.["text/html"]) {
					const htmlContent = Array.isArray(out.data["text/html"])
						? out.data["text/html"].join("")
						: out.data["text/html"];
					return (
						<div
							key={key}
							className="dataframe-container text-sm overflow-x-auto bg-background p-4 rounded border border-border/50 [&_table]:w-full [&_table]:border-collapse [&_table]:text-left [&_th]:px-4 [&_th]:py-2 [&_th]:bg-muted/50 [&_th]:font-bold [&_th]:border-b-2 [&_th]:border-border [&_th]:whitespace-nowrap [&_td]:px-4 [&_td]:py-2 [&_td]:border-b [&_td]:border-border/50 [&_td]:text-foreground/80 [&_td]:whitespace-nowrap [&_tr:hover]:bg-muted/20 [&_tr:last-child_td]:border-0"
							dangerouslySetInnerHTML={{ __html: htmlContent }}
						/>
					);
				}

				if (out.text || out.data?.["text/plain"]) {
					const textContent = out.text
						? Array.isArray(out.text)
							? out.text.join("")
							: out.text
						: Array.isArray(out.data["text/plain"])
							? out.data["text/plain"].join("")
							: out.data["text/plain"];
					return (
						<pre
							key={key}
							className="text-xs font-mono text-foreground/80 whitespace-pre-wrap"
						>
							{textContent}
						</pre>
					);
				}

				return null;
			})}
		</div>
	);
});

// ============================================================================
// 4. KOMPONEN SEL KODE (INPUT + OUTPUT)
// ============================================================================
const ColabCodeCell = memo(function ColabCodeCell({
	sourceCode,
	outputs,
	index,
}: {
	sourceCode: string;
	outputs: any[];
	index: number;
}) {
	return (
		<div className="flex flex-col border-b-2 border-border last:border-0">
			<div className="flex items-center gap-2 bg-muted px-4 py-2 border-b-2 border-border text-[10px] text-muted-foreground font-mono font-bold uppercase tracking-widest">
				<span>[ ]</span>
				<span>Python</span>
			</div>
			{sourceCode.trim() && <CodeHighlighter code={sourceCode} />}
			<ColabCodeOutput outputs={outputs} cellIndex={index} />
		</div>
	);
});

// ============================================================================
// 5. KOMPONEN UTAMA (YANG DI-EXPORT)
// ============================================================================
export const ColabGistEmbed = memo(function ColabGistEmbed({
	url,
}: {
	url: string;
}) {
	const gistId = url.split("/").pop();

	const [isExpanded, setIsExpanded] = useState(false);

	const {
		data: notebook,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["gist-colab", gistId],
		queryFn: async () => {
			if (!gistId) throw new Error("ID Gist tidak valid");
			const response = await axios.get(
				`https://api.github.com/gists/${gistId}`
			);
			const files = response.data.files;
			const file = files[Object.keys(files)[0]];

			if (file.truncated || !file.content) {
				const rawResponse = await axios.get(file.raw_url);
				return typeof rawResponse.data === "string"
					? JSON.parse(rawResponse.data)
					: rawResponse.data;
			}
			return JSON.parse(file.content);
		},
		enabled: !!gistId,
		staleTime: 1000 * 60 * 60,
	});

	if (isLoading) {
		return (
			<div className="w-full h-32 mt-10 flex flex-col items-center justify-center gap-3 border-2 border-border border-dashed rounded-lg bg-muted/30">
				<Spinner
					size={24}
					className="animate-spin text-primary"
					weight="bold"
				/>
				<span className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
					Fetching Notebook...
				</span>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="w-full mt-10 p-4 border-2 border-destructive bg-destructive/10 text-destructive rounded-lg font-mono text-sm">
				<p className="font-bold">Gagal memuat notebook.</p>
				<p className="text-xs mt-1">
					{error?.message || "Cek console untuk detail."}
				</p>
			</div>
		);
	}

	if (!notebook) return null;

	// ID unik untuk melakukan auto-scroll saat di-collapse dari bawah
	const containerId = `notebook-${gistId}`;

	// Fungsi handle saat tombol collapse (Hide Full Notebook) di-klik
	const handleCollapse = () => {
		setIsExpanded(false);
		// Scroll kembali ke atas elemen header Notebook secara smooth
		document
			.getElementById(containerId)
			?.scrollIntoView({ behavior: "smooth", block: "start" });
	};

	return (
		<div
			id={containerId}
			className="w-full mt-12 mb-8 flex flex-col gap-4 animate-in fade-in duration-500 scroll-mt-24"
		>
			{/* Header dengan Tombol Toggle */}
			<div className="flex items-center justify-between border-b-2 border-border pb-2">
				<h3 className="font-heading text-2xl font-bold text-foreground">
					Jupyter Notebook Explorer
				</h3>
				<button
					type="button"
					onClick={() => setIsExpanded(!isExpanded)}
					className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest bg-muted text-muted-foreground hover:text-foreground px-3 py-1.5 rounded border-2 border-transparent hover:border-border transition-colors cursor-pointer"
				>
					{isExpanded ? (
						<>
							Collapse <CaretUp weight="bold" size={14} />
						</>
					) : (
						<>
							Expand <CaretDown weight="bold" size={14} />
						</>
					)}
				</button>
			</div>

			{/* Container Notebook dengan Transisi Tinggi */}
			<div
				className={`relative border-2 border-border rounded-lg bg-card shadow-brutal-sm dark:shadow-none transition-all duration-500 ease-in-out ${
					isExpanded
						? "max-h-none overflow-visible"
						: "max-h-125 overflow-hidden"
				}`}
			>
				{/* Isi Sel Notebook */}
				{notebook?.cells?.map((cell: any, index: number) => {
					const sourceCode = Array.isArray(cell.source)
						? cell.source.join("")
						: cell.source;

					if (
						!sourceCode?.trim() &&
						(!cell.outputs || cell.outputs.length === 0)
					)
						return null;

					if (cell.cell_type === "markdown") {
						return (
							<ColabMarkdownCell
								key={`md-${index}` as string}
								sourceCode={sourceCode}
							/>
						);
					}

					if (cell.cell_type === "code") {
						return (
							<ColabCodeCell
								key={`code-${index}` as string}
								sourceCode={sourceCode}
								outputs={cell.outputs}
								index={index}
							/>
						);
					}

					return null;
				})}

				{/* EFEK FADE GRADASI & TOMBOL "READ FULL" (Hanya muncul saat tertutup) */}
				{!isExpanded && (
					<div className="absolute bottom-0 left-0 right-0 h-40 bg-linear-to-t from-card via-card/90 to-transparent flex items-end justify-center pb-6">
						<button
							type="button"
							onClick={() => setIsExpanded(true)}
							className="flex items-center gap-2 bg-primary text-primary-foreground border-2 border-primary font-mono text-[11px] font-bold uppercase tracking-widest px-6 py-2.5 rounded shadow-brutal-sm hover:-translate-y-1 transition-transform cursor-pointer"
						>
							Read Full Notebook <CaretDown weight="bold" size={16} />
						</button>
					</div>
				)}

				{/* TOMBOL "HIDE FULL NOTEBOOK" DI BAWAH (Hanya muncul saat dibuka penuh) */}
				{isExpanded && (
					<div className="flex justify-center p-6 border-t-2 border-border bg-muted/10">
						<button
							type="button"
							onClick={handleCollapse}
							className="flex items-center gap-2 bg-muted text-foreground border-2 border-border font-mono text-[11px] font-bold uppercase tracking-widest px-6 py-2.5 rounded shadow-sm hover:bg-card hover:-translate-y-1 transition-transform cursor-pointer"
						>
							Hide Full Notebook <CaretUp weight="bold" size={16} />
						</button>
					</div>
				)}
			</div>
		</div>
	);
});

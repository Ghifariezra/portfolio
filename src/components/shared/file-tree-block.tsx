import { createReactBlockSpec } from "@blocknote/react";

import {
	FileItem,
	Files,
	FolderContent,
	FolderItem,
	FolderTrigger,
	SubFiles,
} from "@/components/animate-ui/components/radix/files";

export const FileTreeBlock = createReactBlockSpec(
	{
		type: "fileTree",
		propSchema: {
			language: { default: "file-tree" },
		},
		content: "inline",
	},
	{
		render: (props: any) => {
			const extractText = (content: any): string => {
				if (!content) return "[]";
				if (typeof content === "string") return content;
				if (Array.isArray(content)) {
					return content.map((c) => c.text || "").join("");
				}
				return "[]";
			};

			const textContent = extractText(props.block.content);

			let fileData: any[] = [];
			try {
				fileData = [JSON.parse(textContent)];
				if (Array.isArray(fileData[0])) {
					fileData = fileData[0];
				}
			} catch (e) {
				console.error("Gagal melakukan parse data FileTree:", e);
			}

			const renderNode = (nodes: any[]) => {
				return nodes.map((node, index) => {
					const itemValue = `${node.name}-${index}`;

					if (node.type === "folder") {
						return (
							<FolderItem key={itemValue} value={itemValue}>
								<FolderTrigger
									gitStatus={node.gitStatus}
									className="transition-colors hover:text-primary dark:hover:text-primary"
								>
									{node.name}
								</FolderTrigger>
								<FolderContent>
									<SubFiles>
										{node.children && renderNode(node.children)}
									</SubFiles>
								</FolderContent>
							</FolderItem>
						);
					} else {
						return (
							<FileItem
								key={itemValue}
								gitStatus={node.gitStatus}
								className="transition-colors hover:text-primary dark:hover:text-primary"
							>
								{node.name}
							</FileItem>
						);
					}
				});
			};

			const defaultOpenFolders = fileData
				.filter((f) => f.type === "folder")
				.map((f, i) => `${f.name}-${i}`);

			return (
				<div className="w-full my-6 border-2 dark:border border-border rounded-md shadow-brutal-sm dark:shadow-none bg-card overflow-hidden transition-all">
					<div className="flex items-center px-4 py-2 border-b-2 dark:border-b border-border bg-muted/40 dark:bg-muted/10">
						<span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest select-none">
							Folder Structure
						</span>
					</div>

					<div className="relative w-full bg-background p-4 overflow-x-auto">
						<Files
							className="w-full font-mono text-sm text-foreground/90"
							defaultOpen={defaultOpenFolders}
						>
							{fileData.length > 0 && fileData[0] ? (
								renderNode(fileData)
							) : (
								<div className="text-muted-foreground italic text-sm font-mono p-2">
									Struktur file kosong atau JSON tidak valid.
								</div>
							)}
						</Files>
					</div>
				</div>
			);
		},
	}
);

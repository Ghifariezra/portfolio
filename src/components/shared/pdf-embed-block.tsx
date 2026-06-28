/** biome-ignore-all lint/correctness/useExhaustiveDependencies: ... */
import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import { useEffect, useState } from "react";

// 1. Buat sub-komponen khusus untuk menangani proses Fetch & Blob
function PdfViewer({ url, height }: { url: string; height: string }) {
    const [blobUrl, setBlobUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        // Fetch file PDF secara asinkron
        fetch(url)
            .then((response) => response.blob())
            .then((blob) => {
                if (isMounted) {
                    // Paksa tipe mime-nya menjadi application/pdf
                    const fileBlob = new Blob([blob], { type: "application/pdf" });
                    const objectUrl = URL.createObjectURL(fileBlob);
                    setBlobUrl(objectUrl);
                    setIsLoading(false);
                }
            })
            .catch((error) => {
                console.error("Gagal memuat PDF:", error);
                if (isMounted) setIsLoading(false);
            });

        // Cleanup function agar memori tidak bocor
        return () => {
            isMounted = false;
            if (blobUrl) {
                URL.revokeObjectURL(blobUrl);
            }
        };
    }, [url]);

    if (isLoading) {
        return (
            <div
                className="flex items-center justify-center w-full my-4 border rounded-md bg-muted/20 border-border text-muted-foreground animate-pulse"
                style={{ height }}
            >
                <span className="text-sm font-medium">Memuat PDF...</span>
            </div>
        );
    }

    if (!blobUrl) {
        return (
            <div
                className="flex flex-col items-center justify-center w-full my-4 space-y-2 border rounded-md bg-muted/20 border-border text-muted-foreground"
                style={{ height }}
            >
                <span className="text-sm font-medium">Gagal memuat preview PDF.</span>
                <a href={url} className="text-blue-500 underline text-xs">Unduh manual</a>
            </div>
        );
    }

    return (
        <div
            className="w-full my-4 overflow-hidden border rounded-md border-border bg-muted/20"
            style={{ height }}
        >
            <object
                data={`${blobUrl}#view=FitH`}
                type="application/pdf"
                className="w-full h-full border-none"
            >
                <div className="flex flex-col items-center justify-center w-full h-full p-4 space-y-3 text-muted-foreground">
                    <span className="text-sm font-medium">Browser tidak mendukung preview PDF.</span>
                </div>
            </object>
        </div>
    );
}

// 2. Gunakan sub-komponen tadi di dalam render BlockNote
export const PdfEmbedBlock = createReactBlockSpec(
    {
        type: "pdfEmbed",
        propSchema: {
            textAlignment: defaultProps.textAlignment,
            textColor: defaultProps.textColor,
            url: {
                default: "",
            },
            height: {
                default: "600px", // Saya sedikit tinggikan jadi 600px agar lebih proporsional
            },
        },
        content: "none",
    },
    {
        render: (props) => {
            const { url, height } = props.block.props;

            if (!url) {
                return (
                    <div className="flex items-center justify-center w-full p-4 border-2 border-dashed rounded-md bg-muted text-muted-foreground border-border">
                        <span className="text-sm font-medium">PDF URL not provided</span>
                    </div>
                );
            }

            // Panggil komponen React biasa di sini
            return <PdfViewer url={url} height={height} />;
        },
    }
);
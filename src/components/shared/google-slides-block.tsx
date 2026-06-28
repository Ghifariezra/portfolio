import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";

export const GoogleSlidesBlock = createReactBlockSpec(
    {
        type: "googleSlides",
        propSchema: {
            textAlignment: defaultProps.textAlignment,
            textColor: defaultProps.textColor,
            url: {
                default: "",
            },
        },
        content: "none",
    },
    {
        render: (props) => {
            const { url } = props.block.props;

            if (!url) return null;

            // Trik utama: Ubah URL dari /edit atau /view menjadi /embed
            const embedUrl = url.replace(/\/(edit|view).*$/, "/embed?start=false&loop=false&delayms=3000");

            return (
                <div className="w-full my-6 overflow-hidden border rounded-lg border-border bg-muted/20 shadow-brutal-sm dark:shadow-none">
                    <div className="flex items-center px-4 py-2 border-b-2 dark:border-b border-border bg-muted/30">
                        <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest">
                            Google Slides
                        </span>
                    </div>
                    {/* Gunakan aspect-video (16:9) agar proporsional di semua layar */}
                    <div className="relative w-full aspect-video bg-background">
                        <iframe
                            title="Google Slides"
                            src={embedUrl}
                            className="absolute top-0 left-0 w-full h-full border-none"
                            allowFullScreen
                            loading="lazy"
                        />
                    </div>
                </div>
            );
        },
    }
);
import type { ReactNode } from "react";

export function SectionHeading({ children }: { children: ReactNode }) {
    return <h2 className="mb-3 font-mono text-xs font-semibold text-muted-foreground">{children}</h2>;
}

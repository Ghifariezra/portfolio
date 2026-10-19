interface ErrorStateProps {
    message: string;
    /** Kalau diisi, tombol "Try again" muncul. */
    onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
    return (
        <div className="flex flex-col items-start gap-3 border-2 border-destructive p-5">
            <p className="text-sm">{message}</p>
            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="cursor-pointer border-2 border-border px-3 py-1 font-mono text-xs font-semibold hover:bg-muted"
                >
                    Try again
                </button>
            )}
        </div>
    );
}

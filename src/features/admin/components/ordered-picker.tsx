import { FilterChip } from "@/components/ui/filter-chip";
import { ArrowDown, ArrowUp, X } from "@/components/ui/icons";

export interface PickerOption {
    id: string;
    label: string;
}

interface OrderedPickerProps {
    legend: string;
    hint?: string;
    options: readonly PickerOption[];
    /** Id terpilih. Urutan array = urutan tampil di CV. */
    value: string[];
    onChange: (ids: string[]) => void;
    loading?: boolean;
    error?: string;
}

const ICON_BUTTON =
    "cursor-pointer border-2 border-border p-1 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40";
const TEXT_BUTTON = "cursor-pointer font-mono text-[11px] text-muted-foreground underline hover:text-foreground";

/** Pilih item sekaligus atur urutannya (naik/turun). Dipakai untuk isi varian CV. */
export function OrderedPicker({ legend, hint, options, value, onChange, loading, error }: OrderedPickerProps) {
    const labelOf = new Map(options.map((o) => [o.id, o.label]));
    const available = options.filter((o) => !value.includes(o.id));

    const move = (index: number, delta: -1 | 1) => {
        const target = index + delta;
        if (target < 0 || target >= value.length) return;
        const next = [...value];
        const [item] = next.splice(index, 1);
        next.splice(target, 0, item as string);
        onChange(next);
    };

    return (
        <fieldset className="flex flex-col gap-3 border-2 border-border p-4">
            <legend className="px-1 font-mono text-xs font-semibold">
                {legend} ({value.length})
            </legend>

            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
            {loading && <p className="text-sm text-muted-foreground">Loading...</p>}

            {value.length > 0 && (
                <ol className="flex flex-col gap-1.5">
                    {value.map((id, index) => (
                        <li key={id} className="flex items-center gap-2 border-2 border-border bg-card px-3 py-1.5">
                            <span className="w-5 font-mono text-[11px] text-muted-foreground">{index + 1}</span>
                            <span className="min-w-0 flex-1 truncate text-sm">{labelOf.get(id) ?? id}</span>
                            <button
                                type="button"
                                aria-label="Move up"
                                disabled={index === 0}
                                onClick={() => move(index, -1)}
                                className={ICON_BUTTON}
                            >
                                <ArrowUp size={12} weight="bold" />
                            </button>
                            <button
                                type="button"
                                aria-label="Move down"
                                disabled={index === value.length - 1}
                                onClick={() => move(index, 1)}
                                className={ICON_BUTTON}
                            >
                                <ArrowDown size={12} weight="bold" />
                            </button>
                            <button
                                type="button"
                                aria-label="Remove"
                                onClick={() => onChange(value.filter((v) => v !== id))}
                                className={ICON_BUTTON}
                            >
                                <X size={12} weight="bold" />
                            </button>
                        </li>
                    ))}
                </ol>
            )}

            {available.length > 0 && (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <span className="font-mono text-[11px] text-muted-foreground">Available</span>
                        <button
                            type="button"
                            onClick={() => onChange([...value, ...available.map((o) => o.id)])}
                            className={TEXT_BUTTON}
                        >
                            Add all
                        </button>
                        {value.length > 0 && (
                            <button type="button" onClick={() => onChange([])} className={TEXT_BUTTON}>
                                Clear
                            </button>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {available.map((o) => (
                            <FilterChip key={o.id} active={false} onClick={() => onChange([...value, o.id])}>
                                {o.label}
                            </FilterChip>
                        ))}
                    </div>
                </div>
            )}

            {!loading && options.length === 0 && (
                <p className="text-sm text-muted-foreground">Belum ada data. Tambahkan dulu di halamannya.</p>
            )}
            {error && (
                <p role="alert" className="text-xs text-destructive">
                    {error}
                </p>
            )}
        </fieldset>
    );
}

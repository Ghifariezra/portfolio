import { Position } from "@xyflow/react";
import { memo } from "react";
import {
    DatabaseSchemaNode,
    DatabaseSchemaNodeBody,
    DatabaseSchemaNodeHeader,
    // DatabaseSchemaTableCell,
    DatabaseSchemaTableRow,
} from "@/components/database-schema-node";
import { LabeledHandle } from "@/components/labeled-handle";

export type DatabaseSchemaNodeData = {
    data: {
        label: string;
        schema: { title: string; type: string }[];
    };
};

const DatabaseSchema = memo(({ data }: DatabaseSchemaNodeData) => {
    return (
        <DatabaseSchemaNode className="p-0 bg-card border-2 dark:border border-border shadow-brutal-sm dark:shadow-none min-w-55 max-w-70 rounded-lg overflow-hidden">

            {/* Header */}
            <div className="bg-primary text-primary-foreground p-1 font-heading font-bold text-xs uppercase tracking-wider truncate">
                <DatabaseSchemaNodeHeader>{data.label}</DatabaseSchemaNodeHeader>
            </div>

            <div className="divide-y divide-border/50">
                <DatabaseSchemaNodeBody>
                    {data.schema.map((entry) => (
                        <DatabaseSchemaTableRow
                            key={entry.title}
                            // Menggunakan flex dengan item stretch untuk sinkronisasi tinggi
                            className="flex items-center bg-card hover:bg-muted/30 transition-colors"
                        >
                            {/* KOLOM KIRI (Target): Diberi flex-1 agar mengambil ruang maksimal */}
                            <div className="flex-1 flex items-center min-w-0 pl-2 py-2">
                                <LabeledHandle
                                    // id={entry.title}
                                    title={entry.title}
                                    type="target"
                                    position={Position.Left}
                                    className="relative! transform-none! left-0! top-0! mr-1.5 shrink-0 text-[11px] text-muted-foreground truncate"
                                />
                                {/* <span className="font-mono text-[11px] text-muted-foreground truncate">
                                    {entry.title}
                                </span> */}
                            </div>

                            {/* KOLOM KANAN (Source): Diberi lebar tetap atau min-width agar tidak bergeser */}
                            <div className="shrink-0 flex items-center justify-end pr-2 py-2 gap-1.5 min-w-15">
                                {/* <span className="font-mono text-[11px] ">
                                    {entry.type}
                                </span> */}
                                <LabeledHandle
                                    // id={entry.title}
                                    title={entry.type}
                                    type="source"
                                    position={Position.Right}
                                    className="relative! transform-none! right-0! top-0! text-foreground font-bold truncate"
                                />
                            </div>
                        </DatabaseSchemaTableRow>
                    ))}
                </DatabaseSchemaNodeBody>
            </div>
        </DatabaseSchemaNode>
    );
});

export default DatabaseSchema;
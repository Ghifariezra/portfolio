import { createReactBlockSpec } from "@blocknote/react";
import { ReactFlow, Background, Controls } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import DatabaseSchema from "./database";

const nodeTypes = {
    databaseSchema: DatabaseSchema,
};

export const ReactFlowBlock = createReactBlockSpec(
    {
        type: "reactFlow",
        propSchema: { language: { default: "react-flow" } },
        content: "inline",
    },
    {
        render: (props: any) => {
            const textContent = props.block.content?.[0]?.text || "{}";
            let flowData = { nodes: [], edges: [] };

            try {
                flowData = JSON.parse(textContent);
            } catch (e) {
                console.error("Gagal parse React Flow:", e);
            }

            return (
                <div className="w-full my-6 border-2 dark:border border-border rounded-lg shadow-brutal-sm dark:shadow-none bg-card overflow-hidden">
                    <div className="flex items-center px-4 py-2 border-b-2 dark:border-b border-border bg-muted/30">
                        <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest">
                            ERD Visualization
                        </span>
                    </div>
                    <div className="h-100 w-full bg-background">
                        <ReactFlow
                            key={JSON.stringify(flowData.nodes)}
                            nodes={flowData.nodes}
                            edges={flowData.edges}
                            nodeTypes={nodeTypes}
                            fitView
                            // Tambahkan ini untuk memastikan garis relasi punya style
                            defaultEdgeOptions={{
                                type: 'smoothstep',
                                animated: true,
                                style: { stroke: 'var(--primary)', strokeWidth: 2 },
                            }}
                            proOptions={{ hideAttribution: true }}
                        >
                            <Background />
                            <Controls />
                        </ReactFlow>
                    </div>
                </div>
            );
        }
    }
);
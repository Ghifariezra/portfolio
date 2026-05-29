import dagre from "@dagrejs/dagre";
import {
    Background,
    ControlButton,
    Controls,
    type Edge,
    type Node,
    ReactFlow,
    ReactFlowProvider,
    useNodesInitialized,
    useReactFlow,
} from "@xyflow/react";
import { LayoutGrid, Maximize, Minus, Plus } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import DatabaseSchemaDemo from "./DatabaseSchema";

// ============================================================
// CONSTANTS
// ============================================================
const NODE_WIDTH = 240;
const NODE_HEIGHT_PER_ROW = 32;
const NODE_HEADER_HEIGHT = 44;
const GAP_V = 40;
const GAP_H = 200;

const nodeTypes = { databaseSchema: DatabaseSchemaDemo };

// ============================================================
// PURE LAYOUT HELPERS — defined at module level, never inside render
// ============================================================
function estimateNodeHeight(node: Node): number {
    const len = (node.data as { schema?: unknown[] })?.schema?.length ?? 4;
    return NODE_HEADER_HEIGHT + len * NODE_HEIGHT_PER_ROW + 16;
}

function detectCentralId(edges: Edge[]): string | null {
    const deg: Record<string, number> = {};
    for (const e of edges) deg[e.source] = (deg[e.source] ?? 0) + 1;
    const top = Object.entries(deg).sort((a, b) => b[1] - a[1])[0];
    return top?.[1] >= 2 ? top[0] : null;
}

function buildStarLayout(nodes: Node[], edges: Edge[]): Node[] {
    if (nodes.length === 0) return nodes;

    const centralId = detectCentralId(edges);
    if (!centralId) return buildDagreLayout(nodes, edges);

    const central = nodes.find((n) => n.id === centralId);
    if (!central) return buildDagreLayout(nodes, edges);

    const connectedIds = new Set(
        edges.filter((e) => e.source === centralId).map((e) => e.target),
    );
    const dimNodes = nodes.filter((n) => connectedIds.has(n.id));
    const isolated = nodes.filter(
        (n) => n.id !== centralId && !connectedIds.has(n.id),
    );

    const cw = central.measured?.width ?? NODE_WIDTH;
    const ch = central.measured?.height ?? estimateNodeHeight(central);
    const dimHeights = dimNodes.map(
        (n) => n.measured?.height ?? estimateNodeHeight(n),
    );
    const totalH =
        dimHeights.reduce((a, b) => a + b, 0) +
        GAP_V * Math.max(dimNodes.length - 1, 0);

    const originY = 40;
    const centralX = 40;
    const dimX = centralX + cw + GAP_H;

    const result: Node[] = [
        {
            ...central,
            position: { x: centralX, y: originY + totalH / 2 - ch / 2 },
        },
    ];

    let y = originY;
    for (let i = 0; i < dimNodes.length; i++) {
        result.push({ ...dimNodes[i], position: { x: dimX, y } });
        y += dimHeights[i] + GAP_V;
    }

    let ix = centralX;
    for (const n of isolated) {
        const w = n.measured?.width ?? NODE_WIDTH;
        result.push({
            ...n,
            position: { x: ix, y: originY + totalH + GAP_V * 2 },
        });
        ix += w + GAP_V;
    }

    return result;
}

function buildDagreLayout(nodes: Node[], edges: Edge[]): Node[] {
    if (nodes.length === 0) return nodes;
    const g = new dagre.graphlib.Graph();
    g.setGraph({
        rankdir: "LR",
        nodesep: 60,
        ranksep: 120,
        marginx: 40,
        marginy: 40,
        acyclicer: "greedy",
        ranker: "tight-tree",
    });
    g.setDefaultEdgeLabel(() => ({}));
    for (const n of nodes) {
        g.setNode(n.id, {
            width: n.measured?.width ?? NODE_WIDTH,
            height: n.measured?.height ?? estimateNodeHeight(n),
        });
    }
    for (const e of edges) g.setEdge(e.source, e.target);
    dagre.layout(g);
    return nodes.map((n) => {
        const dn = g.node(n.id);
        const w = n.measured?.width ?? NODE_WIDTH;
        const h = n.measured?.height ?? estimateNodeHeight(n);
        return { ...n, position: { x: dn.x - w / 2, y: dn.y - h / 2 } };
    });
}

function normalizeEdges(edges: Edge[]): Edge[] {
    return edges.map((e) => ({
        ...e,
        type: "smoothstep",
        animated: e.animated ?? false,
        style: { strokeDasharray: "6 3", ...e.style },
    }));
}

// ============================================================
// HOOK: useAutoLayout
// Edges disimpan di ref — tapi update dilakukan via useEffect,
// bukan langsung di render body (fix react-hooks/refs violation)
// ============================================================
function useAutoLayout(edges: Edge[]) {
    const { fitView, setNodes, getNodes } = useReactFlow();
    const nodesInitialized = useNodesInitialized();

    // Update ref hanya dari dalam effect — tidak saat render
    const edgesRef = useRef<Edge[]>(edges);
    useEffect(() => {
        edgesRef.current = edges;
    }, [edges]);

    // Flag supaya second-pass layout hanya run sekali
    const hasLayouted = useRef(false);

    const runLayout = useCallback(() => {
        setNodes((cur) => buildStarLayout(cur, edgesRef.current));
        setTimeout(() => fitView({ duration: 450, padding: 0.12 }), 60);
    }, [fitView, setNodes]);

    // Second-pass: jalankan setelah node terukur di DOM
    useEffect(() => {
        if (!nodesInitialized || hasLayouted.current) return;
        const measured = getNodes().some((n) => n.measured?.width);
        if (!measured) return;
        hasLayouted.current = true;
        runLayout();
    }, [nodesInitialized, getNodes, runLayout]);

    return { runLayout };
}

// ============================================================
// INNER COMPONENT
// ============================================================
interface ReactFlowERDProps {
    data: { nodes: Node[]; edges: Edge[] };
}

// Initial layout dihitung di luar component — tidak trigger lint,
// tidak re-run saat re-render
function createInitialData(data: ReactFlowERDProps["data"]) {
    return {
        nodes: buildStarLayout(data.nodes ?? [], data.edges ?? []),
        edges: normalizeEdges(data.edges ?? []),
    };
}

function ERDInner({ data }: ReactFlowERDProps) {
    const { zoomIn, zoomOut, fitView } = useReactFlow();

    // Ref untuk initial data — hanya dibaca sekali saat mount
    const initialRef = useRef(createInitialData(data));

    const { runLayout } = useAutoLayout(data.edges ?? []);

    return (
        <ReactFlow
            // eslint-disable-next-line react-hooks/refs
            defaultNodes={initialRef.current.nodes}
            // eslint-disable-next-line react-hooks/refs
            defaultEdges={initialRef.current.edges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.12 }}
            className="bg-card"
            proOptions={{ hideAttribution: true }}
        >
            <Background gap={16} size={1} />
            <Controls
                className="flex flex-col gap-1 bg-background/80 backdrop-blur-sm p-1 border border-border shadow-xl rounded-md"
                showZoom={false}
                showFitView={false}
                showInteractive={false}
            >
                <ControlButton
                    onClick={() => zoomIn({ duration: 300 })}
                    title="Zoom in"
                    className="bg-transparent border-none hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                    <Plus size={14} />
                </ControlButton>
                <ControlButton
                    onClick={() => zoomOut({ duration: 300 })}
                    title="Zoom out"
                    className="bg-transparent border-none hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                    <Minus size={14} />
                </ControlButton>
                <ControlButton
                    onClick={() => fitView({ duration: 300, padding: 0.12 })}
                    title="Fit view"
                    className="bg-transparent border-none hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                    <Maximize size={14} />
                </ControlButton>

                <div className="w-full h-px bg-border/50 my-0.5" />

                <ControlButton
                    onClick={runLayout}
                    title="Auto layout"
                    className="bg-transparent border-none hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                    <LayoutGrid size={14} />
                </ControlButton>
            </Controls>
        </ReactFlow>
    );
}

// ============================================================
// EXPORT
// ============================================================
export function ReactFlowERD({ data }: ReactFlowERDProps) {
    return (
        <ReactFlowProvider>
            <ERDInner data={data} />
        </ReactFlowProvider>
    );
}
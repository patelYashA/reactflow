import React, { useCallback, useEffect, useRef } from "react";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Connection,
  addEdge,
  NodeChange,
  applyNodeChanges,
} from "react-flow-renderer";
import CustomNode from "./CustomNode";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { updateNodePosition, selectNode, addEdges } from "../store/graphSlice";

const nodeTypes = { customNode: CustomNode };

const GraphContainer: React.FC = () => {
  const initialNodes = useSelector(
    (state: RootState) => state.graph.present.nodes
  );
  const initialEdges = useSelector(
    (state: RootState) => state.graph.present.edges
  );
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const dispatch = useDispatch();
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Debounced function for updating node position
  const debouncedUpdateNodePosition = useCallback(
    (id: string, position: { x: number; y: number }) => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = setTimeout(() => {
        dispatch(updateNodePosition({ id, position }));
      }, 300);
    },
    [dispatch]
  );

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const onConnect = useCallback(
    (connection: Connection) => {
      const edge = {
        ...connection,
        animated: true,
        id: `${edges.length + 1}`,
        // type: "customEdge",
      };

      setEdges((prevEdges) => addEdge(edge, prevEdges));
      dispatch(
        addEdges({
          edge: edge,
        })
      );
    },
    [setEdges, dispatch, edges.length]
  );

  const onNodesChanges = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds));

      changes.forEach((change) => {
        if (
          change.type === "position" &&
          change.dragging === true &&
          change.position
        ) {
          debouncedUpdateNodePosition(change.id, change.position);
        }

        if (change.type === "select" && change.selected === true) {
          dispatch(selectNode({ selectedNodeId: change.id }));
        }
      });
    },
    [setNodes, dispatch, debouncedUpdateNodePosition]
  );

  return (
    <div style={{ width: "80%", height: "95vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        onNodesChange={onNodesChanges}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default GraphContainer;

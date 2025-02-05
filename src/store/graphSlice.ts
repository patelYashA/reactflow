import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Node, Edge } from "react-flow-renderer";

interface NodeEdgeState {
  nodes: Node[];
  edges: Edge[];
}

interface GraphState {
  past: NodeEdgeState[];
  present: NodeEdgeState;
  future: NodeEdgeState[];
  selectedNodeId: string | null;
}

const initialNodes: Node[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `node-${i + 1}`,
  type: "customNode",
  position: { x: i * 60, y: i * 50 },
  data: { label: `Node ${i + 1}`, color: "#FFFFFF", fontSize: 14 },
}));

const initialState: GraphState = {
  past: [],
  present: {
    nodes: initialNodes,
    edges: [],
  },
  future: [],
  selectedNodeId: null,
};

const saveState = (state: GraphState) => {
  state.past.push({
    nodes: JSON.parse(JSON.stringify(state.present.nodes)), 
    edges: JSON.parse(JSON.stringify(state.present.edges))
  });
  state.future = []; // Clear redo history on new actions
};

const graphSlice = createSlice({
  name: "graph",
  initialState,
  reducers: {
    // Update Node Position
    updateNodePosition: (
      state,
      action: PayloadAction<{ id: string; position: { x: number; y: number } }>
    ) => {
      saveState(state);
      const node = state.present.nodes.find((n) => n.id === action.payload.id);
      if (node) {
        node.position = action.payload.position;
      }
    },

    // Select Node
    selectNode: (state, action: PayloadAction<{ selectedNodeId: string }>) => {
      state.selectedNodeId = action.payload.selectedNodeId;
    },

    // Update Node Color
    updateColor: (state, action: PayloadAction<{ id: string; color: string }>) => {
      saveState(state);
      const node = state.present.nodes.find((n) => n.id === action.payload.id);
      if (node) {
        node.data.color = action.payload.color;
      }
    },

    // Update Font Size
    updateFontsize: (state, action: PayloadAction<{ id: string; fontSize: number }>) => {
      saveState(state);
      const node = state.present.nodes.find((n) => n.id === action.payload.id);
      if (node) {
        node.data.fontSize = action.payload.fontSize;
      }
    },

    // Add Edge
    addEdges: (state, action: PayloadAction<{ edge: Edge }>) => {
      saveState(state);
      state.present.edges.push(action.payload.edge);
    },

    // Undo Action
    undo: (state) => {
      if (state.past.length > 0) {
        const prevState = state.past.pop()!;
        state.future.unshift({ ...state.present });
        state.present = prevState;
      }
    },

    // Redo Action
    redo: (state) => {
      if (state.future.length > 0) {
        const nextState = state.future.shift()!;
        state.past.push({ ...state.present });
        state.present = nextState;
      }
    },
  },
});

export const {
  updateNodePosition,
  selectNode,
  updateColor,
  updateFontsize,
  addEdges,
  undo,
  redo,
} = graphSlice.actions;

export default graphSlice.reducer;
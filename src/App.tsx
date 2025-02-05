import React from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import GraphContainer from "./components/GraphContainer";
import NodeCustomizationPanel from "./components/NodeCustomizationPanel";
import UndoRedoControls from "./components/UndoRedoControls";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div style={{ display: "flex" }}>
        <GraphContainer />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-evenly" }}>
          <NodeCustomizationPanel />
          <UndoRedoControls />
        </div>
      </div>
    </Provider>
  );
};

export default App;

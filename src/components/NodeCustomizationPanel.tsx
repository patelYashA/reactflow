import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { SketchPicker } from "react-color";
import { updateColor, updateFontsize } from "../store/graphSlice";

const NodeCustomizationPanel: React.FC = () => {
  const dispatch = useDispatch();
  const selectedNodeId = useSelector(
    (state: RootState) => state.graph.selectedNodeId
  );
  const nodes = useSelector((state: RootState) => state.graph.present.nodes);
  const node = nodes.find((n) => n.id === selectedNodeId);

  const [color, setColor] = useState<string>("#3498db");
  const [fontSize, setFontSize] = useState<number | string>(0);
  
  const handleColorChange = (c: string) => {
    setColor(c);
    if (c && selectedNodeId) {
      dispatch(updateColor({ id: selectedNodeId, color: c }));
    }
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      e.target.value.trim() === "" ? NaN : parseFloat(e.target.value);

    setFontSize(isNaN(value) ? "" : value);

    if (!isNaN(value) && selectedNodeId) {
      dispatch(updateFontsize({ id: selectedNodeId, fontSize: value }));
    }
  };

  useEffect(() => {
    if (node) {
      setColor(node.data.color || "#3498db");
      setFontSize(node.data.fontSize || 16);
    }
  }, [node]);

  return (
    <div style={{ padding: "10px" }}>
      {/* style={{ padding: "10px", background: "#4A4A4A", width: "200px" }}> */}
      <h3>Node Customization</h3>
      <label>Color:</label>
      <SketchPicker color={color} onChange={(c) => handleColorChange(c.hex)} />

      <label>Font Size:</label>
      <input
        type="number"
        value={fontSize}
        onChange={(e) => handleFontSizeChange(e)}
      />
    </div>
  );
};

export default NodeCustomizationPanel;

import React, { useEffect } from "react";
import { Handle, NodeProps, Position } from "react-flow-renderer";

const CustomNode: React.FC<NodeProps> = ({ data }) => {
  useEffect(() => {
    
  }, [data.color, data.fontSize]);

  return (
    <div
      style={{
        padding: "10px",
        borderRadius: "8px",
        backgroundColor: data.color,
        color: "black",
        textAlign: "center",
        fontSize: +data.fontSize || 16,
        border: "2px solid #2980b9",
        minWidth: "90px",
      }}
    >
      {data.label}
      {/* Input Handle (Edge Connection) */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#fff" }}
      />

      {/* Output Handle (Edge Connection) */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: "#fff" }}
      />
    </div>
  );
};

export default CustomNode;

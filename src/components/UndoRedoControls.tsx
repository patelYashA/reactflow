import React from "react";
import { useDispatch } from "react-redux";
import { undo, redo } from "../store/graphSlice";

const UndoRedoControls: React.FC = () => {
  const dispatch = useDispatch();

  return (
    <div>
      <button onClick={() => dispatch(undo())}>Undo</button>
      <button onClick={() => dispatch(redo())}>Redo</button>
    </div>
  );
};

export default UndoRedoControls;

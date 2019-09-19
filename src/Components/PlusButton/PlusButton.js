import React from "react";
import "./PlusButton.scss";

const PlusButton = props => {
  return (
    <div
      className={
        "plus-button " + props.className + (props.open ? " close" : "")
      }
    >
      <span className="line" style={{ backgroundColor: props.color }} />
      <span className="line" style={{ backgroundColor: props.color }} />
    </div>
  );
};

export default PlusButton;

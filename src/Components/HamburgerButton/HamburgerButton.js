import React from "react";
import "./HamburgerButton.scss";

const HamburgerButton = props => {
  return (
    <div
      className={
        "hamburger-button " +
        props.className +
        (props.open ? " close" : "")
      }
      onClick={props.action}
    >
      <span className="line" style={{ backgroundColor: props.color }} />
      <span className="line" style={{ backgroundColor: props.color }} />
      <span className="line" style={{ backgroundColor: props.color }} />
    </div>
  );
};

export default React.memo(HamburgerButton);

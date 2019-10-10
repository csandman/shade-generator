import React, { useContext } from "react";
import SplitViewContext from "../../../Contexts/SplitViewContext";

const HeaderIcon = ({ getRandomColors, colorData }) => {
  const { splitView, splitViewDisabled } = useContext(SplitViewContext);

  return (
    <div className="icon" onClick={getRandomColors} role="button" tabIndex={0}>
      <div
        style={{
          backgroundColor:
            splitView && !splitViewDisabled
              ? "#7a7a7a"
              : colorData.shades[10].hex
        }}
        className="icon-dot"
      />
      <div
        style={{
          backgroundColor:
            splitView && !splitViewDisabled ? "#000" : colorData.shades[24].hex
        }}
        className="icon-dot"
      />
      <div
        style={{
          backgroundColor:
            splitView && !splitViewDisabled ? "#000" : colorData.shades[24].hex
        }}
        className="icon-dot"
      />
      <div
        style={{
          backgroundColor:
            splitView && !splitViewDisabled
              ? "#7a7a7a"
              : colorData.shades[10].hex
        }}
        className="icon-dot"
      />
    </div>
  );
};

export default HeaderIcon;

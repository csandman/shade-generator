import React from "react";

const HeaderIcon = ({
  getRandomColors,
  splitViewDisabled,
  splitView,
  colorData
}) => {
  return (
    <div className="icon" onClick={getRandomColors}>
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

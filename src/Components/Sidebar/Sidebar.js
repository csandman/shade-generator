import React from "react";
import "./Sidebar.scss";

const Sidebar = props => {
  return (
    <div id="sidebar" className={props.isOpen ? "" : "hidden"}>
      <div className="sidebar-content">
        <div className="menu-items">
          {props.menuItems.map((item, i) => {
            return (
              <div
                key={item.id}
                className="menu-item"
                style={{ backgroundColor: item.hexCode }}
                onClick={props.clickColor}
                data-index={i}
              >
                <div
                  className="color-name"
                  style={{ color: item.contrastColor }}
                  data-index={i}
                >
                  {item.colorName}
                </div>
                <div
                  className="color-name"
                  style={{ color: item.contrastColor }}
                  data-index={i}
                >
                  {item.hexCode}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="background" onClick={props.closeSidebar} />
    </div>
  );
};

export default Sidebar;

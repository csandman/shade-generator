import React, { Component } from "react";
import "./Sidebar.scss";

export default class Sidebar extends Component {
  render() {
    return (
      <div id="sidebar" className={this.props.isOpen ? "" : "hidden"}>
        <div className="sidebar-content">
          <div className="menu-items">
            {this.props.menuItems.map((item, i) => {
              return (
                <div
                  key={item.id}
                  className="menu-item"
                  style={{ backgroundColor: item.hexCode }}
                  onClick={this.props.clickColor}
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
        <div className="background" onClick={this.props.closeSidebar} />
      </div>
    );
  }
}

// <Menu
//           customCrossIcon={false}
//           customBurgerIcon={false}
//           right
//           menuClassName={"my-class"}
//           isOpen={this.state.menuIsOpen}
//         >
//           {this.state.menuItems.map((item, i) => {
//             return (
//               <div
//                 key={item.id}
//                 className="menu-item"
//                 style={{ backgroundColor: item.hexCode }}
//                 onClick={this.clickColor}
//                 data-index={i}
//               >
//                 <div
//                   className="color-name"
//                   style={{ color: item.contrastColor }}
//                   data-index={i}
//                 >
//                   {item.colorName}
//                 </div>
//                 <div
//                   className="color-name"
//                   style={{ color: item.contrastColor }}
//                   data-index={i}
//                 >
//                   {item.hexCode}
//                 </div>
//               </div>
//             );
//           })}
//         </Menu>

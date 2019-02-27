import React, { Component } from "react";
import _ from "lodash";
import namedColors from "color-name-list";
import "./Sidebar.scss";

import { getContrastColor, hexToRgb } from "../../Functions";

class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.openColorHistory = this.openColorHistory.bind(this);
    this.openColorSearch = this.openColorSearch.bind(this);
    this.closeSubMenu = this.closeSubMenu.bind(this);
    this.searchColorNames = this.searchColorNames.bind(this);

    this.state = {
      searchInput: "",

      colorNameList: [],

      menuStates: {
        isMainMenuOpen: true,
        isHistoryMenuOpen: false,
        isSearchMenuOpen: false
      }
    };
  }

  componentDidMount() {
    this.setState({
      colorNameList: namedColors.slice(0, 500).map(el => {
        el.contrast = getContrastColor(hexToRgb(el.hex));
        return el;
      })
    });
  }

  searchColorNames(e) {
    this.setState({
      searchInput: e.target.value,
      colorNameList: namedColors
        .filter(
          el =>
            el.name
              .toLowerCase()
              .replace(/\s/g, "")
              .indexOf(e.target.value.toLowerCase().replace(/\s/g, "")) >= 0
        )
        .slice(0, 500)
        .map(el => {
          el.contrast = getContrastColor(hexToRgb(el.hex));
          return el;
        })
    });
  }

  openColorHistory() {
    let newState = _.mapValues(this.state.menuStates, () => false);
    newState.isHistoryMenuOpen = true;
    this.setState({ menuStates: newState });
  }

  openColorSearch() {
    let newState = _.mapValues(this.state.menuStates, () => false);
    newState.isSearchMenuOpen = true;
    this.setState({ menuStates: newState });
  }

  closeSubMenu() {
    let newState = _.mapValues(this.state.menuStates, () => false);
    newState.isMainMenuOpen = true;
    this.setState({ menuStates: newState });
  }

  render() {
    return (
      <div id="sidebar" className={this.props.isOpen ? "" : "hidden"}>
        <div className="sidebar-content">
          <div
            className={
              "main-menu-items" +
              (this.state.menuStates.isMainMenuOpen ? "" : " hidden")
            }
          >
            <div className="main-menu-item" onClick={this.openColorHistory}>
              <i className="icon fas fa-history" />
              <span>Color History</span>
            </div>
            <div className="main-menu-item" onClick={this.openColorSearch}>
              <i className="icon fas fa-search" />
              <span>Search Colors</span>
            </div>
          </div>
          <div
            className={
              "sub-menu" +
              (this.state.menuStates.isHistoryMenuOpen ? "" : " hidden")
            }
          >
            <div onClick={this.closeSubMenu} className="sub-menu-header">
              <i className="icon fas fa-arrow-left" />
              <span>Color History</span>
            </div>
            <div className="sub-menu-content">
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
          </div>

          <div
            className={
              "sub-menu" +
              (this.state.menuStates.isSearchMenuOpen ? "" : " hidden")
            }
            id="color-search-menu"
          >
            <div onClick={this.closeSubMenu} className="sub-menu-header">
              <i className="icon fas fa-arrow-left" />
              <span>Search Colors</span>
            </div>
            <div className="search-input-container">
              <i className="icon fas fa-search" />
              <input
                type="search"
                placeholder="Search..."
                value={this.state.searchInput}
                onChange={this.searchColorNames}
              />
            </div>

            <div className="sub-menu-content">
              <div className="menu-items">
                {this.state.colorNameList.map((color, i) => {
                  return (
                    <div
                      key={color + i}
                      className="color-result-item"
                      style={{ background: color.hex, color: color.contrast }}
                      onClick={() => {
                        this.props.handleColorClick(color.hex, 1);
                        this.props.closeSidebar();
                      }}
                    >
                      {color.name}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="background" onClick={this.props.closeSidebar} />
      </div>
    );
  }
}

export default Sidebar;

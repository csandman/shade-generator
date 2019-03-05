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
    this.openTopColorsMenu = this.openTopColorsMenu.bind(this);
    this.closeSubMenu = this.closeSubMenu.bind(this);
    this.searchColorNames = this.searchColorNames.bind(this);

    this.state = {
      searchInput: "",

      colorNameList: [],

      menuStates: {
        isMainMenuOpen: true,
        isHistoryMenuOpen: false,
        isSearchMenuOpen: false,
        isTopColorsMenuOpen: false
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

  openTopColorsMenu() {
    let newState = _.mapValues(this.state.menuStates, () => false);
    newState.isTopColorsMenuOpen = true;
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
          <div className="secondary-main-menu">
              <div
                className="main-menu-item"
                onClick={this.props.getRandomColors}
              >
                <i className="icon fas fa-random" />
                <span>Random Colors</span>
              </div>
              <div
                className="main-menu-item split-view"
                onClick={this.props.toggleSplitView}
              >
                <i className="icon fas fa-columns" />
                <span>Split View</span>
              </div>
            </div>
            <div className="main-menu-item" onClick={this.openColorHistory}>
              <i className="icon fas fa-history" />
              <span>Color History</span>
            </div>
            <div className="main-menu-item" onClick={this.openTopColorsMenu}>
              <i className="icon fas fa-award" />
              <span>Most Popular</span>
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
                      key={item.hex + i}
                      className="menu-item"
                      style={{ backgroundColor: item.hex }}
                      onClick={() => {
                        this.props.handleColorClick(item.hex, 1);
                        this.props.closeSidebar();
                      }}
                      data-hex={item.hex}
                    >
                      <div
                        className="color-name"
                        style={{ color: item.contrast }}
                        data-hex={item.hex}
                      >
                        {item.name}
                      </div>
                      <div
                        className="color-name"
                        style={{ color: item.contrast }}
                        data-hex={item.hex}
                      >
                        {item.hex}
                      </div>
                      <div
                        className="footer-left"
                        style={{ color: item.contrast }}
                      >
                        {item.dateString}
                      </div>
                      <div
                        className="footer-right"
                        style={{ color: item.contrast }}
                      >
                        {item.timeString}
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
              (this.state.menuStates.isTopColorsMenuOpen ? "" : " hidden")
            }
          >
            <div onClick={this.closeSubMenu} className="sub-menu-header">
              <i className="icon fas fa-arrow-left" />
              <span>Most Popular</span>
            </div>
            <div className="sub-menu-content">
              <div className="menu-items">
                {this.props.topColors.map((item, i) => {
                  return (
                    <div
                      key={item.hex + i}
                      className="menu-item"
                      style={{ backgroundColor: item.hex }}
                      onClick={() => {
                        this.props.handleColorClick(item.hex, 1);
                        this.props.closeSidebar();
                      }}
                      data-hex={item.hex}
                    >
                      <div
                        className="color-name"
                        style={{ color: item.contrast }}
                        data-hex={item.hex}
                      >
                        {item.name}
                      </div>
                      <div
                        className="color-name"
                        style={{ color: item.contrast }}
                        data-hex={item.hex}
                      >
                        {item.hex}
                      </div>
                      <div
                        className="footer-left"
                        style={{ color: item.contrast }}
                        data-hex={item.hex}
                      >
                        {item.count} X
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
              <div className="search-icon-container">
                <i className="icon fas fa-search" />
              </div>
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

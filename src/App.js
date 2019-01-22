import React, { Component } from "react";
import { Popup } from "semantic-ui-react";
import { slide as Menu } from "react-burger-menu";
import "./Hamburger.css";
import "./App.css";

import { withFirebase } from "./Firebase";

import {
  calcTextColor,
  getColorName,
  rgbToHex,
  calcAllGradients
} from "./Functions";

const parse = require("parse-color");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "",
      color: [],
      hexColor: "",
      colorArr: [],
      textColor: "white",
      colorName: "",
      loading: false,
      menuItems: [],
      menuIsOpen: false
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEnterPress = this.handleEnterPress.bind(this);
    this.copyHexCode = this.copyHexCode.bind(this);
    this.copyRgb = this.copyRgb.bind(this);
    this.clickColor = this.clickColor.bind(this);
  }

  async componentDidMount() {
    document.addEventListener("keydown", this.handleEnterPress, false);
    this.setState({ loading: true });
    await this.props.firebase
      .colorHistory()
      .orderBy("dateAdded", "desc")
      .limit(1)
      .get()
      .then(snapshot => {
        this.updateStateValues(parse(snapshot.docs[0].data().hexCode).rgb);
      });
    await this.props.firebase
      .colorHistory()
      .orderBy("dateAdded", "desc")
      .limit(100)
      .onSnapshot(querySnapshot => {
        let data = querySnapshot.docs.map(doc => {
          let out = doc.data();
          out.id = doc.id;
          return out;
        });
        this.setState({
          menuItems: data,
          loading: false
        });
        return true;
      });
  }

  clickColor(e) {
    const hex = this.state.menuItems[e.target.dataset.index].hexCode;
    this.setState({
      inputValue: hex,
      menuIsOpen: false
    });
    this.updateStateValues(parse(hex).rgb);
  }

  addMenuItem(hex) {
    const newMenuItem = {
      hexCode: hex,
      colorName: getColorName(hex),
      textColor: calcTextColor(parse(hex).rgb),
      dateAdded: new Date()
    };

    this.props.firebase
      .colorHistory()
      .doc(hex.toUpperCase())
      .set(newMenuItem)
      .catch(function(error) {
        console.error("Error writing document: ", error);
      });
  }

  handleEnterPress(e) {
    if (e.keyCode === 13) {
      this.handleSubmit();
    }
  }

  handleInputChange(event) {
    this.setState({ inputValue: event.target.value });
  }

  handleSubmit() {
    let rgb = parse(this.state.inputValue.toLowerCase()).rgb;
    if (!rgb) rgb = parse("#" + this.state.inputValue.toLowerCase()).rgb;
    if (rgb) {
      this.updateStateValues(rgb);
    }
  }

  updateStateValues(rgb) {
    this.setState({
      color: rgb,
      colorName: getColorName(rgbToHex(...rgb)),
      textColor: calcTextColor(rgb),
      colorArr: calcAllGradients(rgb),
      hexColor: rgbToHex(...rgb),
      inputValue: rgbToHex(...rgb).toUpperCase()
    });
    this.addMenuItem(rgbToHex(...rgb));
  }

  copyHexCode(e) {
    const output = this.state.colorArr[e.target.dataset.index].hex;
    this.copyToClipboard(output);
    this.changeButtonText(e.target, "Copied!");
  }

  copyRgb(e) {
    const rgb = this.state.colorArr[e.target.dataset.index].rgb;
    const output = "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")";
    this.copyToClipboard(output);
    this.changeButtonText(e.target, "Copied!");
  }

  changeButtonText(button, text) {
    const original = button.textContent;
    button.textContent = text;
    setTimeout(() => {
      button.textContent = original;
    }, 1200);
  }

  copyToClipboard(str) {
    const el = document.createElement("textarea");
    el.value = str;
    el.setAttribute("readonly", "");
    el.contentEditable = "true";
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  }

  render() {
    return (
      <div className="App" style={{ backgroundColor: this.state.hexColor }}>
        <Menu
          customCrossIcon={false}
          menuClassName={"my-class"}
          isOpen={this.state.menuIsOpen}
        >
          {this.state.menuItems.map((item, i) => {
            return (
              <div
                key={item.id}
                className="menu-item"
                style={{ backgroundColor: item.hexCode }}
                onClick={this.clickColor}
                data-index={i}
              >
                <div
                  className="color-name"
                  style={{ color: item.textColor }}
                  data-index={i}
                >
                  {item.colorName}
                </div>
                <div
                  className="color-name"
                  style={{ color: item.textColor }}
                  data-index={i}
                >
                  {item.hexCode}
                </div>
              </div>
            );
          })}
        </Menu>
        <div className="page">
          <div className="outer-container">
            <div className="input-container">
              <div className="ui action input">
                <input
                  type="search"
                  placeholder="Color Code (Hex, RGB, or Name)"
                  onChange={this.handleInputChange}
                  value={this.state.inputValue}
                />
                <button onClick={this.handleSubmit} className="ui button">
                  GO
                </button>
              </div>
              <div
                className="color-name"
                style={{ color: this.state.textColor }}
              >
                {this.state.colorName}
              </div>
            </div>
            <div className="container">
              {this.state.colorArr.map((color, i) => {
                return (
                  <Popup
                    key={color.hex + i}
                    trigger={
                      <div
                        style={{ backgroundColor: color.hex }}
                        className="color-square"
                      />
                    }
                    hoverable
                    position="bottom center"
                  >
                    <div className="popup-button space-below">
                      <button
                        data-index={i}
                        onClick={this.copyHexCode}
                        className="ui button"
                      >
                        {color.hex.toUpperCase()}
                      </button>
                    </div>
                    <div className="popup-button">
                      <button
                        data-index={i}
                        onClick={this.copyRgb}
                        className="ui button"
                      >
                        {"rgb: (" +
                          color.rgb[0] +
                          ", " +
                          color.rgb[1] +
                          ", " +
                          color.rgb[2] +
                          ")"}
                      </button>
                    </div>
                  </Popup>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withFirebase(App);

import React, { Component } from "react";
import { Popup } from "semantic-ui-react";
import { slide as Menu } from "react-burger-menu";
import './Hamburger.css';
import "./App.css";

import { withFirebase } from './Firebase';

// menuItems: this.state.menuItems.map(el => {
//   el.colorName = getColorName(el.hexColor);
//   el.textColor = calcTextColor(parse(el.hexColor).rgb);
//   return el;
// })

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
      color: [36, 103, 182],
      hexColor: "",
      colorArr: [],
      textColor: "white",
      colorName: "",
      loading: false,
      menuItems: [
        {
          hexColor: "#1B5446",
          colorName: ""
        },
        {
          hexColor: "#B2675E",
          colorName: ""
        },
        {
          hexColor: "#A14A76",
          colorName: ""
        },
        {
          hexColor: "#84ACCE",
          colorName: ""
        },
        {
          hexColor: "#7D1D3F",
          colorName: ""
        },
        {
          hexColor: "#D7D9B1",
          colorName: ""
        },
        {
          hexColor: "#512500",
          colorName: ""
        },
        {
          hexColor: "#827191",
          colorName: ""
        },
        {
          hexColor: "#8DB580",
          colorName: ""
        }
      ]
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
    this.setState({
      colorName: getColorName(rgbToHex(...this.state.color)),
      textColor: calcTextColor(this.state.color),
      colorArr: calcAllGradients(this.state.color),
      hexColor: rgbToHex(...this.state.color),
      
    });

    this.setState({ loading: true});
    await this.props.firebase.colorHistory().onSnapshot((querySnapshot) => {
      
      let data = querySnapshot.docs.map(doc => {
          let out = doc.data()
          out.id = doc.id;
          return out;
      });
      console.log(data);
      this.setState({
          menuItems: data,
          loading: false
      })

      return true;

    });
  }

  clickColor(e) {
    console.log(e.target);
    const hex = this.state.menuItems[e.target.dataset.index].hexCode;
    this.setState({
      inputValue: hex
    });
    this.updateStateValues(parse(hex).rgb);
  }

  addMenuItem(hex) {
    const newMenuItem = [{
      hexCode: hex,
      colorName: getColorName(hex),
      textColor: calcTextColor(parse(hex).rgb)
    }];
    const filteredMenu = this.state.menuItems.filter(el => {
      return el.hexCode.toLowerCase() !== hex.toLowerCase();
    });
    this.setState({
      menuItems: newMenuItem.concat(filteredMenu)
    })
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
    let rgb = parse(this.state.inputValue).rgb;
    if (!rgb) rgb = parse("#" + this.state.inputValue).rgb;
    if (rgb) {
      this.updateStateValues(rgb)
    }
  }

  updateStateValues(rgb) {
    this.setState({
      color: rgb,
      colorName: getColorName(rgbToHex(...rgb)),
      textColor: calcTextColor(rgb),
      colorArr: calcAllGradients(rgb),
      hexColor: rgbToHex(...rgb)
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
        <Menu customCrossIcon={ false }
        menuClassName={ "my-class" }>
          {
            this.state.menuItems.map((item, i) => {
              return (
                <div
                  key={item.id}
                  className="menu-item"
                  style={{backgroundColor: item.hexCode}}
                  onClick={this.clickColor}
                  data-index={i}>
                  <div className="color-name" data-index={i}>{item.colorName}</div>
                  <div className="color-name" data-index={i}>{item.hexCode}</div>
                </div>
              )
            })
          }
        </Menu>
        <div className='page'>
        <div className="outer-container">
          <div className="input-container">
            <div className="ui action input">
              <input
                type="text"
                placeholder="Color Code (Hex, RGB, or Name)"
                onChange={this.handleInputChange}
                value={this.state.inputValue}
              />
              <button onClick={this.handleSubmit} className="ui button">
                GO
              </button>
            </div>
            <div className="color-name" style={{ color: this.state.textColor }}>
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

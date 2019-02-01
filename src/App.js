import React, { Component } from "react";
import { Popup } from "semantic-ui-react";
import * as clipboard from "clipboard-polyfill";
import Header from "./Components/Header/Header";
import SignUp from "./Components/SignUp/SignUp";
import Sidebar from "./Components/Sidebar/Sidebar";
import "./App.scss";

import { withFirebase } from "./Components/Firebase";

import {
  getContrastColor,
  getHighContrastColor,
  getColorName,
  rgbToHex,
  calcAllGradients,
  searchNamedColors
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
      contrastColor: "white",
      highContrastColor: "white",
      colorName: "",
      loading: false,
      menuItems: [],
      menuIsOpen: false,
      signupOpen: false
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEnterPress = this.handleEnterPress.bind(this);
    this.copyHexCode = this.copyHexCode.bind(this);
    this.copyRgb = this.copyRgb.bind(this);
    this.clickColor = this.clickColor.bind(this);
    this.openSignUpModal = this.openSignUpModal.bind(this);
    this.openSidebar = this.openSidebar.bind(this);
    this.closeSidebar = this.closeSidebar.bind(this);
    this.closeSignUpModal = this.closeSignUpModal.bind(this);
    this.updateStateValues = this.updateStateValues.bind(this);
  }

  openSidebar(e) {
    this.setState({ menuIsOpen: true });
  }

  closeSidebar(e) {
    this.setState({ menuIsOpen: false });
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
    this.props.firebase.auth.onAuthStateChanged(authUser => {
      authUser
        ? this.setState({ authUser })
        : this.setState({ authUser: null });
    });
  }

  openSignUpModal() {
    this.setState({
      signupOpen: true
    });
  }

  closeSignUpModal(e) {
    this.setState({
      signupOpen: false
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
      contrastColor: getContrastColor(parse(hex).rgb),
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
    if (e.keyCode === 27) {
      this.setState({
        menuIsOpen: false,
        signupOpen: false
      });
    }
  }

  handleInputChange(event) {
    this.setState({ inputValue: event.target.value });
  }

  handleSubmit() {
    const searchTerm = this.state.inputValue.toLowerCase().replace(/\s/g, "");
    let rgb =
      parse(searchTerm).rgb ||
      parse("#" + searchTerm).rgb ||
      searchNamedColors(searchTerm);

    if (rgb) this.updateStateValues(rgb);
  }

  updateStateValues(rgb) {
    this.setState({
      color: rgb,
      colorName: getColorName(rgbToHex(...rgb)),
      contrastColor: getContrastColor(rgb),
      highContrastColor: getHighContrastColor(rgb),
      colorArr: calcAllGradients(rgb),
      hexColor: rgbToHex(...rgb),
      inputValue: rgbToHex(...rgb).toUpperCase()
    });
    this.addMenuItem(rgbToHex(...rgb));
  }

  copyHexCode(e) {
    const output = this.state.colorArr[e.target.dataset.index].hex;
    clipboard.writeText(output);
    this.changeButtonText(e.target, "Copied!");
  }

  copyRgb(e) {
    const rgb = this.state.colorArr[e.target.dataset.index].rgb;
    const output = "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")";
    clipboard.writeText(output);
    this.changeButtonText(e.target, "Copied!");
  }

  changeButtonText(button, text) {
    const original = button.textContent;
    button.textContent = text;
    setTimeout(() => {
      button.textContent = original;
    }, 1200);
  }

  render() {
    return (
      <div className="App" style={{ backgroundColor: this.state.hexColor }}>
        <SignUp
          closeSignUpModal={this.closeSignUpModal}
          isOpen={this.state.signupOpen}
        />
        <Header
          hexColor={this.state.hexColor}
          colorArr={this.state.colorArr}
          openSidebar={this.openSidebar}
          handleSignupClick={this.openSignUpModal}
          contrastColor={this.state.contrastColor}
          highContrastColor={this.state.highContrastColor}
          updateStateValues={this.updateStateValues}
        />
        <Sidebar
          isOpen={this.state.menuIsOpen}
          closeSidebar={this.closeSidebar}
          menuItems={this.state.menuItems}
          clickColor={this.clickColor}
        />

        <div className="page">
          <div className="outer-container">
            <div className="input-container">
              <div className="color-input">
                <input
                  type="search"
                  placeholder="Color Code (Hex, RGB, or Name)"
                  onChange={this.handleInputChange}
                  value={this.state.inputValue}
                  style={{
                    borderColor: this.state.highContrastColor
                  }}
                />
                <button
                  onClick={this.handleSubmit}
                  style={{
                    backgroundColor: this.state.highContrastColor,
                    borderColor: this.state.highContrastColor,
                    color: this.state.hexColor
                  }}
                >
                  GO
                </button>
              </div>
              <div
                className="color-name"
                style={{ color: this.state.contrastColor }}
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

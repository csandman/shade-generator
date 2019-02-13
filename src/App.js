import React, { Component } from "react";
import Header from "./Components/Header";
import SignUp from "./Components/SignUp";
import Sidebar from "./Components/Sidebar";
import LoadingScreen from "./Components/LoadingScreen";
import ColorSquare from './Components/ColorSquare';
import "./App.scss";

import { withFirebase } from "./Components/Firebase";

import {
  getContrastColor,
  getHighContrastColor,
  getLowContrastColor,
  getColorName,
  rgbToHex,
  calcAllGradients,
  searchNamedColors,
  getOppositeContrastColor
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
      oppositeContrastColor: "white",
      highContrastColor: "white",
      lowContrastColor: "white",
      colorName: "",
      loading: false,
      menuItems: [],
      menuIsOpen: false,
      signupOpen: false
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEnterPress = this.handleEnterPress.bind(this);
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
    let rgb = [];
    await this.props.firebase
      .colorHistory()
      .orderBy("dateAdded", "desc")
      .limit(1)
      .get()
      .then(snapshot => {
        rgb = parse(snapshot.docs[0].data().hexCode).rgb;
      });
    this.setState({
      color: rgb,
      colorName: getColorName(rgbToHex(...rgb)),
      contrastColor: getContrastColor(rgb),
      highContrastColor: getHighContrastColor(rgb),
      lowContrastColor: getLowContrastColor(rgb),
      oppositeContrastColor: getOppositeContrastColor(rgb),
      colorArr: calcAllGradients(rgb),
      hexColor: rgbToHex(...rgb)
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
          menuItems: data
        });
        return true;
      });
    this.props.firebase.auth.onAuthStateChanged(authUser => {
      authUser
        ? this.setState({ authUser })
        : this.setState({ authUser: null });
    });
    this.setState({ loading: false });
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
      .catch(function(error) {});
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
      lowContrastColor: getLowContrastColor(rgb),
      oppositeContrastColor: getOppositeContrastColor(rgb),
      colorArr: calcAllGradients(rgb),
      hexColor: rgbToHex(...rgb),
      inputValue: rgbToHex(...rgb).toUpperCase()
    });
    this.addMenuItem(rgbToHex(...rgb));
  }

  render() {
    return (
      <div id="App" style={{ backgroundColor: this.state.hexColor }}>
        <LoadingScreen show={this.state.loading} />
        <div>
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
            lowContrastColor={this.state.lowContrastColor}
            oppositeContrastColor={this.state.oppositeContrastColor}
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
                    style={{ borderColor: this.state.contrastColor }}
                  />
                  <button
                    onClick={this.handleSubmit}
                    style={{
                      borderColor: this.state.contrastColor,
                      backgroundColor: this.state.contrastColor,
                      color: this.state.oppositeContrastColor
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
                {this.state.colorArr.map((color, index) => {
                  return <ColorSquare color={color} key={color + index}></ColorSquare>
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withFirebase(App);

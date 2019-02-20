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
  getColorName,
  searchNamedColors,
  getAllColorInfo
} from "./Functions";

const parse = require("parse-color");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "",
      colorData: {
        hex: "",
        rgb: [],
        shades: []
      },
      loading: true,
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

  openSidebar() {
    this.setState({ menuIsOpen: true });
  }

  closeSidebar() {
    this.setState({ menuIsOpen: false });
  }

  async componentDidMount() {
    document.addEventListener("keydown", this.handleEnterPress, false);
    let colorData = {};
    await this.props.firebase
      .colorHistory()
      .orderBy("dateAdded", "desc")
      .limit(1)
      .get()
      .then(snapshot => {
        colorData = getAllColorInfo(snapshot.docs[0].data().hexCode)
      });
    this.setState({
      colorData: colorData
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

  closeSignUpModal() {
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
    this.updateStateValues(hex);
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

    let hex =
      parse(searchTerm).hex ||
      parse("#" + searchTerm).hex ||
      searchNamedColors(searchTerm);
    if (hex) this.updateStateValues(hex);
  }

  updateStateValues(hex) {
    let colorData = getAllColorInfo(hex);

    this.setState({
      colorData: colorData,
      inputValue: colorData.hex
    });
    this.addMenuItem(hex);
  }

  render() {
    return (
      <div id="App" style={{ backgroundColor: this.state.colorData.hex }}>
        <LoadingScreen show={this.state.loading} />
        <div>
          <SignUp
            closeSignUpModal={this.closeSignUpModal}
            isOpen={this.state.signupOpen}
          />
          <Header
            colorData={this.state.colorData}
            openSidebar={this.openSidebar}
            handleSignupClick={this.openSignUpModal}
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
                    style={{ borderColor: this.state.colorData.contrast }}
                  />
                  <button
                    onClick={this.handleSubmit}
                    style={{
                      borderColor: this.state.colorData.contrast,
                      backgroundColor: this.state.colorData.contrast,
                      color: this.state.colorData.oppositeContrast
                    }}
                  >
                    GO
                  </button>
                </div>
                <div
                  className="color-name"
                  style={{ color: this.state.colorData.contrast }}
                >
                  {this.state.colorData.name}
                </div>
              </div>
              <div className="container">
                {this.state.colorData.shades.map((color, index) => {
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

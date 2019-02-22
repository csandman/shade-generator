import React, { Component } from "react";
import Header from "./Components/Header";
import SignUp from "./Components/SignUp";
import Sidebar from "./Components/Sidebar";
import LoadingScreen from "./Components/LoadingScreen";
import BodyContent from "./Components/BodyContent";
import "./App.scss";

import { withFirebase } from "./Components/Firebase";

import {
  getContrastColor,
  getColorName,
  searchNamedColors,
  getAllColorInfo,
  getRandomHexColor
} from "./Functions";

const parse = require("parse-color");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue1: "",
      inputValue2: "",
      colorData1: {
        hex: "",
        rgb: [],
        shades: []
      },
      colorData2: {
        hex: "",
        rgb: [],
        shades: []
      },
      baseColor: {
        color: "#222222",
        contrast: "#7a7a7a",
        oppositeContrast: "#181818",
        highContrast: "#bdbdbd"
      },
      loading: true,
      menuItems: [],
      menuIsOpen: false,
      signupOpen: false,
      splitView: false
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
    this.toggleSplitView = this.toggleSplitView.bind(this);
    this.getRandomColors = this.getRandomColors.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.handleColorSquareClick = this.handleColorSquareClick.bind(this);
  }

  openSidebar() {
    this.setState({ menuIsOpen: true });
  }

  closeSidebar() {
    this.setState({ menuIsOpen: false });
  }

  async componentDidMount() {
    document.addEventListener("keydown", this.handleEnterPress, false);
    await this.props.firebase
      .colorHistory()
      .orderBy("dateAdded", "desc")
      .limit(2)
      .get()
      .then(snapshot => {
        this.setState({
          colorData1: getAllColorInfo(snapshot.docs[0].data().hexCode),
          colorData2: getAllColorInfo(snapshot.docs[1].data().hexCode)
        })
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
      inputValue1: hex,
      menuIsOpen: false
    });
    this.updateStateValues(hex, "inputValue1");
  }

  getRandomColors() {
    const random1 = getAllColorInfo(getRandomHexColor());
    const random2 = getAllColorInfo(getRandomHexColor());

    this.setState({
      colorData1: random1,
      inputValue1: random1.hex,
      colorData2: random2,
      inputValue2: random2.hex
    });

    this.addMenuItem(random2.hex);
    this.addMenuItem(random1.hex);
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
    console.log(document.activeElement.tagName);
    if (e.keyCode === 13 && document.activeElement.tagName === "INPUT") {
      console.log(document.activeElement);
      this.handleSubmit({ target: { name: document.activeElement.name } });
    }
    if (e.keyCode === 27) {
      this.setState({
        menuIsOpen: false,
        signupOpen: false
      });
    }
  }

  handleInputChange(event) {
    let newState = {};
    newState[event.target.name] = event.target.value;
    this.setState(newState);
  }

  handleSubmit(e) {
    console.log(e.target.name);
    const searchTerm = this.state[e.target.name]
      .toLowerCase()
      .replace(/\s/g, "");

    let hex =
      parse(searchTerm).hex ||
      parse("#" + searchTerm).hex ||
      searchNamedColors(searchTerm);
    if (hex) this.updateStateValues(hex, e.target.name);
  }

  updateStateValues(hex, inputName) {
    let colorData = getAllColorInfo(hex);
    console.log(colorData);

    inputName === "inputValue1"
      ? this.setState({
          colorData1: colorData,
          inputValue1: colorData.hex
        })
      : this.setState({
          colorData2: colorData,
          inputValue2: colorData.hex
        });
    this.addMenuItem(hex);
  }

  toggleSplitView() {
    this.setState({
      splitView: !this.state.splitView
    });
  }

  toggleSidebar() {
    this.setState({
      menuIsOpen: !this.state.menuIsOpen
    });
  }

  handleColorSquareClick(hex, dataNum) {
    let newState = {};
    newState['colorData' + dataNum] = getAllColorInfo(hex);
    newState['inputValue' + dataNum] = hex.toUpperCase();
    this.setState(newState);
  }

  render() {
    return (
      <div id="App" style={{ backgroundColor: this.state.colorData1.hex }}>
        <LoadingScreen show={this.state.loading} />
        <div>
          <SignUp
            closeSignUpModal={this.closeSignUpModal}
            isOpen={this.state.signupOpen}
          />
          <Header
            colorData={this.state.colorData1}
            colorDataAlt={this.state.colorData2}
            baseColor={this.state.baseColor}
            openSidebar={this.openSidebar}
            handleSignupClick={this.openSignUpModal}
            updateStateValues={this.updateStateValues}
            splitView={this.state.splitView}
            toggleSplitView={this.toggleSplitView}
            getRandomColors={this.getRandomColors}
            menuIsOpen={this.state.menuIsOpen}
            toggleSidebar={this.toggleSidebar}
          />
          <Sidebar
            isOpen={this.state.menuIsOpen}
            closeSidebar={this.closeSidebar}
            menuItems={this.state.menuItems}
            clickColor={this.clickColor}
            baseColor={this.state.baseColor}
            handleColorClick={this.handleColorSquareClick}
          />

          <div className="page">
            <div
              className="content-background"
              style={{ backgroundColor: this.state.colorData1.hex }}
            >
              <BodyContent
                handleInputChange={this.handleInputChange}
                inputValue={this.state.inputValue1}
                handleSubmit={this.handleSubmit}
                colorData={this.state.colorData1}
                number={1}
                splitView={this.state.splitView}
                handleColorSquareClick={this.handleColorSquareClick}
              />
            </div>
            {this.state.splitView && (
              <div
                className="content-background"
                style={{ backgroundColor: this.state.colorData2.hex }}
              >
                <BodyContent
                  style={{
                    borderLeft: "2px solid" + this.state.colorData1.contrast
                  }}
                  handleInputChange={this.handleInputChange}
                  inputValue={this.state.inputValue2}
                  handleSubmit={this.handleSubmit}
                  colorData={this.state.colorData2}
                  number={2}
                  splitView={this.state.splitView}
                  handleColorSquareClick={this.handleColorSquareClick}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withFirebase(App);

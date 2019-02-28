import React, { Component } from "react";
import Header from "../Header";
import SignUp from "../SignUp";
import Sidebar from "../Sidebar";
import LoadingScreen from "../LoadingScreen";
import BodyContent from "../BodyContent";
import "./App.scss";

import { withFirebase } from "../Firebase";

import {
  getContrastColor,
  getColorName,
  searchNamedColors,
  getAllColorInfo,
  getRandomHexColor
} from "../../Functions";

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
      loading: true,
      menuItems: [],
      recentColors: [],
      topColors: [],
      menuIsOpen: false,
      signupOpen: false,
      splitView: false,
      splitScreenDisabled: false
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
    this.setSplitScreenAbility = this.setSplitScreenAbility.bind(this);
    this.addMenuItem = this.addMenuItem.bind(this);
  }

  openSidebar() {
    this.setState({ menuIsOpen: true });
  }

  closeSidebar() {
    this.setState({ menuIsOpen: false });
  }

  async componentDidMount() {
    document.addEventListener("keydown", this.handleEnterPress, false);
    window.addEventListener("resize", this.setSplitScreenAbility);
    this.setSplitScreenAbility();

    await this.props.firebase
      .aggRef()
      .get()
      .then(aggs => {
        if (aggs.exists) {
          let recent = aggs.data().recent;
          recent.sort((a, b) => a.timeAdded.seconds > b.timeAdded.seconds);
          let top = aggs.data().top;
          top.sort((a, b) => a.count > b.count);
          this.setState({
            recentColors: recent,
            topColors: top,
            colorData1: getAllColorInfo(recent[0].hex),
            colorData2: getAllColorInfo(recent[1].hex),
            loading: false
          });
        }
      });
  }

  setSplitScreenAbility() {
    const width = window.innerWidth;
    if (width <= 600) {
      this.setState({
        splitScreenDisabled: true
      });
    } else {
      this.setState({
        splitScreenDisabled: false
      });
    }
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
    const hex = e.target.dataset.hex;
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

    if (this.state.splitView) {
      this.addMenuItem(random2.hex);
    }

    this.addMenuItem(random1.hex);
  }

  async addMenuItem(hex) {
    let newColor = {
      hex: hex.toUpperCase(),
      name: getColorName(hex),
      contrast: getContrastColor(parse(hex).rgb).toUpperCase(),
      timeAdded: new Date(),
      timeString: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "numeric"
      }),
      dateString: new Date().toLocaleDateString()
    };

    let topColors = [];
    let recentColors = [];
    let colorRecord = {};

    let aggsRef = this.props.firebase.aggRef();
    let colorRef = this.props.firebase.db
      .collection("color-history")
      .doc(newColor.hex);

    await this.props.firebase.db
      .runTransaction(async transaction => {
        let aggs = await transaction.get(aggsRef);
        colorRecord = await transaction.get(colorRef);

        if (colorRecord.exists) {
          newColor.count = (colorRecord.data().count || 0) + 1;
          await transaction.update(colorRef, { count: newColor.count });
        } else {
          newColor.count = 1;
          await transaction.set(colorRef, newColor);
        }

        topColors = this.getMostPopularArray(aggs.data().top, newColor);
        recentColors = this.getMostRecentArray(aggs.data().recent, newColor);

        transaction.update(aggsRef, {
          top: topColors,
          recent: recentColors
        });
      })
      .then(() => {
        this.setState({
          topColors: topColors,
          recentColors: recentColors
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  getMostPopularArray(arr, el) {
    let isPopular = false;
    arr = arr.filter(color => color.hex !== el.hex);
    arr.sort((a, b) => a.count > b.count);
    for (let i = 0; i < arr.length; i++) {
      if (el.count > arr[i].count) {
        isPopular = true;
        arr = [...arr.slice(0, i), el, ...arr.slice(i, 100)];
        break;
      }
    }
    if (!isPopular && arr.length < 100) {
      arr.push(el);
    }

    console.log("Top Used Colors Arr");
    console.table(arr);
    return arr;
  }

  getMostRecentArray(arr, el) {
    arr = arr.filter(color => color.hex !== el.hex);
    arr.sort((a, b) => a.timeAdded.seconds > b.timeAdded.seconds);
    arr.unshift(el);
    console.log("Most Recent Arr");
    console.table(arr.slice(0, 100));
    return arr.slice(0, 100);
  }

  handleEnterPress(e) {
    if (e.keyCode === 13 && document.activeElement.tagName === "INPUT") {
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
    }, () => console.log(this.state.splitView));
  }

  toggleSidebar() {
    this.setState({
      menuIsOpen: !this.state.menuIsOpen
    });
  }

  handleColorSquareClick(hex, dataNum) {
    let newState = {};
    newState["colorData" + dataNum] = getAllColorInfo(hex);
    newState["inputValue" + dataNum] = hex.toUpperCase();
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
            openSidebar={this.openSidebar}
            handleSignupClick={this.openSignUpModal}
            updateStateValues={this.updateStateValues}
            splitView={this.state.splitView}
            toggleSplitView={this.toggleSplitView}
            getRandomColors={this.getRandomColors}
            menuIsOpen={this.state.menuIsOpen}
            toggleSidebar={this.toggleSidebar}
            splitScreenDisabled={this.state.splitScreenDisabled}
          />
          <Sidebar
            isOpen={this.state.menuIsOpen}
            closeSidebar={this.closeSidebar}
            menuItems={this.state.recentColors}
            topColors={this.state.topColors}
            clickColor={this.clickColor}
            baseColor={this.state.baseColor}
            handleColorClick={this.handleColorSquareClick}
            addMenuItem={this.addMenuItem}
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
                splitScreenDisabled={this.state.splitScreenDisabled}
              />
            </div>
            {this.state.splitView && !this.state.splitScreenDisabled && (
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
                  splitScreenDisabled={this.state.splitScreenDisabled}
                  addMenuItem={this.addMenuItem}
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

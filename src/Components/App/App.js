import React, { Component } from "react";
import Header from "../Header";
import SignUp from "../SignUp";
import Sidebar from "../Sidebar";
import LoadingScreen from "../LoadingScreen";
import BodyContent from "../BodyContent";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import "./App.scss";
import "../../styles/fa/fontawesome.scss";
import "../../styles/fa/solid.scss";

import { withFirebase } from "../Firebase";

import {
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
      splitScreenDisabled: false,
      online: true
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEnterPress = this.handleEnterPress.bind(this);
    this.handleColorClick = this.handleColorClick.bind(this);
    this.openSignUpModal = this.openSignUpModal.bind(this);
    this.openSidebar = this.openSidebar.bind(this);
    this.closeSidebar = this.closeSidebar.bind(this);
    this.closeSignUpModal = this.closeSignUpModal.bind(this);
    this.updateStateValues = this.updateStateValues.bind(this);
    this.toggleSplitView = this.toggleSplitView.bind(this);
    this.getRandomColors = this.getRandomColors.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.handleColorClick = this.handleColorClick.bind(this);
    this.setSplitScreenAbility = this.setSplitScreenAbility.bind(this);
    this.addMenuItem = this.addMenuItem.bind(this);
  }

  async componentDidMount() {
    document.addEventListener("keydown", this.handleEnterPress, false);
    window.addEventListener("resize", this.setSplitScreenAbility);
    this.setSplitScreenAbility();

    if (navigator && navigator.onLine) {
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
      })
      .catch(error => {
        console.log(error);
        this.setState({
          colorData1: getAllColorInfo(getRandomHexColor()),
          colorData2: getAllColorInfo(getRandomHexColor()),
          loading: false,
          online: false
        });
      });
    } else {
      console.log("offline detected")
      this.setState({
        colorData1: getAllColorInfo(getRandomHexColor()),
        colorData2: getAllColorInfo(getRandomHexColor()),
        loading: false,
        online: false
      });
    }
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

  openSidebar() {
    this.setState({ menuIsOpen: true });
    disableBodyScroll(document.getElementById("sidebar"));
  }

  closeSidebar() {
    this.setState({ menuIsOpen: false });
    enableBodyScroll(document.getElementById("sidebar"));
  }

  toggleSidebar() {
    this.state.menuIsOpen ? this.closeSidebar() : this.openSidebar();
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

  toggleSplitView() {
    this.setState({
      splitView: !this.state.splitView
    });
  }

  getRandomColors() {
    const randomHex1 = getRandomHexColor();
    this.updateStateValues(randomHex1, "inputValue1");

    if (this.state.splitView && this.state.splitScreenDisabled === false) {
      const randomHex2 = getRandomHexColor();
      this.updateStateValues(randomHex2, "inputValue2");
    }
  }

  async addMenuItem(hex) {
    if (this.state.online) {
      let newColor = getAllColorInfo(hex);
      newColor.timeAdded = new Date();
      newColor.timeString = new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "numeric"
      });
      newColor.dateString = new Date().toLocaleDateString();
      delete newColor.keyword;
      delete newColor.shades;

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
    return arr;
  }

  getMostRecentArray(arr, el) {
    arr = arr.filter(color => color.hex !== el.hex);
    arr.sort((a, b) => a.timeAdded.seconds > b.timeAdded.seconds);
    arr.unshift(el);
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

  handleColorClick(hex, dataNum) {
    this.updateStateValues(hex, "inputValue" + dataNum);
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
            handleColorClick={this.handleColorClick}
            baseColor={this.state.baseColor}
            addMenuItem={this.addMenuItem}
            getRandomColors={this.getRandomColors}
            toggleSplitView={this.toggleSplitView}
            online={this.state.online}
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
                handleColorClick={this.handleColorClick}
                splitScreenDisabled={this.state.splitScreenDisabled}
                addMenuItem={this.addMenuItem}
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
                  handleColorClick={this.handleColorClick}
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

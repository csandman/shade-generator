import React, { Component } from "react";
import Header from "../Header";
import SignUp from "../SignUp";
import Sidebar from "../Sidebar";
import LoadingScreen from "../LoadingScreen";
import BodyContent from "../BodyContent";
import ReactGA from "react-ga";
// import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import "./App.scss";
import "@fortawesome/fontawesome-free/scss/fontawesome.scss";
import "@fortawesome/fontawesome-free/scss/solid.scss";
import "@fortawesome/fontawesome-free/scss/brands.scss";

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
      online: true,
      pathnameArr: []
    };

    this.addMenuItem = this.addMenuItem.bind(this);
  }

  componentDidMount() {
    ReactGA.initialize(process.env.REACT_APP_GA_CODE);
    ReactGA.event({
      category: "Connection",
      action: "Connected to Shade Generator"
    });

    document.addEventListener("keydown", this.handleKeyPress, false);
    window.addEventListener("resize", this.setSplitScreenAbility);
    this.setSplitScreenAbility();

    if (navigator && navigator.onLine) {
      this.props.firebase
        .colorHistory()
        .orderBy("timeAdded", "desc")
        .limit(100)
        .onSnapshot(querySnapshot => {
          let data = querySnapshot.docs.map(doc => {
            let out = doc.data();
            out.id = doc.id;
            return out;
          });
          this.setState({
            recentColors: data,
            loading: false
          });
          return true;
        });

      this.props.firebase
        .colorHistory()
        .orderBy("count", "desc")
        .limit(100)
        .onSnapshot(querySnapshot => {
          let data = querySnapshot.docs.map(doc => {
            let out = doc.data();
            out.id = doc.id;
            return out;
          });
          this.setState({
            topColors: data
          });
          return true;
        });
    } else {
      console.log("offline detected");
      this.setState({
        loading: false,
        online: false
      });
    }

    const colorData1 = getAllColorInfo(getRandomHexColor());
    const colorData2 = getAllColorInfo(getRandomHexColor());
    this.setState({
      colorData1,
      colorData2,
      pathnameArr: [colorData1.hex.slice(1)]
    });

    let parseSuccessful = false;

    if (window.location.pathname.slice(1)) {
      parseSuccessful = this.parseURL();
    }

    if (!parseSuccessful) {
      this.setState(
        {
          pathnameArr: [colorData1.hex.slice(1)]
        },
        () => this.updatePathname()
      );
    }
  }

  addMenuItem(hex) {
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

      let colorRef = this.props.firebase.db
        .collection("color-history")
        .doc(newColor.hex);

      colorRef.get().then(colorRecord => {
        if (colorRecord.exists) {
          newColor.count = (colorRecord.data().count || 0) + 1;
          colorRef.update({ ...newColor, count: newColor.count });
        } else {
          newColor.count = 1;
          colorRef.set(newColor);
        }
      });
    }
  }

  parseURL = () => {
    let splitUrl = window.location.pathname
      .slice(1)
      .toUpperCase()
      .split("-");

    if (splitUrl.length === 1 && splitUrl[0].match(/^[0-9a-f]{6}$/i)) {
      this.updateStateValues("#" + splitUrl[0], 1);
      window.history.pushState(
        {},
        "Shade Generator",
        window.location.pathname.slice(1)
      );
      return true;
    } else if (
      splitUrl.length === 2 &&
      splitUrl[0].match(/^[0-9a-f]{6}$/i) &&
      splitUrl[1].match(/^[0-9a-f]{6}$/i)
    ) {
      this.updateStateValues("#" + splitUrl[0], 1);
      this.updateStateValues("#" + splitUrl[1], 2);
      this.setState(
        {
          pathnameArr: splitUrl
        },
        () => this.updatePathname()
      );
      this.setState(
        {
          splitView: true,
          pathnameArr: splitUrl
        },
        () => this.updatePathname()
      );
      return true;
    }
    return false;
  };

  updatePathname = () => {
    window.history.pushState(
      {},
      "Shade Generator",
      this.state.pathnameArr.join("-")
    );
  };

  setSplitScreenAbility = () => {
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
  };

  openSidebar = () => {
    this.setState({ menuIsOpen: true });
    ReactGA.event({
      category: "Button Press",
      action: "Open sidebar"
    });
    // disableBodyScroll(document.getElementById("sidebar"));
  };

  closeSidebar = () => {
    this.setState({ menuIsOpen: false });
    ReactGA.event({
      category: "Button Press",
      action: "Close sidebar"
    });
    // enableBodyScroll(document.getElementById("sidebar"));
  };

  toggleSidebar = () => {
    this.state.menuIsOpen ? this.closeSidebar() : this.openSidebar();
  };

  openSignUpModal = () => {
    this.setState({
      signupOpen: true
    });
  };

  closeSignUpModal = () => {
    this.setState({
      signupOpen: false
    });
  };

  toggleSplitView = () => {
    let newPathNameArr = this.state.splitView
      ? this.state.pathnameArr.slice(0, 1)
      : [...this.state.pathnameArr, this.state.colorData2.hex.slice(1)];
    this.setState(
      {
        pathnameArr: newPathNameArr,
        splitView: !this.state.splitView
      },
      () => this.updatePathname()
    );
  };

  getRandomColors = () => {
    ReactGA.event({
      category: "Button Press",
      action: "Random color button"
    });
    const randomHex1 = getRandomHexColor();
    this.updateStateValues(randomHex1, 1);

    if (this.state.splitView && this.state.splitScreenDisabled === false) {
      const randomHex2 = getRandomHexColor();
      this.updateStateValues(randomHex2, 2);
    }
  };

  getMostPopularArray = (arr, el) => {
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
  };

  getMostRecentArray = (arr, el) => {
    arr = arr.filter(color => color.hex !== el.hex);
    arr.sort((a, b) => a.timeAdded.seconds > b.timeAdded.seconds);
    arr.unshift(el);
    return arr.slice(0, 100);
  };

  handleKeyPress = e => {
    // enter press
    if (e.keyCode === 13 && document.activeElement.tagName === "INPUT") {
      if (document.activeElement.id !== "color-search") {
        this.handleSubmit(parseInt(e.target.dataset.number));
      }
      document.activeElement.blur();
    }
    // esc press
    if (e.keyCode === 27) {
      this.setState({
        menuIsOpen: false,
        signupOpen: false
      });
    }
  };

  handleInputChange = event => {
    let newState = {};
    newState[event.target.name] = event.target.value;
    this.setState(newState);
  };

  handleSubmit = colorNum => {
    const searchTerm = this.state["inputValue" + colorNum]
      .toLowerCase()
      .replace(/\s/g, "");

    let hex =
      parse(searchTerm).hex ||
      parse("#" + searchTerm).hex ||
      searchNamedColors(searchTerm);
    if (hex) {
      this.updateStateValues(hex, colorNum);
      return true;
    } else {
      return false;
    }
  };

  updateStateValues = (hex, colorNum) => {
    let colorData = getAllColorInfo(hex);
    if (colorNum === 1) {
      const newPNA = this.state.pathnameArr;
      newPNA[0] = colorData.hex.slice(1);
      this.setState(
        {
          colorData1: colorData,
          inputValue1: colorData.hex,
          pathnameArr: newPNA
        },
        () => this.updatePathname()
      );
    } else if (colorNum === 2) {
      this.setState(
        {
          colorData2: colorData,
          inputValue2: colorData.hex,
          pathnameArr: [this.state.pathnameArr[0], colorData.hex.slice(1)]
        },
        () => this.updatePathname()
      );
    }
    this.addMenuItem(hex);
  };

  handleColorClick = (hex, dataNum) => {
    this.updateStateValues(hex, dataNum);
  };

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
            splitView={this.state.splitView}
            toggleSplitView={this.toggleSplitView}
            getRandomColors={this.getRandomColors}
            menuIsOpen={this.state.menuIsOpen}
            toggleSidebar={this.toggleSidebar}
            splitScreenDisabled={this.state.splitScreenDisabled}
          />
          <Sidebar
            colorData={this.state.colorData1}
            isOpen={this.state.menuIsOpen}
            closeSidebar={this.closeSidebar}
            menuItems={this.state.recentColors}
            topColors={this.state.topColors}
            handleColorClick={this.handleColorClick}
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

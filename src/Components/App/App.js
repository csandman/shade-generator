import React, {
  useState,
  useEffect,
  useCallback
} from "react";
import { useEventListener } from "../../Hooks";
import { useOnline } from "react-browser-hooks";
import Header from "../Header";
import Sidebar from "../Sidebar";
import LoadingScreen from "../LoadingScreen";
import BodyContent from "../BodyContent";
import ReactGA from "react-ga";
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

function issplitViewDisabled() {
  const width = window.innerWidth;
  if (width <= 600) {
    return true;
  } else {
    return false;
  }
}

const App = props => {
  console.log("app");

  const [colorData1, setColorData1] = useState(
    getAllColorInfo(getRandomHexColor())
  );
  const [colorData2, setColorData2] = useState(
    getAllColorInfo(getRandomHexColor())
  );
  const [inputVals, setInputVals] = useState({
    inputValue1: "",
    inputValue2: ""
  });
  const [loading, setLoading] = useState(true);
  
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [splitView, setSplitView] = useState(false);
  const [splitViewDisabled, setsplitViewDisabled] = useState(
    issplitViewDisabled()
  );
  const online = useOnline();
  const [pathnameArr, setPathnameArr] = useState([colorData1.hex.slice(1)]);

  useEffect(() => {
    if (online) {
      ReactGA.initialize(process.env.REACT_APP_GA_CODE);
      ReactGA.event({
        category: "Connection",
        action: "Connected to Shade Generator"
      });

      
    } else {
      console.log("offline detected");
      setLoading(false);
    }

    let parseSuccessful = false;
    if (window.location.pathname.slice(1)) {
      parseSuccessful = parseURL();
    }
    if (!parseSuccessful) {
      setPathnameArr([colorData1.hex.slice(1)]);
    }
    setLoading(false);
  }, []);

  const handleResize = useCallback(
    ({ clientX, clientY }) => {
      setsplitViewDisabled(issplitViewDisabled());
    },
    [setsplitViewDisabled]
  );

  function handleKeyPress(e) {
    if (e.code === "Enter" && document.activeElement.tagName === "INPUT") {
      if (document.activeElement.id !== "color-search") {
        handleSubmit(parseInt(e.target.dataset.number));
      }
      document.activeElement.blur();
    }
    if (e.code === "Escape") {
      setMenuIsOpen(false);
    }
  }

  useEventListener("resize", handleResize);
  useEventListener("keypress", handleKeyPress);

  function addMenuItem(hex) {
    if (online) {
      let newColor = getAllColorInfo(hex);
      newColor.timeAdded = new Date();
      newColor.timeString = new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "numeric"
      });
      newColor.dateString = new Date().toLocaleDateString();
      delete newColor.keyword;
      delete newColor.shades;

      let colorRef = props.firebase.db
        .collection("color-history")
        .doc(newColor.hex);

      colorRef.get().then(colorRecord => {
        if (colorRecord.exists) {
          newColor.count = (colorRecord.data().count || 0) + 1;
          colorRef.update({ ...newColor });
        } else {
          newColor.count = 1;
          colorRef.set(newColor);
        }
      });
    }
  }

  function parseURL() {
    let splitUrl = window.location.pathname
      .slice(1)
      .toUpperCase()
      .split("-");

    if (splitUrl.length === 1 && splitUrl[0].match(/^[0-9a-f]{6}$/i)) {
      updateStateValues("#" + splitUrl[0], 1);
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
      updateStateValues("#" + splitUrl[0], 1);
      updateStateValues("#" + splitUrl[1], 2);
      setSplitView(true);
      setPathnameArr(splitUrl);
      return true;
    }
    return false;
  }



  useEffect(() => {
    window.history.pushState({}, "Shade Generator", pathnameArr.join("-"));
  }, [pathnameArr, pathnameArr[0]]);

  const openSidebar = () => {
    setMenuIsOpen(true);
    ReactGA.event({
      category: "Button Press",
      action: "Open sidebar"
    });
  };

  const closeSidebar = () => {
    setMenuIsOpen(false);
    ReactGA.event({
      category: "Button Press",
      action: "Close sidebar"
    });
  };

  const toggleSidebar = () => {
    menuIsOpen ? closeSidebar() : openSidebar();
  };

  const toggleSplitView = () => {
    let newPathNameArr = splitView
      ? pathnameArr.slice(0, 1)
      : [...pathnameArr, colorData2.hex.slice(1)];
    setPathnameArr(newPathNameArr);
    setSplitView(!splitView);
  };

  const getRandomColors = () => {
    ReactGA.event({
      category: "Button Press",
      action: "Random color button"
    });
    const randomHex1 = getRandomHexColor();
    updateStateValues(randomHex1, 1);

    if (splitView && splitViewDisabled === false) {
      const randomHex2 = getRandomHexColor();
      updateStateValues(randomHex2, 2);
    }
  };

  // TODO
  const handleInputChange = event => {
    let newState = {};
    newState[event.target.name] = event.target.value;
    setInputVals({
      ...inputVals,
      ...newState
    });
  };

  //TODO
  const handleSubmit = colorNum => {
    const searchTerm = inputVals["inputValue" + colorNum]
      .toLowerCase()
      .replace(/\s/g, "");

    let hex =
      parse(searchTerm).hex ||
      parse("#" + searchTerm).hex ||
      searchNamedColors(searchTerm);
    if (hex) {
      updateStateValues(hex, colorNum);
      return true;
    } else {
      return false;
    }
  };

  const updateStateValues = (hex, colorNum) => {
    let colorData = getAllColorInfo(hex);
    if (colorNum === 1) {
      const newPNA = pathnameArr;
      newPNA[0] = colorData.hex.slice(1);
      setColorData1(colorData);
      setInputVals({
        ...inputVals,
        inputValue1: colorData.hex
      });
      setPathnameArr(newPNA);
    } else if (colorNum === 2) {
      setColorData2(colorData);
      setInputVals({
        ...inputVals,
        inputValue2: colorData.hex
      });
      setPathnameArr([pathnameArr[0], colorData.hex.slice(1)]);
    }
    addMenuItem(hex);
  };

  const handleColorClick = (hex, dataNum) => {
    updateStateValues(hex, dataNum);
  };

  return (
    <div id="App" style={{ backgroundColor: colorData1.hex }}>
      <LoadingScreen show={loading} />
      <div>
        <Header
          colorData={colorData1}
          splitView={splitView}
          toggleSplitView={toggleSplitView}
          getRandomColors={getRandomColors}
          menuIsOpen={menuIsOpen}
          toggleSidebar={toggleSidebar}
          splitViewDisabled={splitViewDisabled}
        />
        <Sidebar
          isOpen={menuIsOpen}
          closeSidebar={closeSidebar}
          handleColorClick={handleColorClick}
          toggleSplitView={toggleSplitView}
        />

        <div className="page">
          <BodyContent
            handleInputChange={handleInputChange}
            inputValue={inputVals.inputValue1}
            handleSubmit={handleSubmit}
            colorData={colorData1}
            bodyNum={1}
            splitView={splitView}
            handleColorClick={handleColorClick}
            splitViewDisabled={splitViewDisabled}
          />
          {splitView && !splitViewDisabled && (
            <BodyContent
              style={{
                borderLeft: "2px solid" + colorData1.contrast
              }}
              handleInputChange={handleInputChange}
              inputValue={inputVals.inputValue2}
              handleSubmit={handleSubmit}
              colorData={colorData2}
              bodyNum={2}
              splitView={splitView}
              handleColorClick={handleColorClick}
              splitViewDisabled={splitViewDisabled}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default withFirebase(App);

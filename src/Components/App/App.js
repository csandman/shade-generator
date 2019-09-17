import React, { useState, useEffect, useCallback } from "react";
import { useEventListener } from "../../Hooks";
import { useOnline } from "react-browser-hooks";
import Header from "../Header";
import Sidebar from "../Sidebar";
import LoadingScreen from "../LoadingScreen";
import BodyContent from "../BodyContent";
import ReactGA from "react-ga";
import "./App.scss";
import { withFirebase } from "../Firebase";
import { InputUpdater } from '../../Contexts/InputContext';

import {
  searchNamedColors,
  getAllColorInfo,
  getRandomHexColor,
  getCopy
} from "../../Functions";

const parse = require("parse-color");

const issplitViewDisabled = () => {
  const width = window.innerWidth;
  if (width <= 600) {
    return true;
  } else {
    return false;
  }
}

const App = props => {
  const [colorData1, setColorData1] = useState(
    getAllColorInfo(getRandomHexColor())
  );
  const [colorData2, setColorData2] = useState(
    getAllColorInfo(getRandomHexColor())
  );
  const [loading, setLoading] = useState(true);
  const [splitView, setSplitView] = useState(false);
  const [splitViewDisabled, setsplitViewDisabled] = useState(
    issplitViewDisabled()
  );
  const online = useOnline();
  const [pathnameArr, setPathnameArr] = useState([colorData1.hex.slice(1)]);
  const [curInputNum, setCurInputNum] = useState(1);
  const [curInputVal, setCurInputVal] = useState(colorData1.hex);

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
    setTimeout(() => setLoading(false), 200);
  }, []);

  const handleResize = useCallback(
    () => {
      setsplitViewDisabled(issplitViewDisabled());
    },
    [setsplitViewDisabled]
  );

  useEventListener("resize", handleResize);

  function addMenuItem(newColor) {
    newColor.timeAdded = new Date();
    newColor.timeString = new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "numeric"
    });
    newColor.dateString = new Date().toLocaleDateString();

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

  //TODO
  const handleSubmit = (inputNum, inputVal) => {
    const searchTerm = inputVal.toLowerCase().replace(/\s/g, "");

    let hex =
      parse(searchTerm).hex ||
      parse("#" + searchTerm).hex ||
      searchNamedColors(searchTerm);
    if (hex) {
      updateStateValues(hex, inputNum);
      return true;
    } else {
      return false;
    }
  };

  const updateStateValues = (hex, colorNum) => {
    let colorData = getAllColorInfo(hex);
    delete colorData.keyword;
    if (colorNum === 1) {
      const newPNA = pathnameArr;
      newPNA[0] = colorData.hex.slice(1);
      setColorData1(colorData);
      setPathnameArr(newPNA);
    } else if (colorNum === 2) {
      setColorData2(colorData);
      setPathnameArr([pathnameArr[0], colorData.hex.slice(1)]);
    }
    // TODO
    // useInputUpdate(colorNum, hex);
    setCurInputVal(hex);
    setCurInputNum(colorNum);
    if (online) addMenuItem(getCopy(colorData));
  };

  const handleColorClick = (hex, dataNum) => {
    updateStateValues(hex, dataNum);
  };

  return (
    <div id="App" style={{ backgroundColor: colorData1.hex }}>
      <InputUpdater inputNum={curInputNum} inputValue={curInputVal} />
      <LoadingScreen show={loading} />
      <div>
        <Header
          colorData={colorData1}
          splitView={splitView}
          toggleSplitView={toggleSplitView}
          getRandomColors={getRandomColors}
          splitViewDisabled={splitViewDisabled}
        />
        <Sidebar
          handleColorClick={handleColorClick}
          toggleSplitView={toggleSplitView}
        />

        <div className="page">
          <BodyContent
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

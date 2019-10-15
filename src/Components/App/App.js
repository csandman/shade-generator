import React, { useState, useEffect, useContext } from "react";
import { useOnline } from "react-browser-hooks";
import ReactGA from "react-ga";
import Header from "../Header";
import Sidebar from "../Sidebar";
import LoadingScreen from "../LoadingScreen";
import BodyContent from "../BodyContent";
import "./App.scss";
import { withFirebase } from "../Firebase";
import { InputUpdater } from "../../Contexts/InputContext";
import SplitViewContext from "../../Contexts/SplitViewContext";
// import ContrastRatio from "../ContrastRatio";

import {
  searchNamedColors,
  getAllColorInfo,
  getRandomColor,
  getCopy,
  attemptCreateColor
} from "../../Functions";

function parseURL() {
  const path = window.location.pathname.slice(1);
  if (path.length) {
    const splitUrl = window.location.pathname
      .slice(1)
      .toUpperCase()
      .split("-");

    if (splitUrl.length === 1 && splitUrl[0].match(/^[0-9A-F]{6}$/)) {
      return [`#${splitUrl[0]}`, "", false];
    }
    if (
      splitUrl.length === 2 &&
      splitUrl[0].match(/^[0-9A-F]{6}$/) &&
      splitUrl[1].match(/^[0-9A-F]{6}$/)
    ) {
      return [`#${splitUrl[0]}`, `#${splitUrl[1]}`, true];
    }
    window.history.pushState({}, "Shade Generator", "");
  }

  return ["", "", false];
}

const [initialHex1, initialHex2, initialSplitState] = parseURL();

const initialColor1 = getAllColorInfo(
  initialHex1.length ? attemptCreateColor(initialHex1) : getRandomColor()
);

const initialColor2 = getAllColorInfo(
  initialHex2.length ? attemptCreateColor(initialHex2) : getRandomColor()
);

const App = props => {
  const online = useOnline();
  const [colorData1, setColorData1] = useState(initialColor1);
  const [colorData2, setColorData2] = useState(initialColor2);
  const [loading, setLoading] = useState(true);
  const [curInputVal1, setCurInputVal1] = useState(initialHex1);
  const [curInputVal2, setCurInputVal2] = useState(initialHex2);

  const { splitView, splitViewDisabled, setSplitView } = useContext(
    SplitViewContext
  );

  useEffect(() => {
    if (online) {
      ReactGA.initialize(process.env.REACT_APP_GA_CODE);
      ReactGA.event({
        category: "Connection",
        action: "Connected to Shade Generator"
      });
    } else {
      console.log("offline detected");
    }

    setSplitView(initialSplitState);
    setTimeout(() => setLoading(false), 200);
  }, [online, setSplitView]);

  const hex1 = colorData1.hex;
  const hex2 = colorData2.hex;

  useEffect(() => {
    if (splitView === true && !splitViewDisabled) {
      window.history.pushState(
        {},
        "Shade Generator",
        `${hex1.slice(1)}-${hex2.slice(1)}`
      );
    } else if (splitView === false) {
      window.history.pushState({}, "Shade Generator", hex1.slice(1));
    }
  }, [hex1, hex2, splitView, splitViewDisabled]);

  function addMenuItem(newColor) {
    const colorToAdd = { ...newColor };
    colorToAdd.timeAdded = new Date();
    colorToAdd.timeString = new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "numeric"
    });
    colorToAdd.dateString = new Date().toLocaleDateString();

    const colorRef = props.firebase.db
      .collection("color-history")
      .doc(colorToAdd.hex);

    console.log(colorToAdd);

    colorRef.get().then(colorRecord => {
      if (colorRecord.exists) {
        colorToAdd.count = (colorRecord.data().count || 0) + 1;
        colorRef.update(colorToAdd);
      } else {
        colorToAdd.count = 1;
        colorRef.set(colorToAdd);
      }
    });
  }

  function updateStateValues(color, colorNum) {
    let colorData;
    if (typeof color === "object") {
      if (color.shades) {
        colorData = color;
      } else {
        colorData = getAllColorInfo(color.hex);
      }
    } else if (typeof color === "string") {
      colorData = getAllColorInfo(color);
    } else {
      return;
    }

    delete colorData.keyword;
    if (colorNum === 1) {
      setColorData1(colorData);
      setCurInputVal1(colorData.hex);
    } else if (colorNum === 2) {
      setColorData2(colorData);
      setCurInputVal2(colorData.hex);
    }
    if (online) addMenuItem(getCopy(colorData));
  }

  function getRandomColors() {
    ReactGA.event({
      category: "Button Press",
      action: "Random color button"
    });
    const randomColor1 = getAllColorInfo(getRandomColor());
    updateStateValues(randomColor1, 1);

    if (splitView && splitViewDisabled === false) {
      const randomColor2 = getAllColorInfo(getRandomColor());
      updateStateValues(randomColor2, 2);
    }
  }

  function handleSubmit(inputNum, inputVal) {
    const searchTerm = inputVal.toLowerCase().replace(/\s/g, "");

    let hex;
    try {
      hex = attemptCreateColor(searchTerm).hex();
    } catch (err) {
      // ignore empty expression
    }
    if (!hex) {
      try {
        hex = attemptCreateColor(`#${searchTerm}`).hex();
      } catch (err) {
        // ignore empty expression
      }
    }
    if (!hex) {
      try {
        hex = searchNamedColors(searchTerm);
      } catch (err) {
        // ignore empty expression
      }
    }

    console.log(hex);

    if (hex) {
      updateStateValues(hex, inputNum);
      return true;
    }
    return false;
  }

  return (
    <div id="App" style={{ backgroundColor: colorData1.hex }}>
      <InputUpdater inputValue1={curInputVal1} inputValue2={curInputVal2} />
      <LoadingScreen show={loading} />
      <div className="main-container">
        <Header colorData={colorData1} getRandomColors={getRandomColors} />
        <Sidebar handleColorClick={updateStateValues} />
        <div className="page">
          <BodyContent
            handleSubmit={handleSubmit}
            colorData={colorData1}
            bodyNum={1}
            handleColorClick={updateStateValues}
          />
          {splitView && !splitViewDisabled && (
            <BodyContent
              handleSubmit={handleSubmit}
              colorData={colorData2}
              bodyNum={2}
              handleColorClick={updateStateValues}
            />
          )}
        </div>
        {/* <ContrastRatio hex1={hex1} hex2={hex2} /> */}
      </div>
    </div>
  );
};

export default withFirebase(App);

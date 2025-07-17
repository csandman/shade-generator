import { useState, useEffect, useRef, useCallback } from 'react';
import ReactGA from 'react-ga4';
import useOnline from 'hooks/use-online';
import { useSplitView } from 'contexts/split-view-context';
import { useHistory } from 'contexts/history-context';
import Header from 'Components/Header';
import Sidebar from 'Components/Sidebar';
import BodyContent from 'Components/BodyContent';
import { InputUpdater } from 'contexts/input-context';
import {
  getAllColorInfo,
  getRandomColor,
  attemptCreateColor,
  parseColorFromString,
  type ColorInfo,
} from 'utils/color';
import './App.scss';
import type { ColorInstance } from 'color';
import type { BodyNumber, ColorCallback } from 'types/app';
import { parseURL, type UrlState } from 'utils/url';

const [urlHex1, urlHex2, initialSplitState] = parseURL();

const initialColor1 = getAllColorInfo(
  urlHex1.length
    ? (attemptCreateColor(urlHex1) as ColorInstance)
    : getRandomColor(),
);

const initialColor2 = getAllColorInfo(
  urlHex2.length
    ? (attemptCreateColor(urlHex2) as ColorInstance)
    : getRandomColor(),
);

const App = () => {
  const isOnline = useOnline();
  const [colorData1, setColorData1] = useState(initialColor1);
  const [colorData2, setColorData2] = useState(initialColor2);
  const hex1 = colorData1.hex;
  const hex2 = colorData2.hex;
  const [curInputVal1, setCurInputVal1] = useState(urlHex1);
  const [curInputVal2, setCurInputVal2] = useState(urlHex2);

  const popCount = useRef(2);

  const { splitView, splitViewDisabled, setSplitView } = useSplitView();

  const { updateRecentColors } = useHistory();

  const updateStateValues = useCallback<ColorCallback>(
    (color, colorNum) => {
      const addMenuItem = (newColor: ColorInfo) => {
        const colorToAdd = { ...newColor };
        colorToAdd.timeString = new Date().toLocaleTimeString([], {
          hour: 'numeric',
          minute: 'numeric',
        });
        colorToAdd.dateString = new Date().toLocaleDateString();

        updateRecentColors(colorToAdd);
      };

      let colorData;
      if (typeof color === 'object') {
        if (color?.shades?.[0]?.contrastRatio) {
          colorData = color;
        } else {
          colorData = getAllColorInfo(color.hex);
        }
      } else if (typeof color === 'string') {
        colorData = getAllColorInfo(color);
      } else {
        throw new Error('Invalid color');
      }

      delete colorData.keyword;
      if (colorNum === 1) {
        setColorData1(colorData);
        setCurInputVal1(colorData.hex);
      } else if (colorNum === 2) {
        setColorData2(colorData);
        setCurInputVal2(colorData.hex);
      }

      addMenuItem({ ...colorData });
    },
    [updateRecentColors],
  );

  const getRandomColors = () => {
    ReactGA.event({
      category: 'Button Press',
      action: 'Random color button',
    });
    const randomColor1 = getAllColorInfo(getRandomColor());
    updateStateValues(randomColor1, 1);

    if (splitView && !splitViewDisabled) {
      const randomColor2 = getAllColorInfo(getRandomColor());
      updateStateValues(randomColor2, 2);
    }
  };

  const handleSubmit = (inputNum: BodyNumber, inputVal: string) => {
    const hex = parseColorFromString(inputVal);
    if (hex) {
      updateStateValues(hex, inputNum);
    }
  };

  // initialize app
  useEffect(() => {
    if (isOnline) {
      ReactGA.initialize(import.meta.env.VITE_APP_GA_CODE);
      ReactGA.event({
        category: 'Connection',
        action: 'Connected to Shade Generator',
      });
    } else {
      console.log('offline detected');
    }

    setSplitView(initialSplitState);
  }, [isOnline, setSplitView]);

  // Update url when colors change or when split view
  useEffect(() => {
    if (!popCount.current) {
      const newState: UrlState = { hex1 };
      let newPath = hex1.slice(1);
      if (splitView && !splitViewDisabled) {
        newState.hex2 = hex2;
        newPath += `-${hex2.slice(1)}`;
      }
      window.history.pushState(newState, 'Shade Generator', newPath);
    } else {
      popCount.current -= 1;
    }
  }, [hex1, hex2, splitView, splitViewDisabled]);

  // update color states based on previous url
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      popCount.current = 1;
      if (e?.state?.hex2) {
        popCount.current = 2;
      }

      updateStateValues(e?.state?.hex1, 1);
      if (e?.state?.hex2) {
        updateStateValues(e.state.hex2, 2);
        setSplitView(true);
      } else {
        setSplitView(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [setSplitView, updateStateValues]);

  return (
    <div id="App" style={{ backgroundColor: colorData1.hex }}>
      <InputUpdater inputValue1={curInputVal1} inputValue2={curInputVal2} />
      <div className="main-container">
        <Header colorData={colorData1} getRandomColors={getRandomColors} />
        <Sidebar handleColorClick={updateStateValues} />
        <div className="page">
          <BodyContent
            handleSubmit={handleSubmit}
            colorData={colorData1}
            bodyNum={1}
          />
          {splitView && !splitViewDisabled && (
            <BodyContent
              handleSubmit={handleSubmit}
              colorData={colorData2}
              bodyNum={2}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;

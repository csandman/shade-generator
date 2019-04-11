import React, { useState, useEffect } from "react";
import _ from "lodash";
import namedColors from "color-name-list";
import "./Sidebar.scss";

import { getContrastColor, hexToRgb } from "../../Functions";

const Sidebar = props => {
  const getInitialColorNameList = () => {
    return namedColors.slice(0, 500).map(el => {
      el.contrast = getContrastColor(hexToRgb(el.hex));
      return el;
    });
  };

  const [searchInput, updateSearchInput] = useState("");
  const [colorNameList, updateColorNameList] = useState([]);
  const [menuStates, updateMenuStates] = useState({
    isMainMenuOpen: true,
    isHistoryMenuOpen: false,
    isSearchMenuOpen: false,
    isTopColorsMenuOpen: false,
    isHelpMenuOpen: false
  });

  useEffect(() => updateColorNameList(getInitialColorNameList()), []);

  const searchColorNames = e => {
    updateSearchInput(e.target.value);
    let newColorArr = [];
    let index = 0;
    while (newColorArr.length < 500 && index < namedColors.length) {
      if (
        namedColors[index].name
          .replace(/\s/g, "")
          .toLowerCase()
          .indexOf(e.target.value.replace(/\s/g, "").toLowerCase()) >= 0
      ) {
        newColorArr.push(namedColors[index]);
      }
      index++;
    }
    newColorArr.map(el => {
      el.contrast = getContrastColor(hexToRgb(el.hex));
      return el;
    });
    updateColorNameList(newColorArr);
  };

  const openColorHistory = () => {
    let newState = _.mapValues(menuStates, () => false);
    newState.isHistoryMenuOpen = true;
    updateMenuStates(newState);
  };

  const openTopColorsMenu = () => {
    let newState = _.mapValues(menuStates, () => false);
    newState.isTopColorsMenuOpen = true;
    updateMenuStates(newState);
  };

  const openColorSearch = () => {
    let newState = _.mapValues(menuStates, () => false);
    newState.isSearchMenuOpen = true;
    updateMenuStates(newState);
    setTimeout(() => document.getElementById("color-search").focus(), 100);
  };

  const openHelpMenu = () => {
    let newState = _.mapValues(menuStates, () => false);
    newState.isHelpMenuOpen = true;
    updateMenuStates(newState);
  };

  const closeSubMenu = () => {
    document.activeElement.blur();
    let newState = _.mapValues(menuStates, () => false);
    newState.isMainMenuOpen = true;
    updateMenuStates(newState);
  };

  return (
    <div id="sidebar" className={props.isOpen ? "" : "hidden"}>
      <div className="sidebar-content">
        <div
          className={
            "main-menu-items" + (menuStates.isMainMenuOpen ? "" : " hidden")
          }
        >
          <div className="secondary-main-menu">
            <div
              className="main-menu-item split-view"
              onClick={props.toggleSplitView}
            >
              <i className="icon fas fa-columns" />
              <span>Split View</span>
            </div>
          </div>
          {props.online && (
            <div className="online-menu-items">
              <div className="main-menu-item" onClick={openColorHistory}>
                <i className="icon fas fa-history" />
                <span>Color History</span>
              </div>
              <div className="main-menu-item" onClick={openTopColorsMenu}>
                <i className="icon fas fa-award" />
                <span>Most Popular</span>
              </div>
            </div>
          )}
          <div className="main-menu-item" onClick={openColorSearch}>
            <i className="icon fas fa-search" />
            <span>Search Colors</span>
          </div>
          <div className="main-menu-item" onClick={openHelpMenu}>
            <i className="icon fas fa-question-circle" />
            <span>What is this?</span>
          </div>
          <div className="footer-row">
            <a
              href="https://github.com/csandman/shade-generator"
              rel="noopener noreferrer"
              target="_blank"
            >
              <i className="icon fab fa-github" />
            </a>
          </div>
        </div>
        <div
          className={
            "sub-menu" + (menuStates.isHistoryMenuOpen ? "" : " hidden")
          }
        >
          <div onClick={closeSubMenu} className="sub-menu-header">
            <i className="icon fas fa-arrow-left" />
            <span>Color History</span>
          </div>
          <div className="sub-menu-content">
            <div className="menu-items">
              {props.menuItems.map((item, i) => {
                return (
                  <div
                    key={item.hex + i}
                    className="menu-item"
                    style={{ backgroundColor: item.hex }}
                    onClick={() => {
                      props.handleColorClick(item.hex, 1);
                      props.closeSidebar();
                    }}
                    data-hex={item.hex}
                  >
                    <div
                      className="color-name"
                      style={{ color: item.contrast }}
                      data-hex={item.hex}
                    >
                      {item.name}
                    </div>
                    <div
                      className="color-name"
                      style={{ color: item.contrast }}
                      data-hex={item.hex}
                    >
                      {item.hex}
                    </div>
                    <div
                      className="footer-left"
                      style={{ color: item.contrast }}
                    >
                      {item.dateString}
                    </div>
                    <div
                      className="footer-right"
                      style={{ color: item.contrast }}
                    >
                      {item.timeString}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div
          className={
            "sub-menu" + (menuStates.isTopColorsMenuOpen ? "" : " hidden")
          }
        >
          <div onClick={closeSubMenu} className="sub-menu-header">
            <i className="icon fas fa-arrow-left" />
            <span>Most Popular</span>
          </div>
          <div className="sub-menu-content">
            <div className="menu-items">
              {props.topColors.map((item, i) => {
                return (
                  <div
                    key={item.hex + i}
                    className="menu-item"
                    style={{ backgroundColor: item.hex }}
                    onClick={() => {
                      props.handleColorClick(item.hex, 1);
                      props.closeSidebar();
                    }}
                    data-hex={item.hex}
                  >
                    <div
                      className="color-name"
                      style={{ color: item.contrast }}
                      data-hex={item.hex}
                    >
                      {item.name}
                    </div>
                    <div
                      className="color-name"
                      style={{ color: item.contrast }}
                      data-hex={item.hex}
                    >
                      {item.hex}
                    </div>
                    <div
                      className="footer-left"
                      style={{ color: item.contrast }}
                      data-hex={item.hex}
                    >
                      {item.count} X
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div
          className={
            "sub-menu" + (menuStates.isSearchMenuOpen ? "" : " hidden")
          }
          id="color-search-menu"
        >
          <div onClick={closeSubMenu} className="sub-menu-header">
            <i className="icon fas fa-arrow-left" />
            <span>Search Colors</span>
          </div>
          <div className="search-input-container">
            <div className="search-icon-container">
              <i className="icon fas fa-search" />
            </div>
            <label htmlFor={"color-search"}>Color search</label>
            <input
              id="color-search"
              type="search"
              placeholder="Search..."
              value={searchInput}
              onChange={searchColorNames}
            />
          </div>

          <div className="sub-menu-content">
            <div className="menu-items">
              {colorNameList.map((color, i) => {
                return (
                  <div
                    key={color + i}
                    className="color-result-item"
                    style={{ background: color.hex, color: color.contrast }}
                    onClick={() => {
                      props.handleColorClick(color.hex, 1);
                      props.closeSidebar();
                    }}
                  >
                    {color.name}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div
          className={"sub-menu" + (menuStates.isHelpMenuOpen ? "" : " hidden")}
          id="color-search-menu"
        >
          <div onClick={closeSubMenu} className="sub-menu-header">
            <i className="icon fas fa-arrow-left" />
            <span>What is this?</span>
          </div>

          <div className="sub-menu-content">
            <section className="help-menu-content">
              <h4>Welcome to Shade Generator!</h4>
              <p>
                Shade generator is a project that started as a codepen a couple
                years ago. The idea behind it was simple, when you overlap a
                color with a transparent white or black section, you end up with
                a tint or shade of that color. As many people do in web
                development, I would often use this trick to create a
                contrasting color effect for button hovers or element borders.
                This got annoying because in order to make the effect work, I
                would need two elements on the screen for the overlap where I
                often only needed one. So, I decided to make a little tool to
                help me find the color codes for this resulting shade by giving
                me a variety of overlapping icons with the color I was plannibg
                on using as the background. However it was still not the most
                convenient because I had to use a chrome plugin called
                ColorZilla to get the actual code of the resulting color,
                however I could not think of a better way. Finally, after using
                this tool hundreds of times I finally thought, there must be
                some way to calculate this resulting color!
              </p>
              <p>
                After a quick google search, I found{" "}
                <a
                  href="https://www.viget.com/articles/equating-color-and-transparency/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  this link
                </a>
                . I immediately realized calculating the colors I wanted was
                possible with this very simple formula...
                
              </p>
              <p className="italic">to be continued...</p>
              <h4>Features</h4>
              <p>
                Throughout the process of making this website, I slowly started
                adding in some cool additional features. Some served a purpose,
                some just for fun.
              </p>
              <h5>Color Parser</h5>
              <p>
                One of the first things I added was the NPM package{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.npmjs.com/package/parse-color"
                >
                  parse-color
                </a>
                . It takes a string and parses it for its color values in many
                different formats. It can parse colors from hex values, rgb
                values, css named colors, and cymk formats. The result is an
                object that has the following components:
              </p>
              <ul>
                <li>rgb - an array of [ red, green, blue ]</li>
                <li>hsl - an array of [ hue, saturation, luminosity ]</li>
                <li>hsv - an array of [ hue, saturation, value ]</li>
                <li>cmyk - an array of [ cyan, magenta, yellow, blac(k) ]</li>
                <li>keyword - the name of the color, if known</li>
                <li>hex - the hex rgb string #rrggbb</li>
                <li>rgba - rgb plus an alpha value</li>
                <li>hsla - hsl plus an alpha value</li>
                <li>hsva - hsv plus an alpha value</li>
                <li>cmyka - cmyk plus an alpha value</li>
              </ul>
              <p>
                This was useful, not only to interpret input from the user but
                also for providing hex and rgb values, both of which are
                important to this app's functionality. After scrubbing the user
                input before passing it to this function, it does a great job of
                matching everything you'd expect it to!
              </p>
              <h5>Copy to Clipboard</h5>
              <p>
                The next main thing I added was the option to click to copy
                either the hex code or the rgb code to your clipboard. The first
                two things I tried were{" "}
                <code>document.execCommand("copy")</code> and{" "}
                <code>navigator.clipboard.write())</code>. Both of these options
                worked but I ran into issued with them working on all devices. I
                soon stumbled upon a nice small NPM package called{" "}
                <a
                  href="https://www.npmjs.com/package/clipboard-polyfill"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  clipboard-polyfill
                </a>
                . It is nice and compact and gave me a convenient way to ensure
                copying would work on all devices and browser the clipboard is
                accessible in!
              </p>
              <h5>Color Names</h5>
              <p>
                Now that the basic features were in place, it was time to have
                some fun! I decided that the page was a little too plain so I
                thought I would add some names for the colors. The first library
                I added for this is called{" "}
                <a
                  href="https://www.npmjs.com/package/color-namer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  color-namer
                </a>
                . It appealed to me because of the fact that it offered a
                combination of multiple lists of colors including CSS colors,
                X11, Pantone, and NTC.
              </p>
              <p>
                After running into some problems with this package (I can't
                quite remember what) I decided to keep looking around. Somehow I
                missed the amazing package{" "}
                <a
                  href="https://www.npmjs.com/package/color-name-list"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  color-name-list
                </a>
                . It contains a whopping 18,000+ (and growing) color list which
                combines over 15 different sources of color names along with
                thousands of user submission. While this list is massive, it
                still only contains 0.11% of the total possible RGB combinations
                so in order to match all colors so in order to match it to an
                input color, I used the package{" "}
                <a
                  href="https://www.npmjs.com/package/nearest-color"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  nearest-color
                </a>
                . This matches the color the user enters with the closest color
                from the list, and due to the magnitude of color-name-list, it's
                usually pretty damn close!
              </p>
              <h5>Random Colors</h5>
              <p>
                So now I have the main functionality I want and a little
                pizzazz, I realized I needed a faster way to test the app. So I
                decided the best way would be to add a random color generator.
                This may seem like it should have been an obvious thing to make
                from the start but it took me a while to realize it (I know,
                sometimes I'm thick). It took me all of 5 minutes to add it and
                get it going and it made a world of difference. Now when I'm
                looking for colors for a new website, I'll just hit random until
                something stands out to me. And I still get a kick out some of
                these names.
              </p>
              <h5>Color History</h5>
              <p>
                This was a feature that I added more for the experience than an
                it actually providing much value. I had been wanting to mess
                around with{" "}
                <a
                  href="https://firebase.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Firebase Firestore
                </a>
                , Google's real time noSQL database, for a while and this was
                the perfect excuse. I added a simple collection for storing the
                globally most recent colors that anyone has submitted, updating
                their timestamp every time it is used. I could not have been
                more happy with how easy it was to set up. It was so fast to set
                up in fact that I had the history sidebar up and running in one
                evening and soon after I added a section for the most used
                colors as well. If you are ever interested in quickly
                bootstrapping a project that requires storing data, I highly
                recommend giving Firebase a shot
              </p>
              <h5>Offline Capability</h5>
              <p className="italic">work in progress...</p>
              <h5>Split Screen</h5>
              <p className="italic">work in progress...</p>
            </section>
          </div>
        </div>
      </div>
      <div className="background" onClick={props.closeSidebar} />
    </div>
  );
};

export default Sidebar;

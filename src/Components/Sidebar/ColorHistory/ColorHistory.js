import React, { useState, useEffect } from "react";
import { withFirebase } from "../../Firebase";
import { useOnline } from "react-browser-hooks";


const ColorHistory = props => {
  const online = useOnline();
  const [recentColors, setRecentColors] = useState([]);

  const { firebase } = props;

  useEffect(() => {
    if (online) {
      firebase
        .colorHistory()
        .orderBy("timeAdded", "desc")
        .limit(40)
        .onSnapshot(querySnapshot => {
          let data = querySnapshot.docs.map(doc => {
            let out = doc.data();
            out.id = doc.id;
            return out;
          });
          setRecentColors(data);
          return true;
        });
    } else {
      console.log("offline detected");
    }
  }, [online, firebase]);

  return (
    <div className="menu-items">
    {recentColors.map((item, i) => {
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
  );
};

export default withFirebase(ColorHistory);

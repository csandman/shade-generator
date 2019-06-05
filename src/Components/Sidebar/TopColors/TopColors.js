import React, { useState, useEffect } from "react";
import { withFirebase } from "../../Firebase";
import { useOnline } from "react-browser-hooks";

const TopColors = props => {
  const online = useOnline();
  const [topColors, setTopColors] = useState([]);
  const { firebase } = props;

  useEffect(() => {
    if (online) {
      firebase
        .colorHistory()
        .orderBy("count", "desc")
        .limit(40)
        .onSnapshot(querySnapshot => {
          let data = querySnapshot.docs.map(doc => {
            let out = doc.data();
            out.id = doc.id;
            return out;
          });
          setTopColors(data);
          return true;
        });
    } else {
      console.log("offline detected");
    }
  }, [online, firebase]);

  return (
    <div className="menu-items">
      {topColors.map((item, i) => {
        return (
          <div
            key={item.hex + i}
            className="menu-item"
            style={{ backgroundColor: item.hex }}
            onClick={() => {
              props.closeSidebar();
              props.handleColorClick(item.hex, 1);
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
  );
};

export default withFirebase(TopColors);

import { useState, useEffect } from 'react';
import useOnline from 'hooks/use-online';
// import { useFirebase } from 'contexts/firebase-context';
import MenuItem from '../MenuItem/MenuItem';

const TopColors = ({ handleColorClick }) => {
  const online = useOnline();
  const [topColors, setTopColors] = useState([]);
  // const firebase = useFirebase();

  // useEffect(() => {
  //   if (online) {
  //     firebase
  //       .colorHistory()
  //       .orderBy('count', 'desc')
  //       .limit(40)
  //       .get()
  //       .then((querySnapshot) => {
  //         const data = querySnapshot.docs.map((doc) => {
  //           const out = doc.data();
  //           out.id = doc.id;
  //           return out;
  //         });
  //         setTopColors(data);
  //         return true;
  //       });
  //   } else {
  //     // console.log("offline detected");
  //   }
  // }, [online, firebase]);

  return (
    <div className="menu-items">
      {topColors.map((item, i) => {
        return (
          <MenuItem
            key={item.hex + i}
            item={item}
            color={item.hex}
            name={item.name}
            contrast={item.contrast}
            textBottomLeft={`${item.count} X`}
            onClick={handleColorClick}
          />
        );
      })}
    </div>
  );
};

export default TopColors;

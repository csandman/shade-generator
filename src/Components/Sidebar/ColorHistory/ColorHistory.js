import React, { useEffect } from 'react';
import { useOnline } from 'react-browser-hooks';
import MenuItem from '../MenuItem/MenuItem';
import { useLocalStorage } from '../../../Hooks';

const ColorHistory = ({ handleColorClick }) => {
  // const online = useOnline();
  const [recentColors, setRecentColors] = useLocalStorage('recentColors', []);

  // useEffect(() => {
  //   if (online) {
  //     firebase
  //       .colorHistory()
  //       .orderBy('timeAdded', 'desc')
  //       .limit(40)
  //       .get()
  //       .then(querySnapshot => {
  //         const data = querySnapshot.docs.map(doc => {
  //           const out = doc.data();
  //           out.id = doc.id;
  //           return out;
  //         });
  //         setRecentColors(data);
  //         return true;
  //       });
  //   } else {
  //     console.log('offline detected');
  //   }
  // }, [online, firebase]);

  return (
    <div className="menu-items">
      {recentColors.map((item, i) => {
        return (
          <MenuItem
            key={item.hex + i}
            item={item}
            color={item.hex}
            name={item.name}
            contrast={item.contrast}
            textBottomLeft={item.dateString}
            textBottomRight={item.timeString}
            onClick={handleColorClick}
          />
        );
      })}
    </div>
  );
};

export default ColorHistory;

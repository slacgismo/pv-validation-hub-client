'use client';
// *********** START OF IMPORTS ***********

import React, {useState} from 'react';

// *********** MODULE IMPORTS ***********

// *********** REDUX IMPORTS ***********

// *********** END OF IMPORTS ***********

const CustomGraphics = {
  useSvg: (color: string, name: string, key: string) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative inline-block"
        style={{overflow: 'visible'}}
        key={key}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          overflow="visible"
          className="transition duration-300 ease-in-out m-2 h-4">
          <circle r="50%" fill={color} />
        </svg>
        {isHovered && (
          <div
            className="absolute
          left-1/2
          transform
          -translate-x-1/2
          mt-2
          px-2
          py-1
          bg-black bg-opacity-75
          text-white
          text-sm
          rounded
          shadow-lg
          text-center"
            style={{bottom: '-50%'}}
          >
            {name}
          </div>
        )}
      </div>
    );
  },
};

export default CustomGraphics;

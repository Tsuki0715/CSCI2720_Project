import React from "react";
import { useEffect, useState } from "react";
import './SlideShowDisplay.css'

export default function Slideshow() {
  const data = [
    {path: "/Image/CantoneseOpera.jpg", description: "Cantonese Opera"},
    {path: "/Image/Orchestra.jpg", description: "Orchestra"},
    {path: "/Image/Concert.jpg", description: "Concert"},
    {path: "/Image/calligraphy.jpg", description: "Calligraphy Class"},
    {path: "/Image/Opera.jpg", description: "Opera"},
  ];
  const delay = 5000;

  // initialize the state.
  const [index, setIndex] = useState(0);
  const timeoutRef = React.useRef(null);

  function resetTimeout() {
    // this function resets the timeout interval, when the user clicks the button for next slide.
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  useEffect(() =>{
    resetTimeout();
    timeoutRef.current = setTimeout(
      () => setIndex((previousIndex)  => 
        previousIndex === data.length-1? 0 : previousIndex+1
      ), delay
  );

      return () => {
        resetTimeout();
      };
    }, [index, data.length]);

  return (
  <div className="slideshow-container">
    <div className="slideshow">
      <div className="slideshowSlider" style={{ transform: `translate3d(${-index * 100}%,0,0) `}}>
        {data.map((data, index) => (
          <img className="slide" key={index} src={data.path} alt={data.description} />
        ))}
      </div>

      <div className="slideshowDots">
        {data.map((_,currentindex) => (
          <div key={currentindex} className={`slideshowDot${index === currentindex? " active": ""}`}
          onClick={() => {
            setIndex(currentindex);
          }}></div>
        ))}
      </div>
    </div>
  </div>
  );
}

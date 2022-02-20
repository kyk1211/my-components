import React from "react";
import "./App.css";
import InfiniteCarousel from "./components/InfiniteCarousel";

function App() {
  return (
    <div className="App">
      <InfiniteCarousel autoPlay={true}>
        <img src="https://placeimg.com/400/400/any" alt="" />
        <img src="https://placeimg.com/400/400/any" alt="" />
        <img src="https://placeimg.com/400/400/any" alt="" />
        <img src="https://placeimg.com/400/400/any" alt="" />
      </InfiniteCarousel>
    </div>
  );
}

export default App;

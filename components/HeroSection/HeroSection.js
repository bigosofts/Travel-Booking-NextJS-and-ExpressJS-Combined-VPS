"use client";
import { useEffect } from "react";

function HeroSection(props) {
  

 
  
  useEffect(() => {
      import("../../assets/js/gsap.js");
  }, []);
  return (
    <main>
      <div className="container-parallax">
        <div className="vignette hide"></div>
        <img
          className="parallax bg-img"
          data-speedx="0.3"
          data-speedy="0.38"
          data-speedz="0"
          data-rotation="0"
          data-distance="-200"
          src="https://i.imgur.com/a4wnuYZ.png"
          alt=""
        />
        <img
          className="para-hidden parallax fog-7"
          data-speedx="0.27"
          data-speedy="0.32"
          data-speedz="0"
          data-rotation="0"
          data-distance="850"
          src="https://i.imgur.com/JFv2xKd.png"
          alt=""
        />
        <img
          className="para-hidden parallax mountain-10"
          data-speedx="0.195"
          data-speedy="0.305"
          data-speedz="0"
          data-rotation="0"
          data-distance="1100"
          src="https://i.imgur.com/CBR5jQK.png"
          alt=""
        />
        <img
          className="para-hidden parallax fog-6"
          data-speedx="0.25"
          data-speedy="0.28"
          data-speedz="0"
          data-rotation="0"
          data-distance="1400"
          src="https://i.imgur.com/NOYhXgl.png"
          alt=""
        />
        <img
          className="para-hidden parallax mountain-9"
          data-speedx="0.125"
          data-speedy="0.155"
          data-speedz="0.15"
          data-rotation="0.02"
          data-distance="1700"
          src="https://i.imgur.com/ro3lB5W.png"
          alt=""
        />
        <img
          className="para-hidden parallax mountain-8"
          data-speedx="0.1"
          data-speedy="0.11"
          data-speedz="0"
          data-rotation="0.02"
          data-distance="1800"
          src="https://i.imgur.com/lwrIxBe.png"
          alt=""
        />
        <img
          className="para-hidden parallax fog-5"
          data-speedx="0.16"
          data-speedy="0.105"
          data-speedz="0"
          data-rotation="0"
          data-distance="1900"
          src="https://i.imgur.com/DfqpMFM.png"
          alt=""
        />
        <img
          className="para-hidden parallax mountain-7"
          data-speedx="0.1"
          data-speedy="0.1"
          data-speedz="0"
          data-rotation="0.09"
          data-distance="2000"
          src="https://i.imgur.com/8ogQ7VV.png"
          alt=""
        />
        <div
          className="para-text text parallax"
          data-speedx="0.07"
          data-speedy="0.07"
          data-speedz="0"
          data-rotation="0.11"
          data-distance="0"
        >
          <h2 id="h2-text">Active</h2>
          <h1 id="h1-text">Ascents</h1>
        </div>
        <img
          className="para-hidden parallax mountain-6"
          data-speedx="0.065"
          data-speedy="0.05"
          data-speedz="0.05"
          data-rotation="0.12"
          data-distance="2300"
          src="https://i.imgur.com/b6Emkz2.png"
          alt=""
        />
        <img
          className="para-hidden parallax fog-4"
          data-speedx="0.135"
          data-speedy="0.120"
          data-speedz="0"
          data-rotation="0"
          data-distance="2400"
          src="https://i.imgur.com/tWnLOkG.png"
          alt=""
        />
        <img
          className="para-hidden parallax mountain-5"
          data-speedx="0.08"
          data-speedy="0.07"
          data-speedz="0.13"
          data-rotation="0.1"
          data-distance="2550"
          src="https://i.imgur.com/JLOyFwN.png"
          alt=""
        />
        <img
          className="para-hidden parallax fog-3"
          data-speedx="0.11"
          data-speedy="0.018"
          data-speedz="0"
          data-rotation="0"
          data-distance="2800"
          src="https://i.imgur.com/U6awYa2.png"
          alt=""
        />
        <img
          className="para-hidden parallax mountain-4"
          data-speedx="0.059"
          data-speedy="0.024"
          data-speedz="0"
          data-rotation="0.14"
          data-distance="3200"
          src="https://i.imgur.com/gYXzSum.png"
          alt=""
        />
        <img
          className="para-hidden parallax mountain-3"
          data-speedx="0.04"
          data-speedy="0.018"
          data-speedz="0.32"
          data-rotation="0.05"
          data-distance="3400"
          src="https://i.imgur.com/h3YArvZ.png"
          alt=""
        />
        <img
          className="para-hidden parallax fog-2"
          data-speedx="0.15"
          data-speedy="0.0115"
          data-speedz="0"
          data-rotation="0"
          data-distance="3600"
          src="https://i.imgur.com/XOs42TI.png"
          alt=""
        />
        <img
          className="para-hidden parallax mountain-2"
          data-speedx="0.035"
          data-speedy="0.013"
          data-speedz="0.42"
          data-rotation="0.15"
          data-distance="3800"
          src="https://i.imgur.com/nfFnk47.png"
          alt=""
        />
        <img
          className="para-hidden parallax mountain-1"
          data-speedx="0.027"
          data-speedy="0.018"
          data-speedz="0.53"
          data-rotation="0.2"
          data-distance="4000"
          src="https://i.imgur.com/ZjWzFGw.png"
          alt=""
        />
        <img
          className="para-hidden sun-rays hide"
          src="https://i.imgur.com/kALlNeh.png"
          alt=""
        />
        <img
          className="para-hidden black-shadow hide"
          src="https://i.imgur.com/WmDAnmc.png"
          alt=""
        />
        <img
          className="para-hidden parallax fog-1"
          data-speedx="0.12"
          data-speedy="0.01"
          data-speedz="0"
          data-rotation="0"
          data-distance="4200"
          src="https://i.imgur.com/ZkyWJhS.png"
          alt=""
        />
      </div>
    </main>
  );
}

export default HeroSection;

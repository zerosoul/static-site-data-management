import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Button } from "antd";
const Wrapper = styled.div`
  position: relative;
  background: #fff;
  .fsBtn {
    position: absolute;
    right: 0;
    top: 0;
  }
  .editor .w-e-text-container {
    height: 100vh !important;
  }
`;

const FullscreenWrapper = ({ children }) => {
  const block = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const handleFullscreen = () => {
    if (isFullscreen) {
      document.exitFullscreen();
    } else {
      block.current.requestFullscreen();
    }
  };
  useEffect(() => {
    block.current.onfullscreenchange = event => {
      let elem = event.target;
      let isFull = document.fullscreenElement === elem;
      setIsFullscreen(isFull);
      console.log("fs", isFull);
    };
    return () => {
      block.current.onfullscreenchange = null;
    };
  }, []);
  return (
    <Wrapper ref={block}>
      <Button
        icon={isFullscreen ? "fullscreen-exit" : "fullscreen"}
        onClick={handleFullscreen}
        className="fsBtn"
      />
      {children}
    </Wrapper>
  );
};

export default FullscreenWrapper;

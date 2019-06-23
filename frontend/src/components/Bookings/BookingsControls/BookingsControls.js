import React from "react";
import styled from "styled-components";
const Wrapper = styled.div`
  text-align: center;
  padding: 0.5rem;

  button {
    font: inherit;
    border: none;
    background: transparent;
    color: black;
    padding: 0.25rem 3rem;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    &.active {
      border-bottom-color: #5101d1;
      color: #5101d1;
    }
    &:focus {
      outline: none;
    }
  }
`;

const bookingsControl = props => {
  return (
    <Wrapper>
      <button
        className={props.activeOutputType === "list" ? "active" : ""}
        onClick={props.onChange.bind(this, "list")}
      >
        List
      </button>
      <button
        className={props.activeOutputType === "chart" ? "active" : ""}
        onClick={props.onChange.bind(this, "chart")}
      >
        Chart
      </button>
    </Wrapper>
  );
};

export default bookingsControl;

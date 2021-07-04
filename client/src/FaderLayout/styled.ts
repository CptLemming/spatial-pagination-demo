import styled, { css } from "styled-components";

export const FaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  cursor: pointer;
  position: relative;
  border-left: 1px solid #d3d3d3;

  &:hover ::after {
    position: absolute;
    content: "";
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: #000;
    opacity: 0.05;
    pointer-events: none;
  }
`;

export const FaderHeader = styled.div`
  background: #3a3a3a;
  color: #f4f4f4;
  text-align: center;
  font-size: 0.75em;
  user-select: none;
`;

export const FaderContent = styled.div<{
  $isLoaded?: boolean;
  $isSelected?: boolean;
}>`
  background: #f4f4f4;
  flex: 1;

  ${(p) =>
    !p.$isLoaded &&
    css`
      // Make it obvious this cell is not loaded
      background: #fe7452;
    `}
  ${(p) =>
    p.$isSelected &&
    css`
      background: #bce2fe;
    `}
`;

import styled, { css } from "styled-components";

export const FaderContainer = styled.div<{
  isFirstInUserArea: boolean;
  isLastInUserArea: boolean;
}>`
  display: flex;
  flex-direction: column;
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

  ${(p) =>
    p.isFirstInUserArea &&
    css`
      :before {
        position: absolute;
        content: " ";
        top: 0;
        left: 0;
        bottom: 0;
        border-left: 1px solid #a3a6a6;
      }
    `}

  ${(p) =>
    p.isLastInUserArea &&
    css`
      :before {
        position: absolute;
        content: " ";
        top: 0;
        right: 0;
        bottom: 0;
        border-right: 1px solid #a3a6a6;
      }
    `}
`;

export const FaderHeader = styled.div`
  background: #1c1f22;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.75em;
  user-select: none;
  height: 24px;
`;

export const FaderContent = styled.div<{
  $isLoaded?: boolean;
  $isSelected?: boolean;
}>`
  background: #fff;
  flex: 1;
  cursor: pointer;

  ${(p) =>
    !p.$isLoaded &&
    css`
      /* Make it obvious this cell is not loaded */
      background: #fe7452;
    `}
  ${(p) =>
    p.$isSelected &&
    css`
      background: #bce2fe;
    `}
`;

export const FaderLayer = styled.div<{
  rowIndex: number;
  isActive: boolean;
}>`
  display: flex;
  flex-direction: column;
  position: relative;
  background: ${(p) => (p.rowIndex % 2 === 0 ? "#1c1f22" : "#2e3033")};

  :before {
    position: absolute;
    content: " ";
    top: 3px;
    left: 3px;
    bottom: 3px;
    pointer-events: none;
    transition: border-color 250ms ease-in-out;
    border: 2px solid ${(p) => (p.isActive ? "#009ee3" : "transparent")};
  }
`;

export const LayerSublayer = styled.div<{
  sublayer: number;
}>`
  position: relative;
  flex: 1;

  :before {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    content: ${(p) => (p.sublayer === 0 ? "'A'" : "'B'")};
    height: 12px;
    width: 12px;
    right: 1px;
    font-weight: bold;
    background: ${(p) => (p.sublayer === 0 ? "#5ab424" : "#f1cc1d")};
    color: ${(p) => (p.sublayer === 0 ? "#262626" : "#262626")};
    border-radius: 3px;
    pointer-events: none;
    font-size: 0.6em;

    ${(p) =>
      p.sublayer === 0 &&
      css`
        top: 3px;
      `}
    ${(p) =>
      p.sublayer === 1 &&
      css`
        bottom: 3px;
      `}
  }

  :after {
    position: absolute;
    content: " ";
    right: 1px;
    pointer-events: none;
    border: 1px solid ${(p) => (p.sublayer === 0 ? "#5ab424" : "#f1cc1d")};

    ${(p) =>
      p.sublayer === 0 &&
      css`
        top: 3px;
        bottom: 12px;
      `}
    ${(p) =>
      p.sublayer === 1 &&
      css`
        top: 12px;
        bottom: 3px;
      `}
  }
`;

export const LayerNumber = styled.div<{
  isActive: boolean;
}>`
  display: flex;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 24px;
  height: 24px;
  font-weight: bold;
  align-items: center;
  justify-content: center;
  background: ${(p) => (p.isActive ? "#009ee3" : "#56595c")};
  transition: background-color 250ms ease-in-out;
  border-radius: 3px;
  color: #262626;
`;

const userSplitColours = ["#df3345", "#f26b30", "#f4c945"];
const userSplitText = ["#fff", "#000", "#000"];

export const UserSplit = styled.div<{
  userArea: number;
  isFirstInSection: boolean;
  isLastInSection: boolean;
}>`
  position: absolute;
  bottom: 0;
  font-size: 0.75rem;
  background: ${(p) => userSplitColours[p.userArea]};
  color: ${(p) => userSplitText[p.userArea]};
  border-radius: 3px;
  padding: 0 6px;
  white-space: nowrap;
  user-select: none;
  z-index: 1;

  ${(p) =>
    p.isFirstInSection &&
    css`
      left: 0;
    `}

  ${(p) =>
    p.isLastInSection &&
    css`
      right: 0;
    `}
`;

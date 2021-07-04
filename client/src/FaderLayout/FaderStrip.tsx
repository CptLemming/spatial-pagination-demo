import React, { memo } from "react";

import { FaderContainer, FaderHeader, FaderContent } from "./styled";

const FaderStrip = memo(({ data, columnIndex, rowIndex, style }: any) => {
  const faderId = `L${Math.floor(rowIndex / 2) + 1}F${columnIndex + 1}${
    rowIndex % 2 === 0 ? "" : "b"
  }`;
  const fader = data.faders[faderId];
  const isSelected = data.selected === faderId;

  return (
    <FaderContainer style={style} onClick={() => data.onSelect(faderId)}>
      <FaderHeader>{faderId}</FaderHeader>
      <FaderContent $isLoaded={!!fader} $isSelected={isSelected} />
    </FaderContainer>
  );
});

export default FaderStrip;

import React, { memo } from "react";

import { getFaderId } from "./utils";
import { FaderContainer, FaderHeader, FaderContent } from "./styled";

const FaderStrip = memo(({ data, columnIndex, rowIndex, style }: any) => {
  const faderId = getFaderId(columnIndex, rowIndex);
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

import React, { memo, useMemo } from "react";
import { areEqual } from "react-window";

import { FADER_HEIGHT } from "../config";
import { FaderLayer, LayerNumber, LayerSublayer } from "./styled";

const LayerStrip = ({ data, rowIndex, style }: any) => {
  const translateY = useMemo(() => {
    const topPosition = rowIndex * FADER_HEIGHT * 2;
    const bottomPosition = topPosition + FADER_HEIGHT * 2;
    const scrollTop = data.scrollPosition[1];
    const height = data.height;

    if (
      (bottomPosition > scrollTop &&
        bottomPosition + FADER_HEIGHT < scrollTop + height) ||
      (topPosition < scrollTop + height &&
        topPosition - FADER_HEIGHT > scrollTop)
    ) {
      if (topPosition + FADER_HEIGHT < scrollTop) {
        // Move down
        return `calc(20% + ${Math.min(
          scrollTop - (topPosition + FADER_HEIGHT),
          FADER_HEIGHT - 30
        )}px)`;
      } else if (bottomPosition - FADER_HEIGHT > scrollTop + height) {
        // Move up
        return `calc(-120% + -${Math.min(
          Math.abs(scrollTop + height - topPosition - FADER_HEIGHT),
          FADER_HEIGHT - 30
        )}px)`;
      }
    }

    return "calc(-50%)";
  }, [rowIndex, data.scrollPosition, data.height]);

  const isActive = data.selected?.startsWith(`L${rowIndex + 1}F`);

  return (
    <FaderLayer rowIndex={rowIndex} isActive={isActive} style={style}>
      <LayerSublayer sublayer={0} />
      <LayerSublayer sublayer={1} />
      <LayerNumber
        isActive={isActive}
        style={{
          transform: `translateY(${translateY}) translateX(-50%)`,
        }}
      >
        {rowIndex + 1}
      </LayerNumber>
    </FaderLayer>
  );
};

export default memo(LayerStrip, areEqual);

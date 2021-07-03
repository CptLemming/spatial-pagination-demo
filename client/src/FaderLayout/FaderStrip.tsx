import React, { memo } from "react";

const FaderStrip = memo(({ data, columnIndex, rowIndex, style }: any) => {
  const faderId = `L${Math.floor(rowIndex / 2) + 1}F${columnIndex + 1}${
    rowIndex % 2 === 0 ? "" : "b"
  }`;
  const fader = data.faders[faderId];

  // Display a temporary element before data has been fetched
  // Important: Must keep the styles here
  if (!fader) return <div style={style}>...</div>;

  return <div style={style}>{fader.id}</div>;
});

export default FaderStrip;

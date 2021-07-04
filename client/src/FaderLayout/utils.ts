import { Fader } from "../types";

export const range = (numItems: number): number[] =>
  new Array(numItems).fill(undefined).map((_, i) => i);

export const getFaderId = (columnIndex: number, rowIndex: number): string =>
  `L${Math.floor(rowIndex / 2) + 1}F${columnIndex + 1}${
    rowIndex % 2 === 0 ? "" : "b"
  }`;

/**
 * Calculate the smallest bounds required to fetch the new views worth of items
 */
export const getMoreFaders = (
  faders: Record<string, Fader>,
  x: number,
  y: number,
  dx: number,
  dy: number
): { x: number; y: number; dx: number; dy: number } => {
  const result = {
    x,
    y,
    dx,
    dy,
  };
  const numColumns = Math.abs(result.x - result.dx);
  const numRows = Math.abs(result.y - result.dy);

  const faderIds = Object.keys(faders);
  // Limit columns bounds
  let fetchColumns = range(numColumns).map((r) => r + result.x);
  for (let i = result.x; i < result.x + numColumns; i++) {
    let canRemoveColumn = true;
    for (let j = result.y; j < result.y + numRows; j++) {
      // Scan every fader in column
      const faderId = getFaderId(i, j);

      if (!faderIds.includes(faderId)) {
        canRemoveColumn = false;
        break;
      }
    }
    if (canRemoveColumn) {
      fetchColumns = fetchColumns.filter((col) => col !== i);
    }
  }

  result.dx = fetchColumns.length;
  result.x = fetchColumns.length === 0 ? result.x : Math.min(...fetchColumns);

  // Limit row bounds
  let fetchRows = range(numRows).map((r) => r + result.y);
  for (let i = result.y; i < result.y + numRows; i++) {
    let canRemoveRow = true;
    for (let j = result.x; j < result.x + numColumns; j++) {
      // Scan every fader in row
      // FIXME These result are repeated from above
      const faderId = getFaderId(j, i);

      if (!faderIds.includes(faderId)) {
        canRemoveRow = false;
        break;
      }
    }
    if (canRemoveRow) {
      fetchRows = fetchRows.filter((row) => row !== i);
    }
  }

  result.dy = fetchRows.length;
  result.y = fetchRows.length === 0 ? result.y : Math.min(...fetchRows);

  return result;
};

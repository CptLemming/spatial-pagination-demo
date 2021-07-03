import { Fader, Sublayer } from "./types";

export const filterFaders = (
  faders: Fader[],
  x: number,
  y: number,
  dx = 5,
  dy = 5
): Fader[] => {
  const filteredFaders: Fader[] = [];

  faders.forEach((fader) => {
    const faderLayer =
      (fader.layer - 1) * 2 + (fader.sublayer === Sublayer.A ? 0 : 1);
    if (
      fader.index >= x &&
      fader.index < x + dx &&
      faderLayer >= y &&
      faderLayer < y + dy
    ) {
      filteredFaders.push(fader);
    }
  });

  return filteredFaders;
};

import { NUM_LAYERS, NUM_FADERS, NUM_SUBLAYERS } from "../config";
import { Fader, Sublayer } from "../types";

const faders: Fader[] = [];

for (let l = 1; l <= NUM_LAYERS; l++) {
  for (let s = 0; s < NUM_SUBLAYERS; s++) {
    for (let f = 0; f < NUM_FADERS; f++) {
      faders.push({
        id: `L${l}F${f + 1}${s === 0 ? "" : "b"}`,
        index: f,
        layer: l,
        sublayer: s === 0 ? Sublayer.A : Sublayer.B,
      });
    }
  }
}

export default faders;

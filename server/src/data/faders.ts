import {
  NUM_LAYERS,
  NUM_SECTIONS,
  NUM_FADERS_IN_SECTION,
  NUM_SUBLAYERS,
} from "../config";
import { Fader, Sublayer } from "../types";

const faders: Fader[] = [];

for (let layer = 1; layer <= NUM_LAYERS; layer++) {
  for (let sublayer = 0; sublayer < NUM_SUBLAYERS; sublayer++) {
    for (let section = 0; section < NUM_SECTIONS; section++) {
      for (
        let faderNumber = 0;
        faderNumber < NUM_FADERS_IN_SECTION;
        faderNumber++
      ) {
        const fader = section * NUM_FADERS_IN_SECTION + faderNumber;
        faders.push({
          id: `L${layer}F${fader + 1}${sublayer === 0 ? "" : "b"}`,
          index: fader,
          layer: layer,
          sublayer: sublayer === 0 ? Sublayer.A : Sublayer.B,
          section,
        });
      }
    }
  }
}

export default faders;

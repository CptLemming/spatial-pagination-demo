import {
  NUM_LAYERS,
  NUM_SECTIONS,
  NUM_FADERS_IN_SECTION,
  NUM_SUBLAYERS,
} from "../config";
import { Config } from "../types";

const config: Config = {
  numFaders: NUM_SECTIONS * NUM_FADERS_IN_SECTION,
  numLayers: NUM_LAYERS,
  numSublayers: NUM_SUBLAYERS,
  numSections: NUM_SECTIONS,
};

export default config;

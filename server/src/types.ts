// TODO Move these to a common package
export type Config = {
  numFaders: number;
  numLayers: number;
  numSublayers: number;
};

export enum Sublayer {
  A = "A",
  B = "B",
}

export type Fader = {
  id: string;
  index: number;
  layer: number;
  sublayer: Sublayer;
};

export type Config = {
  numFaders: number;
  numLayers: number;
  numSublayers: number;
};

export enum Sublayer {
  A,
  B,
}

export type Fader = {
  id: string;
  index: number;
  layer: number;
  sublayer: Sublayer;
};

export type Config = {
  numFaders: number;
  numLayers: number;
  numSublayers: number;
  numSections: number;
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
  section: number;
};

export type UserSplit = {
  id: string;
  user: number;
  firstSection: number;
};

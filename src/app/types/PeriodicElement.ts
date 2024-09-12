// Only properties that are used in the app are included in the type.
// Actual objects have more properties.
export type PeriodicElement = {
  id: number;
  name: string;
  atomic_mass: number;
  category: string;
  number: number;
  period: number;
  group: number;
  phase: Phase;
  source: string;
  bohr_model_image: null | string;
  summary: string;
  symbol: string;
  xpos: number;
  ypos: number;
  image: Image;
};

export interface Image {
  title: string;
  url: string;
  attribution: string;
}

export enum Phase {
  Gas = 'Gas',
  Liquid = 'Liquid',
  Solid = 'Solid',
}

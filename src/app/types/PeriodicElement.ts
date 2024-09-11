export type PeriodicElement = {
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

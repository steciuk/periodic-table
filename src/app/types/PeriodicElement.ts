export type PeriodicElement = {
  name: string;
  atomic_mass: number;
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
  wxpos: number;
  wypos: number;
};

export enum Phase {
  Gas = 'Gas',
  Liquid = 'Liquid',
  Solid = 'Solid',
}

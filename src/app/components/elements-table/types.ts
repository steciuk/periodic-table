import { PeriodicElement } from '../../types/PeriodicElement';

export type PeriodicElementFilterMatches = {
  [key in keyof PeriodicElement]?: {
    stringValue: string;
    startIndex: number;
    endIndex: number;
  };
};

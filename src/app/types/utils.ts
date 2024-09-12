export type FilterMatches<T extends object> = {
  [key in keyof T]?: FilterMatch;
};

export type FilterMatch = {
  stringValue: string;
  startIndex: number;
  endIndex: number;
};

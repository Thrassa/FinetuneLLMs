export interface IDataset {
  id: string;
  name: string;
  path?: string;
  config: string;
  split: string;
  size: number;
  source: string;
  extension: string;
  numRows?: number;
  createdAt: Date;
  lastUpdatedAt: Date;
}

export interface AllJobOptions {
  baseModels: Array<string>;
  trainingMethods: Array<string>;
  datasets: Array<Record<string, any>>;
  hyperparameters: Record<string, string | number | boolean>;
}
export interface IEmbedDataState {
  url: string;
  saving: boolean;
}
export interface IEmbedData {
  state: IEmbedDataState;
  saveUrl: (url: string) => Promise<void>;
  setInitialData: () => Promise<void>;
}

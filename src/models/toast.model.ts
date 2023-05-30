type ToastType = 'success' | 'info' | 'warning' | 'error';
export interface ITastPayload {
  type: ToastType;
  title: string;
  message: string;
}

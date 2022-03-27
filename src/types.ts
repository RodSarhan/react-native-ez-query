export type TFetchParams = {
  key?: string;
  onError?: (error: any) => void;
  onSuccess?: (data: any) => void;
  showErrorAlert?: boolean;
  enableErrorSubmission?: boolean;
  onSubmitError?: (data: any) => void;
  isOneOfMultiple?: boolean;
};

export type TCombinedResponse = {
  [key: string]: any;
};

export type TUseFetchMultipleParams = {
  key?: string;
  callbacks: Record<string, (...params: any) => Promise<any>>;
  onError?: (error: any) => void;
  onSuccess?: (data: any) => void;
  showErrorAlert?: boolean;
  enableErrorSubmission?: boolean;
  onSubmitError?: (data: any) => void;
};

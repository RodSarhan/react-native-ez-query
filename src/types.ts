export type TFetchParams = {
  key?: string;
  onError?: (error: any) => void;
  onSuccess?: (data: any) => void;
  showErrorAlert?: boolean;
  enableErrorSubmission?: boolean;
  onSubmitError?: (data: any) => void;
  isOneOfMultiple?: boolean;
};

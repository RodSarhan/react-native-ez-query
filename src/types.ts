export type TFetchParams = {
  key: string;
  callback: (...args: any) => Promise<any>;
  onError?: (error: any) => void;
  onSuccess?: (data: any) => void;
  // showErrorAlert?: boolean;
  // enableErrorSubmission?: boolean;
  // onSubmitError?: (data: any) => void;
  // isOneOfMultiple?: boolean;
};

export type TCombinedResponse = {
  [key: string]: any;
};

export type TUseFetchMultipleParams = {
  key: string;
  callbacks: Record<
    string,
    {
      callback: (...params: any) => Promise<any>;
      onSuccess?: (data: any) => void;
    }
  >;
  onError?: (error: any) => void;
  onSuccess?: (data: any) => void;
  // showErrorAlert?: boolean;
  // enableErrorSubmission?: boolean;
  // onSubmitError?: (data: any) => void;
};

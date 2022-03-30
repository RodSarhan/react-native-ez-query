export type TCombinedResponse = {
  [key: string]: any;
};

export type TFetchParams =
  | {
      key: string;
      callback: (...args: any) => Promise<any>;
      onError?: ((error: any) => void) | 'alert' | 'throw';
      onSuccess?: (data: any) => any;
      onCancel?: () => void;
      onSubmitError: undefined;
    }
  | {
      key: string;
      callback: (...args: any) => Promise<any>;
      onError: 'alert-submit';
      onSuccess?: (data: any) => any;
      onCancel?: (...args: any) => void;
      onSubmitError: (data: any) => void;
    };

export type TUseFetchMultipleParams =
  | {
      key?: string;
      callbacks: Record<
        string,
        {
          name: string;
          callback: (...params: any) => Promise<any>;
        }
      >;
      onError?: ((error: any) => void) | 'alert' | 'throw';
      onSuccess?: (data: any) => any;
      onCancel?: () => void;
      onSubmitError: undefined;
    }
  | {
      key?: string;
      callbacks: Record<
        string,
        {
          name: string;
          callback: (...params: any) => Promise<any>;
        }
      >;
      onError: 'alert-submit';
      onSuccess?: (data: any) => any;
      onCancel?: (...args: any) => void;
      onSubmitError: (data: any) => void;
    };

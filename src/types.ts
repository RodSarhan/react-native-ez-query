export type CombinedResponse = {
  [key: string]: any;
};

export type StartParams<T> =
  | {
      key?: string;
      functionParams: T;
      onError?: ((error: any) => void) | 'alert' | 'throw';
      onSuccess?: (data: any) => any;
      onCancel?: () => void;
      onSubmitError: undefined;
      cancelOngoing?: boolean;
    }
  | {
      key?: string;
      functionParams: T;
      onError: 'alert-submit';
      onSuccess?: (data: any) => any;
      onCancel?: (...args: any) => void;
      onSubmitError: (data: any) => void;
      cancelOngoing?: boolean;
    };

export type FetchParams =
  | {
      key: string;
      callback: (...args: any) => Promise<any>;
      onError?: ((error: any) => void) | 'alert' | 'throw';
      onSuccess?: (data: any) => any;
      onCancel?: () => void;
      onSubmitError: undefined;
      cancelOngoing?: boolean;
    }
  | {
      key: string;
      callback: (...args: any) => Promise<any>;
      onError: 'alert-submit';
      onSuccess?: (data: any) => any;
      onCancel?: (...args: any) => void;
      onSubmitError: (data: any) => void;
      cancelOngoing?: boolean;
    };

export type UseFetchMultipleParams =
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

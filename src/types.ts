export type StartParams<T, U> =
    | {
          functionArgs: T;
          onError?: ((error: any) => void) | 'alert' | 'throw';
          onSuccess?: (data: U) => void;
          onCancel?: () => void;
          onSubmitError: undefined;
          cancelOngoing?: boolean;
          getAlertMessage?: (error: any) => string;
      }
    | {
          functionArgs: T;
          onError: 'alert-submit';
          onSuccess?: (data: U) => void;
          onCancel?: () => void;
          onSubmitError: (data: any) => void;
          cancelOngoing?: boolean;
          getAlertMessage?: (error: any) => string;
      };

/* eslint-disable no-shadow */
/* eslint-disable no-catch-shadow */
import { useRef, useState } from 'react';
// import { Alert } from 'react-native';
import type { TFetchParams, TNoQueryFetchParams } from './types';

export const useEzQuery = <T extends Array<any>, U>(
  asyncFunction?: (...args: T) => Promise<U>
) => {
  const abortControllers = useRef<Record<string, AbortController>>({});
  const abortReasons = useRef<Record<string, string | undefined>>({});

  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [success, setSuccess] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<Record<string, boolean>>({});

  const loadingRef = useRef<Record<string, boolean>>({});
  const successRef = useRef<Record<string, boolean>>({});
  const errorRef = useRef<Record<string, boolean>>({});

  const setIsLoading = (key: string, value: boolean) => {
    loadingRef.current = { ...loadingRef.current, [key]: value };
    setLoading(loadingRef.current);
  };

  const setIsError = (key: string, value: boolean) => {
    errorRef.current = { ...errorRef.current, [key]: value };
    setError(errorRef.current);
  };

  const setIsSuccess = (key: string, value: boolean) => {
    successRef.current = { ...successRef.current, [key]: value };
    setSuccess(successRef.current);
  };
  const abortRequest = (reason: 'refreshed' | 'canceled', key: string) => {
    abortControllers.current[key].abort();
    abortReasons.current[key] = reason;
    // eslint-disable-next-line no-undef
    abortControllers.current[key] = new AbortController();
  };

  const fetch = asyncFunction
    ? async ({
        key,
        functionParams,
        // showErrorAlert = true,
        // enableErrorSubmission,
        // onSubmitError = () => {},
        onError,
        onSuccess,
      }: TFetchParams & { functionParams: T }) => {
        if (loading[key]) {
          abortRequest('refreshed', key);
        } else {
          // eslint-disable-next-line no-undef
          abortControllers.current[key] = new AbortController();
        }
        setIsLoading(key, true);
        setIsSuccess(key, false);
        setIsError(key, false);
        const func = () => {
          return new Promise((resolve, reject) => {
            if (abortControllers.current[key].signal.aborted) {
              reject({
                message: 'canceled',
                reason: abortReasons.current[key],
              });
            }

            asyncFunction
              .apply(null, functionParams)
              .then((response) => {
                resolve(response);
              })
              .catch((error) => {
                reject(error);
              });
            //@ts-ignore
            abortControllers.current[key].signal.addEventListener(
              'abort',
              () => {
                reject({
                  message: 'canceled',
                  reason: abortReasons.current[key],
                });
              }
            );
          });
        };
        try {
          try {
            const response = await func();
            if (response) {
              setIsLoading(key, false);
              setIsSuccess(key, true);
              setIsError(key, false);
              if (onSuccess) {
                return onSuccess(response);
              } else {
                return response;
              }
            }
          } catch (error) {
            throw error;
          }
        } catch (error: any) {
          if (abortReasons.current[key] === 'refreshed') {
            abortReasons.current[key] = undefined;
          } else if (abortReasons.current[key] === 'canceled') {
            setIsLoading(key, false);
            abortReasons.current[key] = undefined;
          } else {
            setIsLoading(key, false);
            setIsSuccess(key, false);
            setIsError(key, true);
            if (onError) {
              onError(error);
            }
            // else if (showErrorAlert) {
            //   Alert.alert(
            //     'Encountered an error',
            //     error.message,
            //     enableErrorSubmission
            //       ? [
            //           {
            //             text: 'Submit Error',
            //             onPress: () => onSubmitError(error),
            //           },
            //           { text: 'Close', onPress: () => {}, style: 'cancel' },
            //         ]
            //       : undefined
            //   );
            // }
          }
        }
      }
    : async ({
        key,
        asyncFunction,
        onError,
        onSuccess,
      }: TNoQueryFetchParams) => {
        if (loading[key]) {
          abortRequest('refreshed', key);
        } else {
          // eslint-disable-next-line no-undef
          abortControllers.current[key] = new AbortController();
        }
        setIsLoading(key, true);
        setIsSuccess(key, false);
        setIsError(key, false);
        const func = () => {
          return new Promise((resolve, reject) => {
            if (abortControllers.current[key].signal.aborted) {
              reject({
                message: 'canceled',
                reason: abortReasons.current[key],
              });
            }

            asyncFunction()
              .then((response: any) => {
                resolve(response);
              })
              .catch((error: any) => {
                reject(error);
              });
            //@ts-ignore
            abortControllers.current[key].signal.addEventListener(
              'abort',
              () => {
                reject({
                  message: 'canceled',
                  reason: abortReasons.current[key],
                });
              }
            );
          });
        };
        try {
          try {
            const response = await func();
            if (response) {
              setIsLoading(key, false);
              setIsSuccess(key, true);
              setIsError(key, false);
              if (onSuccess) {
                return onSuccess(response);
              } else {
                return response;
              }
            }
          } catch (error) {
            throw error;
          }
        } catch (error: any) {
          if (abortReasons.current[key] === 'refreshed') {
            abortReasons.current[key] = undefined;
          } else if (abortReasons.current[key] === 'canceled') {
            setIsLoading(key, false);
            abortReasons.current[key] = undefined;
          } else {
            setIsLoading(key, false);
            setIsSuccess(key, false);
            setIsError(key, true);
            if (onError) {
              onError(error);
            } else {
              throw error;
            }
          }
        }
      };

  return {
    fetch,
    cancel: (key: string) => abortRequest('canceled', key),
    isLoading: (key: string) => loading[key],
    isSuccess: (key: string) => success[key],
    isError: (key: string) => error[key],
  };
};

/* eslint-disable no-shadow */
/* eslint-disable no-catch-shadow */
import { useRef, useState } from 'react';
import { Alert } from 'react-native';
import type { TStartParams } from './types';
// import { Alert } from 'react-native';

export const useEzQuery = <ArgsType extends any[]>(
  callback: (...args: ArgsType) => Promise<any>
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
  const abortRequest = (reason: 'duplicate' | 'canceled', key: string) => {
    abortControllers.current[key].abort();
    abortReasons.current[key] = reason;
    // eslint-disable-next-line no-undef
    abortControllers.current[key] = new AbortController();
  };

  const start = async ({
    key = 'default',
    functionParams,
    onError,
    onSuccess,
    onSubmitError,
    onCancel,
    cancelOngoing = true,
  }: TStartParams<ArgsType>) => {
    if (loading[key] && cancelOngoing) {
      abortRequest('duplicate', key);
    } else {
      // eslint-disable-next-line no-undef
      abortControllers.current[key] = new AbortController();
    }
    setIsLoading(key, true);
    setIsSuccess(key, false);
    setIsError(key, false);
    const func = async () => {
      return new Promise((resolve, reject) => {
        if (abortControllers.current[key].signal.aborted) {
          reject({
            message: 'canceled',
            reason: abortReasons.current[key],
          });
        }

        callback(...functionParams)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });

        //@ts-ignore
        abortControllers.current[key].signal.addEventListener('abort', () => {
          reject({
            message: 'canceled',
            reason: abortReasons.current[key],
          });
        });
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
      if (abortReasons.current[key] === 'duplicate') {
        abortReasons.current[key] = undefined;
      } else if (abortReasons.current[key] === 'canceled') {
        setIsLoading(key, false);
        abortReasons.current[key] = undefined;
        if (onCancel) {
          onCancel();
        }
      } else {
        setIsLoading(key, false);
        setIsSuccess(key, false);
        setIsError(key, true);
        if (onError === 'throw') {
          throw error;
        }
        if (onError === 'alert' || onError === 'alert-submit') {
          Alert.alert(
            'Encountered an error',
            error.message,
            onError === 'alert-submit'
              ? [
                  {
                    text: 'Submit Error',
                    onPress: () => {
                      onSubmitError ? onSubmitError(error) : () => {};
                    },
                  },
                  { text: 'Close', onPress: () => {}, style: 'cancel' },
                ]
              : undefined
          );
        } else if (onError) {
          onError(error);
        }
      }
    }
  };

  return {
    start,
    cancel: (key: string = 'default') => abortRequest('canceled', key),
    isLoading: (key: string = 'default') => loading[key],
    isSuccess: (key: string = 'default') => success[key],
    isError: (key: string = 'default') => error[key],
  };
};

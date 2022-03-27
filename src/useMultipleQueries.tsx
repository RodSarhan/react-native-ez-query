/* eslint-disable no-shadow */
/* eslint-disable no-catch-shadow */
import { useRef, useState } from 'react';
import { Alert } from 'react-native';
import type { TCombinedResponse, TUseFetchMultipleParams } from './types';

export const useMultipleQueries = () => {
  const abortControllers = useRef<Record<string, AbortController>>({
    // eslint-disable-next-line no-undef
    default: new AbortController(),
  });
  const abortReasons = useRef<Record<string, string | undefined>>({
    default: undefined,
  });
  const [loading, setLoading] = useState<Record<string, boolean>>({
    default: false,
  });
  const loadingRef = useRef<Record<string, boolean>>({ default: false });
  const [success, setSuccess] = useState<Record<string, boolean>>({
    default: false,
  });
  const successRef = useRef<Record<string, boolean>>({ default: false });
  const [error, setError] = useState<Record<string, boolean>>({
    default: false,
  });
  const errorRef = useRef<Record<string, boolean>>({ default: false });

  const isLoading = (key: string = 'default') => {
    return loading[key];
  };

  const isSuccess = (key: string = 'default') => {
    return success[key];
  };

  const isError = (key: string = 'default') => {
    return error[key];
  };

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
  const abortRequest = (
    reason: 'refreshed' | 'canceled',
    key: string = 'default'
  ) => {
    abortControllers.current[key].abort();
    abortReasons.current[key] = reason;
    // eslint-disable-next-line no-undef
    abortControllers.current[key] = new AbortController();
  };

  const fetchMultiple = async ({
    callbacks,
    onError,
    onSuccess,
    showErrorAlert = true,
    key = 'default',
    enableErrorSubmission,
    onSubmitError = () => {},
  }: TUseFetchMultipleParams) => {
    if (isLoading(key)) {
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
        const names = Object.keys(callbacks);
        let combinedResponse: TCombinedResponse = {};
        Promise.all(
          names.map(async (name) => {
            let response = await callbacks[name]();
            combinedResponse[name] = response;
          })
        )
          .then(() => {
            resolve(combinedResponse);
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
        } else if (showErrorAlert) {
          Alert.alert(
            'Encountered an error',
            error.message,
            enableErrorSubmission
              ? [
                  {
                    text: 'Submit Error',
                    onPress: () => onSubmitError(error),
                  },
                  {
                    text: 'Close',
                    onPress: () => {},
                    style: 'cancel',
                  },
                ]
              : undefined
          );
        }
      }
    }
  };

  return {
    fetchMultiple,
    cancel: (key?: string) => abortRequest('canceled', key),
    isLoading,
    isSuccess,
    isError,
  };
};

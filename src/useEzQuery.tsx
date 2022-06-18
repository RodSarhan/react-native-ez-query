import { useCallback, useRef, useState } from 'react';
import { Alert } from 'react-native';
import type { StartParams } from './types';

export const useEzQuery = <ArgsType extends any[], ResponseType>(
    callback: (...args: ArgsType) => Promise<ResponseType>
) => {
    const abortControllerCancel = useRef<AbortController>(
        // eslint-disable-next-line no-undef
        new AbortController()
    );
    const abortControllerDuplicate = useRef<AbortController>(
        // eslint-disable-next-line no-undef
        new AbortController()
    );

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

    const abortRequest = (reason: 'duplicate' | 'canceled') => {
        reason === 'canceled'
            ? abortControllerCancel.current.abort()
            : abortControllerDuplicate.current.abort();

        // eslint-disable-next-line no-undef
        abortControllerCancel.current = new AbortController();
        // eslint-disable-next-line no-undef
        abortControllerDuplicate.current = new AbortController();
    };

    const runAsync = useCallback(
        async (functionArgs: ArgsType): Promise<ResponseType> => {
            return new Promise((resolve, reject) => {
                if (abortControllerCancel.current.signal.aborted) {
                    reject({
                        message: 'canceled',
                        reason: 'canceled',
                    });
                }
                if (abortControllerDuplicate.current.signal.aborted) {
                    reject({
                        message: 'canceled',
                        reason: 'duplicate',
                    });
                }

                callback(...functionArgs)
                    .then((response) => {
                        resolve(response);
                    })
                    .catch((error) => {
                        reject(error);
                    });

                //@ts-ignore
                abortControllerCancel.current.signal.addEventListener(
                    'abort',
                    () => {
                        reject({
                            message: 'canceled',
                            reason: 'canceled',
                        });
                    }
                );
                //@ts-ignore
                abortControllerDuplicate.current.signal.addEventListener(
                    'abort',
                    () => {
                        reject({
                            message: 'canceled',
                            reason: 'duplicate',
                        });
                    }
                );
            });
        },
        [callback]
    );

    const start = async ({
        functionArgs,
        onError,
        onSuccess,
        onSubmitError,
        onCancel,
        cancelOngoing = true,
        getAlertMessage = (error) => {
            return error.message;
        },
    }: StartParams<ArgsType, ResponseType>): Promise<
        ResponseType | undefined | void
    > => {
        if (isLoading && cancelOngoing) {
            abortRequest('duplicate');
        } else {
            // eslint-disable-next-line no-undef
            abortControllerCancel.current = new AbortController();
        }
        setIsLoading(true);
        setIsSuccess(false);
        setIsError(false);

        try {
            try {
                const response = await runAsync(functionArgs);
                if (response) {
                    setIsLoading(false);
                    setIsSuccess(true);
                    setIsError(false);
                    if (onSuccess) {
                        onSuccess(response);
                    }
                    return response;
                }
            } catch (error) {
                throw error;
            }
        } catch (error: any) {
            if (error.reason === 'duplicate') {
            } else if (error.reason === 'canceled') {
                setIsLoading(false);
                if (onCancel) {
                    onCancel();
                }
            } else {
                setIsLoading(false);
                setIsSuccess(false);
                setIsError(true);
                if (onError === 'throw') {
                    throw error;
                }
                if (onError === 'alert' || onError === 'alert-submit') {
                    Alert.alert(
                        'Encountered an error',
                        getAlertMessage(error),
                        onError === 'alert-submit'
                            ? [
                                  {
                                      text: 'Submit Error',
                                      onPress: () => {
                                          onSubmitError
                                              ? onSubmitError(error)
                                              : () => {};
                                      },
                                  },
                                  {
                                      text: 'Close',
                                      onPress: () => {},
                                      style: 'cancel',
                                  },
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
        cancel: () => abortRequest('canceled'),
        isLoading,
        isSuccess,
        isError,
    };
};

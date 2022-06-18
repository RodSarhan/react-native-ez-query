# react-native-ez-query

React Native EZ Query helps adding stateful logic to our api calls or any other async function such as loading state, success and error states, as well as easily canceling ongoing requests.

## Installation

```sh
npm install react-native-ez-query
```

```sh
yarn add react-native-ez-query
```

### Supports React Native >= 0.60

---

## Usage

## 1) useEzQuery

This hook takes any async function callback as an argument and returns an object containing the following props:


1. start - takes an object that includes the arhuments passed to the async function, alongside other customizations:
   ```javascript
        {
            functionArgs: T; //array of the arguments that will be passed to the async function
            onError?: ((error: any) => void) | 'alert' | 'alert-submit' | 'throw'; //will be called on error
            onSuccess?: (data: U) => void; //will be called on success
            onCancel?: () => void; //will be called after manual cancelation
            onSubmitError: (error: any) => void; // will be called if onError is set to 'alert-submit' 
            cancelOngoing?: boolean; //will cancel the previous request if start is called again before the last one finishes
            getAlertMessage?: (error: any) => string; //customize the alert message when onError is set to 'alert' or 'alert-submit'
        }
   
   ```

<br>

2. cancel - cancels the ongoing async function.

<br>

1. isLoading - boolean for loading state.

<br>

4. isError - boolean for error state of the last request

<br>

5. isSuccess - boolean for success state of the last request

---

The passed async callback should be of a function that returns the needed response, or throws an error.

The return of start will be undefined if the request fails, and onError is not set to 'throw'

The start function will not throw an error unless that's specified in onError prop.


## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
```

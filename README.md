# react-native-ez-query

React Native EZ Query helps adding stateful logic to our api calls or any other async function such as loading state, success and error states, as well as easily canceling ongoing calls and combining multiple async functions.

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

This hook takes any async function callback as an argument and returns and object that contains the following

1. start - takes an object that includes the parameters for the api fetch function, alongside other customizations that are mentioned below such as: onError, onSuccess, etc.

<br>

2. cancel - invoking this function cancels the ongoing async function.

<br>

3. isLoading - a function that return a boolean for loading states.

<br>

4. isError - a function that returns true if the last request was an error

<br>

5. isSuccess - a function that returns true if the last request was an error

---

The passed callback should be of a function that returns the needed response, and is able to throw an error.

Calling fetch again with the same key when it's already loading will cancel the first one and start a new one.

The return of a fetch will be undefined if the fetch fails, therefore checking for defined value is enough to determine that the fetch is done (we can still customize error handling if we decide to).

The fetch function will not throw an error unless that's specified in onError prop.

The fetch returns the response by default but if onSuccess is specified then its return will be the final return of the fetch.

```javascript
const getSomething = useEzQuery(postRequestFetchSomething);
```

Now inside our component or custom hook we can do the following

###### Note: all of those are optional excpet functionParams

```javascript
const something = await getSomething.start(
    {
        key:"byMonth" //this prop is not required, it's safer if provided as it allows to use the same query with different params
                        // without sharing the state (or cancelations) between diffrent fetches that use the same async function

        functionParams:[token, payload], /*required*/ //aray of params that will be passed to the function [] if none

        onSuccess:(response)=>{doSomething; return response}, // any value returned here will be the return of the entire fetch

        onCancel: ()=>{} // will be triggered when fetcher.cancel(key) is called

        onError: //"throw" or "alert" or "alert-submit" or a callback (error)=>{doSomething(error)}, error object will be the error thrown by the first fetch that fails

        onSubmitError:(error)=>{doSomething(error)} //only accessible and required if onError is set to "alert-submit"

     })
```

To access the loading, error, success states, or cancel function we can do the following

```javascript
getSomething.isLoading(); //key will default to "default"
getSomething.cancel();
```

If key is specified, then we can access the state of that specific key like this

```javascript
getSomething.isLoading('byMonth'); //this will return the loading state of the fetch that has this specific key
getSomething.cancel('byMonth'); //this will not cancel other calls to the same api that have no key or different key
```

## 2) useFetcher

Fetcher can be used for generic fetch purposes as can dynamically pass any async function when starting the fetch
useFetcher returns (isLoading, isSuccess, isError, cancel), alongside fetch and fetchMultiple functions.

Example for fetch:

```javascript
const fetcher = useFetcher();
```

```javascript
fetcher.fetch({
    /*required*/
    key:"some fetch", //fetches of the same key share the same state and cancel function
    /*rquired*/
    callback:() => someAsyncFunction(), //this can be any async function

    onSuccess: (response)=>{}, // if specified, this is called when fetch is done
                                        // the return value of this will be the final returned value
    onCancel: ()=>{}, // will be triggered when fetcher.cancel(key) is called

    onError: //"throw" or "alert" or "alert-submit" or a callback (error)=>{doSomething(error)}, error object will be the error thrown by the first fetch that fails

    onSubmitError:(error)=>{doSomething(error)} //only accessible and required if onError is set to "alert-submit"
});

```

Example for fetchMultiple:

```javascript
const fetcher = useFetcher();
```

```javascript
fetcher.fetchMultiple({
        /*required*/
    key:"some fetch", //fetches of the same key share the same state and cancel function
    /*rquired*/
    callbacks:{
        {
            name:someName, //this will be the prop name that has the retured value in the combined response object
            callback:() => someAsyncFunction() //this can be any async function
        },
        {
            name:anotherName, //this will be the prop name that has the retured value in the combined response object
            callback:() => anotherAsyncFunction() //this can be any async function
        }
    },
    onSuccess: (combinedResponse)=>{}, // if specified, this is called when all fetches are done
                                        // the return value of this will be the final returned value

    onCancel: ()=>{} // will be triggered when fetcher.cancel(key) is called

    onError: //"throw" or "alert" or "alert-submit" or a callback (error)=>{doSomething(error)}, error object will be the error thrown by the first fetch that fails

    onSubmitError:(error)=>{doSomething(error)} //only accessible and required if onError is set to "alert-submit"
});

//returned object will have this shape
{
   someName: //response from someAsyncFunction,
   anotherName: //response from anotherAsyncFunction
}
```

I currently use those hooks by creating other custom hooks that uses them and return the state and a customized fetch function.

Combining EZ Query with React's useContext and custom hooks has helped me get rid of long pieces of code that i used for
canceling functions, deduplicating them, and tracking their success and loading states, so i hope it can be of use to others.

```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
```

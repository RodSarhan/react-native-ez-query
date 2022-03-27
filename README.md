# react-native-ez-query

React Native EZ Query helps adding stateful logic to your api calls or any other async function such as loading state, success and error states, as well as easily canceling ongoing calls and combining multiple async functions.

## Installation

```sh
npm install react-native-ez-query
```
```sh
yarn add react-native-ez-query
```

## Usage


## 1) Generic (useEzQuery)
This hook takes any async function callback as an argument and returns and object that contains the following
1. fetch - takes an object that includes the parameters for the api fetch function, alongside other customizations that are mentioned below
---
2. cancel - invoking this function cancels the ongoing async function
---
3. isLoading - a function that return a boolean for loading states
---
4. isError - a function that returns true if the last request was an error
---
5. isSuccess - a function that returns true if the last request was an error
---

The passed callback should be of a function that returns the needed response, and is able to throw an error.

Calling fetch again with the same key when it's already loading will cancel the first one and start a new one

The return of a fetch will be undefined if the fetch fails, therefore checking for defined value is enough to determine that the fetch is done (we can still customize error handling if we decide to)

```javascript
const getSomething = useEzQuery(postRequestFetchSomething)
```
Now inside our component or custom hook we can do the following
```javascript
const something = await getSomething.fetch()
```
we can also pass optional customizations or params for the async function

######Note: all of those are optional excpet functionParams
```javascript
const something = await getSomething.fetch(
    {
        functionParams:[token, payload], //aray of params that will be passed to the function [] if none
        
        onSuccess:(response)=>{doSomething; return response}, // any value returned here will be the return of the entire fetch
        
        onError:(error)=>{console.log(error)},    // if onError is provided, it will override any other error customizations
                                                // such as enableErrorSubmission, onSubmitError, and showErrorAlert, isOneOfMultiple
       
        showErrorAlert:true, //is on by default and shows an error alert when the fetch fails
        
        enableErrorSubmission:true, // is off by default but can be enabled to show a submit error button
        
        onSubmitError: (error)=>{doSomethingWithError(error)}, // this will be invoked  when submit error is pressed and the above
                                                              // alert related props are enabled
        
        key:"byMonth" //this prop is not needed, but if provided it allows to use the same api with different params
                        // without sharing the state between diffrent fetches of the same api 
        
        isOneOfMultiple:false // is off by default, turning it on disables error handling (except onError) and just throws an error
                              // this prop is used to throw and error so that fetchMultipleApi can take care of it
     })
```
(Most used) To access the loading, error, success states, or cancel function we can do the following
```javascript
getSomething.isLoading()
getSomething.cancel()
```
(Rarely needed) If key prop is specified, then we can access the state of that specific key like this
```javascript
getSomething.isLoading("byMonth") //this will return the loading state of the fetch that has this specific key
getSomething.cancel("byMonth") //this will not cancel other calls to the same api that have no key or different key
```

## 2) Multiple Api (useMultipleQueries)
This allows us to call multiple APIs at the same time and combine their response in one obejct, it will fail if one of the fetches fail, and will return a combined response if all the fetches are successful

Example: 
```javascript
const getMultpleApis = useMultipleQueries()
```
```javascript
getMultpleApis.fetchMultiple({
        callbacks:{
            something:() => getSomething.fetch() //this can be any async function
            
            somethingElse :() => somethingElse({id:5}) //this can be any async function
        },
        onSuccess: (combinedResult)=>{}, // if specified, this is invoked when all fetches are done and the return of this will be 
                                        //the return of the entire fetch
        onError:(error)=>{}, //the error it recieves will be the error of the first fetch that fails, but we can handle it or 
                            //do whatever we want

        //also includes the same props as useEzQuery
});
```
Best usage is to create a custom hook that uses many api hooks and returns them all under one object like useStuffFetcher which includes some related apis, we can use the resulting hook inside any component or hook to have access to those functions and states
Example file:
```javascript

export const useStuffFetcher = () => {

    const getSomething = useEzQuery(getSomethingAsyncFunction)
    const getThings = useEzQuery(getThingsAsyncFunction)
    const getStuff = useEzQuery(getStuffAsyncFunction)

    return {
        getSomething,
        getThings,
        getStuff,
    }
};

```
Now by importing and using useStuffFetcher inside a hook or a component, we will be able to fetch and keep track of the state of all those api requests
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

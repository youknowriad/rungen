Generator Runtime Experiment
============================

This is just an experiment, not meant to be used in prod.
The idea is the ability to create a generic runtime to handle async flow.
Something like [co](https://github.com/tj/co) but more generic.

Generic ?
---------

Co handles automatically promises, iterators, arrays etc..., the idea of genericity here is the ability to perform a custom process on any value depending on your needs.
We call these custom processes : controls.

So by default, the runtime has basically the same behaviour as co but you can add more yieldable values by creating custom controls.

How to create a control ?
-------------------------

A control is an object with two methods : match and resolve :
 * The *match* function   : returns true if the current control can resolve this yieldable value passed as argument.
 * The *resolve* function : has this signature `(value, next, runtime, raise, yieldNext) => void` is responsible of handling this yieldable value using one of the different callbacks passed as arguments :
   * the `next` callback : we call this with a resolved value, when we handled the current value and we have no idea about the result
   * the `raise` callback : called to trigger an error (catched using try/catch in the generator)
   * the `runtime` callback : we call this when the resolved value is a generator (or iterator) (nesting)
   * the `yieldNext` callback : is some sort of a shortcut to avoid infinite loops. This is not used so much, but can be usefull for example in the arrayControl which takes an array and yields an array as a result

Usage
-----

```javascript
const customControls = []
import {createRuntime} from './runtime';
const runtime = createRuntime(customControls)
runtime(function*() {
   yield 'myvalue'
})
```

Saga
----

I used this generic mecanisme to create something similar to [redux-saga](https://github.com/yelouafi/redux-saga)

Trying
------

There's two examples in the repo, you can run easily using [run-js](https://github.com/remixz/run-js)

```shell
npm install babel-preset-es2015 babel-preset-stage-0
npm install -g run-js && run-js
```

 * [http://localhost:60274](localhost:60274) for the default example
 * [http://localhost:60274/redux.html](localhost:60274) for the redux example

Then check the console for the output
RunGen
======

This library provides a generic runtime around async flow in javascript
This provides something like [co](https://github.com/tj/co) but more generic, with the ability to extend its behaviour.
This also largely inspired from [redux-saga](https://github.com/yelouafi/redux-saga). It started from the idea of decoupling redux-saga from redux.

Generic ?
---------

Co allows to you to wrap generators that yields automatically promises, iterators, arrays etc... The idea of genericity here is the ability to perform a custom process on any value depending on your needs.
We call these custom processes : controls.
So by default, the runtime has basically the same behaviour as co but you can add more yieldable values by creating custom controls.

How to create a control ?
-------------------------

A control is an function with the following signature `(value, next) => bool`
 * the function returns a boolean whether or not, it handles the yielded value passed as argument
 * Once the value has been resolved, It should call the `next` callback with the result

While this should be fine for almost all custom controls use cases, there are some cases when you would need to call some specific callbacks.
The full signature of the control is : `(value, next, iterate, yieldNext, yieldError) => bool`
   * the `next` callback : we call this with a resolved value, when we handled the current value and we have no idea about the result (like promises)
   * the `iterate` callback : we call this when the resolved value is a generator (or iterator) (nesting)
   * the `yieldNext` callback : is a shortcut to avoid infinite loops, it directly yields the resolved value without trying to resolve it as well. This can be usefull to avoid infinte loops, for example in an arrayControl takes an array and yields an array as a result
   * the `yieldError` callback : called to trigger an error (that can be catched using try/catch in the generator)

Usage
-----

```javascript
const customControls = []
import {create} from 'rungen';
const runtime = create(customControls)
runtime(function*() {
   yield 'myvalue'
})
```
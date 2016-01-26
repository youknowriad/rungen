// Helpers
const TYPE_CALL = 'call'
const TYPE_FORK = 'fork'

export const call = (context, callback, ...args) => ({
  type : TYPE_CALL,
  context: context,
  callback: callback,
  args: args
})

export const fork = (iterator, ...args) => ({
  type: TYPE_FORK,
  iterator: iterator,
  args: args
})

// Utils
const is = {
  array    : Array.isArray,
  func     : value => typeof value === 'function',
  promise  : value => value && is.func(value.then),
  iterator : value => value && is.func(value.next) && is.func(value[Symbol.iterator]),
  call     : value => typeof value === 'object' && value.type === TYPE_CALL,
  fork     : value => typeof value === 'object' && value.type === TYPE_FORK,
}

// Default Controls
const arrayControl = {
  match: is.array,
  resolve: (value, runtime, next, raise, nextYield) => {
    let results = []
    runtime(function* () {
      for (let i of value) {
        results[value.indexOf(i)] = yield i
      }
    }(), () => nextYield(results))
  },
}

const promiseControl = {
  match: is.promise,
  resolve: (value, runtime, next, raise) => value.then(next, raise)
}

const iteratorControl = {
  match: is.iterator,
  resolve: (value, runtime, next, raise) => runtime(value, val => next(val))
}

const callControl = {
  match: is.call,
  resolve: (value, runtime, next, raise) => {
    const { context, callback, args } = value
    next(callback.apply(context, args))
  }
}

const forkControl = {
  match: is.fork,
  resolve: (value, runtime, next, raise) => {
    runtime(value.iterator.apply(null, value.args))
    next(true)
  }
}

// Runtime
const defaultControls = [ promiseControl, iteratorControl, callControl, arrayControl, forkControl ]
export const createRuntime = (userControls = []) => (generator, ...args) => {
  const runtime = (gen, success = () => {}) => {
    const controls = [ ...userControls, ...defaultControls ]

    const raise = err => gen.throw(err)

    const next = ret => {
      const control = controls.find(control => control.match(ret))
      if (control) return control.resolve(ret, runtime, next, raise, yieldNext)
      yieldNext(ret)
    }

    const yieldNext = ret => {
      const { value, done } = gen.next(ret)
      if (done) return success(value)
      next(value)
    }

    return next()
  }

  const gen = generator.apply(null, args)
  return runtime(gen)
}
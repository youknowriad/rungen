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
const finalControl = (value, runtime, next, raise, nextYield) => {
  nextYield(value)
  return true
}

const arrayControl = (value, runtime, next, raise, nextYield) => {
  if (!is.array(value)) return false
  let results = []
  runtime(function* () {
    for (let i of value) {
      results[value.indexOf(i)] = yield i
    }
  }(), () => nextYield(results))
  return true
}

const promiseControl = (value, runtime, next, raise) => {
  if (!is.promise(value)) return false
  value.then(next, raise)
  return true
}

const iteratorControl = (value, runtime, next, raise) => {
  if (!is.iterator(value)) return false
  runtime(value, val => next(val))
  return true
}

const callControl = (value, runtime, next, raise) => {
  if (!is.call(value)) return false
  const { context, callback, args } = value
  next(callback.apply(context, args))
  return true
}

const forkControl = (value, runtime, next, raise) => {
  if (!is.fork(value)) return false
  runtime(value.iterator.apply(null, value.args))
  next(true)
  return true
}

// Runtime
const defaultControls = [ promiseControl, iteratorControl, callControl, arrayControl, forkControl, finalControl ]
export const createRuntime = (userControls = []) => (generator, ...args) => {
  const runtime = (gen, success = () => {}) => {
    const controls = [ ...userControls, ...defaultControls ]

    const raise = err => gen.throw(err)

    const next = ret => {
      controls.some(control => control(ret, runtime, next, raise, yieldNext))
    }

    const yieldNext = ret => {
      const { value, done } = gen.next(ret)
      if (done) return success(value)
      next(value)
    }

    next()
  }

  const gen = generator.apply(null, args)
  return runtime(gen)
}
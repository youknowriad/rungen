import keys from './keys'

export const error = (err) => ({
  type: keys.error,
  error: err
})

export const fork = (iterator, ...args) => ({
  type: keys.fork,
  iterator: iterator,
  args: args
})

export const join = (task) => ({
  type: keys.join,
  task: task
})

export const race = (competitors) => ({
  type: keys.race,
  competitors: competitors
})

export const delay = (timeout) => new Promise(resolve => {
  setTimeout(resolve, timeout)
})

export const invoke = (func, ...args) => ({
  type: keys.call,
  func: func,
  context: null,
  args: args
})

export const call = (func, context, ...args) => ({
  type: keys.call,
  func: func,
  context: context,
  args: args
})

export const apply = (func, context, args) => ({
  type: keys.call,
  func: func,
  context: context,
  args: args
})

export const cps = (func, ...args) => ({
  type: keys.cps,
  func: func,
  args: args
})
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
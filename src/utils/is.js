import keys from './keys'

const is = {
  obj      : value => typeof value === 'object',
  error    : value => is.obj(value) && value.type === keys.error,
  array    : Array.isArray,
  func     : value => typeof value === 'function',
  promise  : value => value && is.func(value.then),
  iterator : value => value && is.func(value.next) && is.func(value[Symbol.iterator]),
  fork     : value => is.obj(value) && value.type === keys.fork,
  join     : value => is.obj(value) && value.type === keys.join,
  race     : value => is.obj(value) && value.type === keys.race,
  call     : value => is.obj(value) && value.type === keys.call,
  cps      : value => is.obj(value) && value.type === keys.cps
}

export default is
import is from '../utils/is'

export const all = (value, next, iterate, yieldNext) => {
  yieldNext(value)
  return true
}

export const error = (value, next, iterate, yieldNext, raiseNext) => {
  if (!is.error(value)) return false
  raiseNext(value.error)
  return true
}

export const object = (value, next, iterate, yieldNext, raiseNext) => {
  if (!is.obj(value)) return false
  iterate(function* () {
    const result = {}
    for (let key of Object.keys(value)) {
      result[key] = yield value[key]
    }
    return result
  }(), yieldNext, raiseNext)
  return true
}

export const array = (value, next, iterate, yieldNext, raiseNext) => {
  if (!is.array(value)) return false
  iterate(function* () {
    const result = []
    for (let [key, v] of value.entries()) {
      result[key] = yield v
    }
    return result
  }(), yieldNext, raiseNext)
  return true
}

export const iterator = (value, next, iterate, yieldNext, raiseNext) => {
  if (!is.iterator(value)) return false
  iterate(value, next, raiseNext)
  return true
}

export default [error, iterator, array, object, all]
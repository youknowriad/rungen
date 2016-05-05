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
  const result = {}
  const keys = Object.keys(value)
  let count = 0
  let hasError = false
  const gotResultSuccess = (key, ret) => {
    if (hasError) return
    result[key] = ret
    count++
    if (count === keys.length) {
      yieldNext(result)
    }
  }

  const gotResultError = (key, error) => {
    if (hasError) return
    hasError = true
    raiseNext(error)
  }

  keys.map(key => {
    iterate(
      function* () {
        return yield value[key]
      }(),
      ret => gotResultSuccess(key, ret),
      err => gotResultError(key, err)
    )
  })

  return true
}

export const array = (value, next, iterate, yieldNext, raiseNext) => {
  if (!is.array(value)) return false
  const result = []
  let count = 0
  let hasError = false
  const gotResultSuccess = (key, ret) => {
    if (hasError) return
    result[key] = ret
    count++
    if (count === value.length) {
      yieldNext(result)
    }
  }

  const gotResultError = (key, error) => {
    if (hasError) return
    hasError = true
    raiseNext(error)
  }

  value.map((v, key) => {
    iterate(
      function* () {
        return yield v
      }(),
      ret => gotResultSuccess(key, ret),
      err => gotResultError(key, err)
    )
  })

  return true
}

export const iterator = (value, next, iterate, yieldNext, raiseNext) => {
  if (!is.iterator(value)) return false
  iterate(value, next, raiseNext)
  return true
}

export default [error, iterator, array, object, all]

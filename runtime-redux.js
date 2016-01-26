// Utils
const createDispatcher = () => {
  let listeners = []

  return {
    subscribe: (listener) => {
      listeners.push(listener)
      return () => {
        listeners = listeners.filter(l => l !== listener)
      }
    },
    dispatch: (action) => {
      listeners.slice().forEach(listener => listener(action))
    }
  }
}

const dispatcher = createDispatcher()

// Controls
const TYPE_PUT  = 'put'
const TYPE_TAKE = 'take'

const is = {
  put  : value => typeof value === 'object' && value.type === TYPE_PUT,
  take : value => typeof value === 'object' && value.type === TYPE_TAKE,
}

export const reduxControls = (store) => {
  const putControl = (value, runtime, next, raise) => {
    if (!is.put(value)) return false
    store.dispatch(value.action)
    next(value.action)
    return true
  }

  const takeControl = (value, runtime, next, raise) => {
    if (!is.take(value)) return false
    const unsubscribe = dispatcher.subscribe(action => {
      if (action.type === value.action) {
        unsubscribe()
        next(action)
      }
    })
    return true
  }

  return [ putControl, takeControl ]
}

// Middleware
export const runtimeMiddleware = (store) => (next) => (action) => {
  dispatcher.dispatch(action);
  return next(action);
}

// Helpers
export const put = action => ({
  type: TYPE_PUT,
  action: action
})

export const take = action => ({
  type: TYPE_TAKE,
  action: action
})

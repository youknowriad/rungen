import builtinControls from './controls/builtin'

const create = (userControls = []) => {
  const controls = [...userControls, ...builtinControls]
  const runtime = (generator, ...args) => {

    const iterate = (gen, success = () => {}, error = () => {}) => {
      const yieldValue = isError => ret => {
        try {
          const { value, done } = isError ? gen.throw(ret) : gen.next(ret)
          if (done) return success(value)
          next(value)
        } catch (e) {
          return error(e)
        }
      }

      const next = ret => {
        controls.some(control => control(ret, next, iterate, yieldValue(false), yieldValue(true)))
      }

      next()
    }

    const gen = generator.apply(null, args)

    return new Promise((resolve, reject) => iterate(gen, resolve, reject))
  }

  runtime.wrap = (generator) => (...args) => runtime(generator, ...args)

  return runtime
}

export default create;
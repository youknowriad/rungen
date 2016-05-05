import 'babel-polyfill'
import expect from 'expect'
import * as async from '../../src/controls/async'
import create from '../../src/create'
import {fork, delay, join, race, error} from '../../src/utils/helpers'

describe('Default controls', () => {
  it('promise control', (done) => {
    let output
    const runtime = create([async.promise])
    const promise = new Promise((resolve) => {
      resolve('promise')
    })
    const generator = function* () {
      output = yield promise
    }
    const expected = 'promise'

    runtime(generator(), () => {
      expect(output).toEqual(expected)
      done()
    })
  })

  it('promise control with error', done => {
    let output
    const runtime = create([async.promise])
    const promise = new Promise((_, reject) => {
      reject('err')
    })
    const generator = function* () {
      try {
        yield promise
      } catch (err) {
        output = err
      }
    }
    const expected = 'err'

    runtime(generator(), () => {
      expect(output).toEqual(expected)
      done()
    })
  })

  it('fork control', done => {
    let output = []
    const runtime = create([async.fork, async.promise])
    const forkedGenerator = function* (timeout, input) {
      output.push(input)
      yield delay(timeout)
      output.push(input)
    }
    const generator = function* () {
      yield [
        fork(forkedGenerator, 10, 1),
        fork(forkedGenerator, 7, 2)
      ]
    }
    const expected = [1, 2, 2, 1]

    runtime(generator())
    delay(12).then(() => {
      expect(output).toEqual(expected)
      done()
    })
  })

  it('join control', done => {
    let output = []
    const runtime = create([async.fork, async.promise, async.join])
    const forkedGenerator = function* (timeout, input) {
      output.push(input)
      yield delay(timeout)
      return input + 1
    }
    const generator = function* () {
      const task = yield fork(forkedGenerator, 10, 1)
      yield delay(5)
      const result = yield join(task)
      output.push(result)
    }
    const expected = [1, 2]

    runtime(generator())
    delay(12).then(() => {
      expect(output).toEqual(expected)
      done()
    })
  })

  it('join control with error', done => {
    let output
    const runtime = create([async.fork, async.promise, async.join])
    const forkedGenerator = function* (timeout) {
      yield delay(timeout)
      yield error('error')
    }
    const generator = function* () {
      const task = yield fork(forkedGenerator, 10)
      yield delay(5)
      try {
        yield join(task)
      } catch (err) {
        output = err
      }
    }
    const expected = 'error'

    runtime(generator())
    delay(12).then(() => {
      expect(output).toEqual(expected)
      done()
    })
  })

  it('join control after tasked finished', done => {
    let output
    const runtime = create([async.fork, async.promise, async.join])
    const forkedGenerator = function* (timeout) {
      yield delay(timeout)
      return 1
    }
    const generator = function* () {
      const task = yield fork(forkedGenerator, 5)
      yield delay(10)
      try {
        yield join(task)
      } catch (err) {
        output = err
      }
    }
    const expected = 'join error : task not found'

    runtime(generator())
    delay(12).then(() => {
      expect(output).toEqual(expected)
      done()
    })
  })

  it('race control with array', done => {
    let output
    const runtime = create([async.promise, async.race])
    const subGenerator = function* (timeout, input) {
      yield delay(timeout)
      return input
    }
    const generator = function* () {
      output = yield race([
        subGenerator(10, 1),
        subGenerator(4, 2)
      ])
    }
    const expected = [ false, 2 ]

    runtime(generator())
    delay(12).then(() => {
      expect(output).toEqual(expected)
      done()
    })
  })

  it('race control with object', done => {
    let output
    const runtime = create([async.promise, async.race])
    const subGenerator = function* (timeout, input) {
      yield delay(timeout)
      return input
    }
    const generator = function* () {
      output = yield race({
        a: subGenerator(10, 1),
        b: subGenerator(4, 2)
      })
    }
    const expected = { a: false, b: 2 }

    runtime(generator())
    delay(12).then(() => {
      expect(output).toEqual(expected)
      done()
    })
  })

  it('race control with error', done => {
    let output
    const runtime = create([async.promise, async.race])
    const subGenerator = function* (timeout, input) {
      yield delay(timeout)
      return input
    }
    const failSubGenerator = function* (timeout) {
      yield delay(timeout)
      throw 'fail'
    }
    const generator = function* () {
      try {
        output = yield race({
          a: subGenerator(10, 1),
          b: failSubGenerator(4)
        })
      } catch (err) {
        output = err
      }
    }
    const expected = 'fail'

    runtime(generator())
    delay(12).then(() => {
      expect(output).toEqual(expected)
      done()
    })
  })
})

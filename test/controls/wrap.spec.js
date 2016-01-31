import 'babel-polyfill'
import expect from 'expect'
import create from '../../src/create'
import * as wrap from '../../src/controls/wrap'
import {invoke, call, apply, cps} from '../../src/utils/helpers'

describe('Wrap Controls', () => {
  it('call control using invoke', () => {
    let output
    const func = input => input
    const generator = function* () {
      output = yield invoke(func, 'invoked')
    }
    const runtime = create([wrap.call])
    const expected = 'invoked'

    runtime(generator)
    expect(output).toEqual(expected)
  })

  it('call control using call', () => {
    let output
    const context = { a: 'b' }
    const func = function(input) {
      return this.a + ' ' + input
    }
    const generator = function* () {
      output = yield call(func, context, 'invoked')
    }
    const runtime = create([wrap.call])
    const expected = 'b invoked'

    runtime(generator)
    expect(output).toEqual(expected)
  })

  it('call control using apply', () => {
    let output
    const context = { a: 'b' }
    const func = function(input) {
      return this.a + ' ' + input
    }
    const generator = function* () {
      output = yield apply(func, context, ['invoked'])
    }
    const runtime = create([wrap.call])
    const expected = 'b invoked'

    runtime(generator)
    expect(output).toEqual(expected)
  })

  it('call control with error', () => {
    let output
    const func = () => { throw 'error' }
    const generator = function* () {
      try {
        output = yield invoke(func)
      } catch (err) {
        output = err
      }
    }
    const runtime = create([wrap.call])
    const expected = 'error'

    runtime(generator)
    expect(output).toEqual(expected)
  })

  it('cps control', () => {
    let output
    const func = (input, callback) => {
      callback(false, input)
    }
    const generator = function* () {
      output = yield cps(func, 'invoked')
    }
    const runtime = create([wrap.cps])
    const expected = 'invoked'

    runtime(generator)
    expect(output).toEqual(expected)
  })

  it('cps control with error', () => {
    let output
    const func = (input, callback) => {
      callback('error', input)
    }
    const generator = function* () {
      try {
        output = yield cps(func, 'invoked')
      } catch (err) {
        output = err
      }
    }
    const runtime = create([wrap.cps])
    const expected = 'error'

    runtime(generator)
    expect(output).toEqual(expected)
  })
})
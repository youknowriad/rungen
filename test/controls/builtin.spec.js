import 'babel-polyfill'
import expect from 'expect'
import create from '../../src/create'
import {error, all} from '../../src/utils/helpers'

describe('Builtin Controls', () => {
  it('error control', () => {
    const err = error('test')
    const output = []
    const generator = function* () {
      try {
        yield err
        output.push(1)
      } catch (e) {
        output.push(e)
      }
    }
    const runtime = create()
    const expected = ['test']

    runtime(generator())
    expect(output).toEqual(expected)
  })

  it('subgenerator control', () => {
    const output = []
    const subGenerator = function* (input) {
      let v
      v = yield input
      output.push(v)
      return v+1
    }
    const generator = function* () {
      let v
      v = yield 1
      output.push(v)
      v = yield subGenerator(2)
      output.push(v)
    }
    const runtime = create()
    const expected = [1, 2, 3]

    runtime(generator())
    expect(output).toEqual(expected)
  })

  it('subgenerator control with error', () => {
    let output
    const subGenerator = function* () {
      throw 'error'
    }
    const generator = function* () {
      try {
        yield subGenerator()
      } catch (err) {
        output = err
      }
    }
    const runtime = create()
    const expected = 'error'

    runtime(generator())
    expect(output).toEqual(expected)
  })

  it('array control', () => {
    let output = []
    const subGenerator = function* (input) {
      return yield input
    }
    const generator = function* () {
      output = yield all([
        'a', subGenerator('c'), subGenerator('b')
      ])
    }
    const runtime = create()
    const expected = ['a', 'c', 'b']

    runtime(generator())
    expect(output).toEqual(expected)
  })

  it('array control with error', () => {
    let output
    const generator = function* () {
      try {
        output = yield all([
          'a', error('test')
        ])
      } catch (e) {
        output = e
      }
    }
    const runtime = create()
    const expected = 'test'

    runtime(generator())
    expect(output).toEqual(expected)
  })

  it('object control', () => {
    let output = {}
    const subGenerator = function* (input) {
      return yield input
    }
    const generator = function* () {
      output = yield all({
        c : subGenerator('c'),
        b : subGenerator('b'),
        a : 'a'
      })
    }
    const runtime = create()
    const expected = { a : 'a', b : 'b', c : 'c' }

    runtime(generator())
    expect(output).toEqual(expected)
  })

  it('object control with error', () => {
    let output
    const generator = function* () {
      try {
        output = yield all({ a : 'a', b : error('test') })
      } catch (e) {
        output = e
      }
    }
    const runtime = create()
    const expected = 'test'

    runtime(generator())
    expect(output).toEqual(expected)
  })
})

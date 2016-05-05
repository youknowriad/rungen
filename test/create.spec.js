import 'babel-polyfill'
import expect from 'expect'
import create from '../src/create'

describe('Default generator', () => {
  it('with no custom controls', () => {
    const output = []
    const generator = function* () {
      let v
      v = yield 'a'
      output.push(v)
      v = yield 'b'
      output.push(v)
    }
    const runtime = create()
    const expected = ['a', 'b']

    runtime(generator())
    expect(output).toEqual(expected)
  })

  it('with no custom controls using result callbac', done => {
    const output = []
    const generator = function* () {
      let v
      v = yield 'a'
      output.push(v)
      v = yield 'b'
      output.push(v)
    }
    const runtime = create()
    const expected = ['a', 'b']

    runtime(generator(), () => {
      expect(output).toEqual(expected)
      done()
    })
  })
})

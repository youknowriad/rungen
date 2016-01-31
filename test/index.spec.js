import 'babel-polyfill'
import expect from 'expect'
import {
  create, fork, join, error, delay,
  invoke, call, apply, cps,
  asyncControls, wrapControls
} from '../src/index'

describe('Library API', () => {
  it('the library export create runtime', () => {
    expect(create).toExist()
  })

  it('the library export helpers', () => {
    expect(fork).toExist()
    expect(join).toExist()
    expect(error).toExist()
    expect(delay).toExist()
    expect(invoke).toExist()
    expect(call).toExist()
    expect(apply).toExist()
    expect(cps).toExist()
  })

  it('the library export controls', () => {
    expect(asyncControls).toExist()
    expect(wrapControls).toExist()
  })
})
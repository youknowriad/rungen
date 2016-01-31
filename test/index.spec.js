import 'babel-polyfill'
import expect from 'expect'
import {create, fork, join, error, delay, asyncControls} from '../src/index'

describe('Library API', () => {
  it('the library export create runtime', () => {
    expect(create).toExist()
  })

  it('the library export helpers', () => {
    expect(fork).toExist()
    expect(join).toExist()
    expect(error).toExist()
    expect(delay).toExist()
  })

  it('the library export async controls', () => {
    expect(asyncControls).toExist()
  })
})
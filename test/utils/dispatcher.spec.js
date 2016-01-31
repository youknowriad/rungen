import 'babel-polyfill'
import expect from 'expect'
import createDispatcher from '../../src/utils/dispatcher'

describe('Dispatcher', () => {
  it('multiple subscribers', () => {
    const dispatcher = createDispatcher()
    const output = []
    dispatcher.subscribe(input => {
      output.push(input)
    })
    dispatcher.subscribe(input => {
      output.push(input + 1)
    })
    const expected = [1, 2]
    dispatcher.dispatch(1)

    expect(output).toEqual(expected)
  })

  it('unsubscribe', () => {
    const dispatcher = createDispatcher()
    const output = []
    const unsubscribe = dispatcher.subscribe(input => {
      output.push(input)
    })
    dispatcher.subscribe(input => {
      output.push(input + 1)
    })
    const expected = [2]
    unsubscribe()
    dispatcher.dispatch(1)

    expect(output).toEqual(expected)
  })
})
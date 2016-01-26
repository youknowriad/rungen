import 'babel-polyfill'

import { createRuntime, call, fork } from './runtime';
import { runtimeMiddleware, put, take, reduxControls } from './runtime-redux';
import { createStore, applyMiddleware } from 'redux'
const reducer = (state = {}, action) => state
const createStoreWithRuntime = applyMiddleware(
  runtimeMiddleware
)(createStore)
const store = createStoreWithRuntime(reducer)

const runtime = createRuntime([ ...reduxControls(store) ])

function* fnA() {
  while(true) {
    let {payload} = yield take('a')
    yield fork(someAction, payload)
  }
}

function* fnB() {
  yield put({type: 'a', payload: 1})
  yield put({type: 'a', payload: 2})
  yield put({type: 'a', payload: 3})
}

function* someAction(payload) {
  console.log(payload)
}

runtime(function*() {
  yield [ fork(fnA), fork(fnB) ]
})
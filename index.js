import 'babel-polyfill'
import { createRuntime, call } from './runtime';
const runtime = createRuntime()

async function promiseTest() {
  return Promise.resolve('promise')
}

async function promiseOfpromise() {
  return await promiseTest()
}

function* myGenerator(example) {
  let val = yield example
  console.log('in' ,val)
  val = yield val + 1;
  console.log('in' ,val)
  val = yield val + 1;
  console.log('in' ,val)

  return val;
}

runtime(function* () {
  let val = yield 'test'
  console.log(val)

  val = yield promiseTest()
  console.log(val)

  val = yield promiseOfpromise()
  console.log(val)

  val = yield myGenerator(1)
  console.log('out', val)

  val = yield call(null, promiseOfpromise)
  console.log(val)
});
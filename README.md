# resolve-chain

Chains pending promises and captures resolved return values

## Usage

```js
import ResolveChain from 'resolve-chain'
 
const createPromise = (value) => new Promise((resolve) => resolve(value))

const chain = new ResolveChain()
chain.add(createPromise('hello'))
chain.add(createPromise('world'))
let values = await chain.values() // ['hello', 'world']

chain.add(createPromise('group'))
values = await chain.values() // ['group']

/**
 * Handle errors from promise
 */
const error = Promise.reject('error')
chain.add(error, (err) => {
  console.log('Oh no some big ol error', err)
})
values = await chain.values() // []

/**
 * Return a default value on error
 */
const promise = Promise.reject('error')
  .catch((err) => {
    return 'some default value'
  })
chain.add(promise)
values = await chain.values() // ['some default value']
```
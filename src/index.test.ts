import ResolveChain from './index'

const resolve = (value) => new Promise((resolve) => resolve(value))
const reject = (value) => new Promise((_, reject) => reject(value))

describe('chain add', () => {
  it('should support simple promise chain', async () => {
    const chain = new ResolveChain();
    chain.add(resolve('hello'))
    chain.add(resolve('world'))
    expect(await chain.values()).toEqual(['hello', 'world'])
    chain.add(resolve('yo'))
  
    expect(await chain.values()).toEqual(['yo'])
    expect(await chain.values()).toEqual([])
  })

  it('should not add if undefined', async () => {
    const chain = new ResolveChain()
    chain.add(resolve(void 0))
    expect(await chain.drain()).toEqual([])
  })

  it('should add if falsy', async () => {
    const chain = new ResolveChain()
    chain.add(resolve(null))
    chain.add(resolve(0));
    chain.add(resolve(''));
    chain.add(resolve(false));
    chain.add(resolve(-100))
    chain.add(resolve([]))
    chain.add(resolve({}))
    expect(await chain.drain()).toEqual([null, 0, '', false, -100, [], {}])
  })
})

describe('catch handler', () => {
  it('should handle passed catch handler', async () => {
    const chain = new ResolveChain();
    chain.add(reject('yo'), (err) => {
      expect(err).toBe('yo')
    })
    expect(await chain.values()).toEqual([])
  })

  it('should promise error handler with value', async () => {
    const chain = new ResolveChain()
    const r = reject('yo')
      .catch((err) => {
        return 'default value'
      })
    const inlineCatch = jest.fn()
    chain.add(r, inlineCatch)

    expect(await chain.values()).toEqual(['default value'])
    expect(inlineCatch).not.toBeCalled()
  })

  it('should noop if no catch handler passed', async () => {
    const chain = new ResolveChain()
    chain.add(reject('yo'))

    expect(await chain.values()).toEqual([])
  })
})
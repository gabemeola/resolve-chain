function noop() {}

export type CatchCallback<T> = Parameters<Promise<T>['catch']>[0];

/**
 * Chains pending promises and captures resolved return values
 */
export default class ResolveChain<T> {
	#chain: Promise<any> = Promise.resolve();
  #values: Array<T> = [];
  /**
   * Adds a promise to the chain. Resolved value
   * will be captured in `.values()`.
   * 
   * @param promise - Promise to add to chain
   * @param promiseCatch - Catch handler for rejections which may occur from the promise
   */
	add(promise: Promise<T | void | undefined>, promiseCatch: CatchCallback<T> = noop) {
		this.#chain = this.#chain
			.then(() => promise)
			.then((value) => {
				if (typeof value !== 'undefined') {
					this.#values.push(value);
				}
			})
			.catch(promiseCatch);
  }
  /**
   * Returns captured values from the current promise chain.
   * Returned values will be removed from the group.
   * @example
   * ```
   * const chain = new ResolveChain()
   * chain.add(Promise.resolve('hello'))
   * chain.add(Promise.resolve('world'))
   * const values1 = await chain.values() // ['hello', 'world']
   * 
   * chain.add(Promise.resolve('data'))
   * const values2 = await chain.values() // ['data']
   * ```
   */
	values() {
		return this.#chain.then(() => {
      const values = this.#values;
      // Drain values
      this.#values = [];
      return values;
    });
  }
  /**
   * @see {@link ResolveChain#values}
   */
  drain = this.values
}
export interface PromiseQueueOptions {
    /**
     * 队列执行并发数
     */
    concurrency?: number;
}

export default class PromiseQueue {
    private readonly concurrency: number;

    private _current = 0;

    // eslint-disable-next-line
    private _list: (() => Promise<any>)[] = [];

    constructor(options: PromiseQueueOptions) {
      this.concurrency = options.concurrency || 1
    }

    // eslint-disable-next-line
    push(promiseFn: (() => Promise<any>)) {
      this._list.push(promiseFn)
      this.loadNext()
    }

    private loadNext() {
      if (this._list.length === 0 || this.concurrency === this._current) {
        return
      }

      this._current++
      const fn = this._list.shift()
      if (fn) {
        // eslint-disable-next-line no-console
        console.debug('[PromiseQueue] exec next promise function, remain ' + this._list.length + ' promise functions.')
        const promise = fn()
        promise.then(this.onLoaded.bind(this)).catch(this.onLoaded.bind(this))
      } else {
        // eslint-disable-next-line no-console
        console.warn('[PromiseQueue] promise function is undefined.')
        this.onLoaded()
      }
    }

    private onLoaded() {
      this._current--
      this.loadNext()
    }
}

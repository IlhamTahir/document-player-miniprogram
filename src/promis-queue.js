export default class PromiseQueue {
    constructor(options) {
        this._current = 0;
        // eslint-disable-next-line
        this._list = [];
        this.concurrency = options.concurrency || 1;
    }
    // eslint-disable-next-line
    push(promiseFn) {
        this._list.push(promiseFn);
        this.loadNext();
    }
    loadNext() {
        if (this._list.length === 0 || this.concurrency === this._current) {
            return;
        }
        this._current++;
        const fn = this._list.shift();
        if (fn) {
            // eslint-disable-next-line no-console
            console.debug('[PromiseQueue] exec next promise function, remain ' + this._list.length + ' promise functions.');
            const promise = fn();
            promise.then(this.onLoaded.bind(this)).catch(this.onLoaded.bind(this));
        }
        else {
            // eslint-disable-next-line no-console
            console.warn('[PromiseQueue] promise function is undefined.');
            this.onLoaded();
        }
    }
    onLoaded() {
        this._current--;
        this.loadNext();
    }
}
//# sourceMappingURL=promis-queue.js.map
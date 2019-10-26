class MyPromise {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new Error('Executor must be a function');
    }

    // 初始状态，$state 表示 promise 的当前状态
    // $chained 是当 promise 处在 settled 状态时需要调用的函数数组
    this.$state = 'PENDING';
    this.$chained = [];

    const resolve = (res) => {
      // 只要当 `resolve()` 或 `reject()` 被调用
      // 这个 promise 对象就不再处于 pending 状态，被称为 settled 状态
      // 调用 `resolve()` 或 `reject()` 两次，以及在 `resolve()` 之后调用 `reject()` 是无效的
      if (this.$state !== 'PENDING') {
        return;
      }

      // 如果 `res` 是 thenable（带有then方法的对象）
      // 将锁定 promise 来保持跟 thenable 的状态一致
      if (res !== null && typeof res.then === 'function') {
        // 在这种情况下，这个 promise 是 resolved，但是仍处于 'PENDING' 状态
        // 这就是 ES6 规范中说的"一个 resolved 的 promise"，可能处在 pending, fulfilled 或者 rejected 状态
        // http://www.ecma-international.org/ecma-262/6.0/#sec-promise-objects
        return res.then(resolve, reject);
      }

      this.$state = 'FULFILLED';
      this.$internalValue = res;
      // If somebody called `.then()` while this promise was pending, need
      // to call their `onFulfilled()` function
      for (const { onFulfilled } of this.$chained) {
        onFulfilled(res);
      }

      return res;
    };
    const reject = (err) => {
      if (this.$state !== 'PENDING') {
        return;
      }
      this.$state = 'REJECTED';
      this.$internalValue = err;
      for (const { onRejected } of this.$chained) {
        onRejected(err);
      }
    };

    // 如规范所言，调用处理器函数中的 `resolve()` 和 `reject()`
    try {
      // 如果处理器函数抛出一个同步错误，我们认为这是一个失败状态
      // 需要注意的是，`resolve()` 和 `reject()` 只能被调用一次
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }
  then(onFulfilled, onRejected) {
    var self = this;
    return new MyPromise((resolve, reject) => {
      // 确保在 `onFulfilled()` 和 `onRejected()` 的错误将导致返回的 promise 失败（reject)
      const _onFulfilled = (res) => {
        try {
          // 如果 `onFulfilled()` 返回一个 promise, 确保 `resolve()` 能正确处理
          resolve(onFulfilled(res));
        } catch (err) {
          reject(err);
        }
      };
      const _onRejected = (err) => {
        try {
          reject(onRejected(err));
        } catch (_err) {
          reject(_err);
        }
      };
      console.log(this === self);
      if (this.$state === 'FULFILLED') {
        _onFulfilled(this.$internalValue);
      } else if (this.$state === 'REJECTED') {
        _onRejected(this.$internalValue);
      } else {
        this.$chained.push({ onFulfilled: _onFulfilled, onRejected: _onRejected });
      }
    });
  }
}
var p = new MyPromise((resolve, reject) => {
  setTimeout(() => console.log(resolve(123)), 2000);
}).then((res) => {
  setTimeout(() => console.log(res), 200);
});

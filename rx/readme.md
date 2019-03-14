### RX
响应式、函数式的编程方式，让我们更关注于“数据”的变化，而不适用命令的方式去执行每一个步骤。在业务中，我们只需要关心数据的产生、处理和分发就行了，这极大地提高了生产力(数据处理起来就像“流”一样，代码也更容易维护)。
* [RX的JavaScript扩展 - RxJS](https://cn.rx.js.org/)

### 逻辑解析
* 流：一个可以被观察的对象
* 观察者：可以订阅[流]中每一个数据
核心也就这么两个，其他的都是基于这两个做的扩散。`流`的概念类似于一个“订阅发布总线”，或者说是“电台”，负责产生数据；`观察者`的概念就可以形象为每一个“家庭”，可以收看节目、跳过某个节目、不关注某个节目。于是应该形成这种图形:
```javascript
// Stream -----1----------2---3------> 随心所欲地生产数据
// Watcher1    |                       1节点开始订阅Stream，可以处理1及以后的数据
// Watcher2               |            2节点开始订阅Stream，可以处理2及以后的数据
// Watcher...
```

### 代码解析
1. 构建一个流
  ```javascript
    /**
    * 流、事件发布者
    * 产生一条事件流，产生事件后推送到订阅者
    * @param {*} onSubscribe 事件订阅时注册，用于产生事件
    */
    const Observable = function(onSubscribe) {
      // 当前流的订阅者。如果支持多订阅，这里可以改为数组
      this.subscriber = null
      if (onSubscribe && typeof onSubscribe === 'function') {
        // 感知当前流被用户“订阅”这个事件，并产生相应的数据，供订阅用户使用
        this.onSubscribe = onSubscribe
      } else {
        throw new Error('subscribe must be a function')
      }
    }
  ```
2. 流开放订阅
```javascript
/**
 * 订阅到流
 */
Observable.prototype.subscribe = function ({next, err, complete}) {
  // Subscriber表示订阅用户.
  // 其实这里的subscriber是一个行为代理,传入的参数为实际的订阅用户
  // next接受的数据是被subscriber处理后的
  this.subscriber = new Subscriber({next, err, complete})
  // 触发订阅事件，开始产生数据
  this.onSubscribe(this.subscriber)
  return this.subscriber
}
```
3. 构造订阅用户Subscriber
```javascript
/**
 * 迭代器、观察者代理
 * 根据代理状态，选择处理主体对象的方法
 * @param {*} subject 受代理的主体对象
 */
function Subscriber(subject) {
  // 主体。控制当前数据流向(next\err\complete)
  // 相当于一个迭代器，负责推送数据到实际用户的next方法
  this.subject = subject
  // 订阅用户的状态。
  // running: 订阅中
  // error:   事件失败
  // complete: 所有事件都完成
  this.status = 'running'
}

/**
 * 下一次事件
 */
Subscriber.prototype.next = function(message) {
  // 状态为error或complete后，subject无法收到通知
  if (this.subject && this.status === 'running') {
    // 通知实际订阅者，获取到message
    this.subject.next(message)
  }
  return this
}

/**
 * 产生错误
 */
Subscriber.prototype.err = function(err) {
  if (this.subject && this.status === 'running') {
    // 推送失败信号
    this.subject.err(err)
    this.status = 'error'
  }
  return this
}
/**
 * 终结代理
 */
Subscriber.prototype.complete = function() {
  if (this.subject && this.status === 'running') {
    // 推送完成信号
    this.subject.complete()
    this.status = 'complete'
  }
  return this
}

/**
 * 终结订阅
 */
Subscriber.prototype.unsubscribe = function () {
  // 清除subject，subject无法再收到通知
  this.subject = null
}
```
4. 到这里，一个简单的Observable模式就可以跑起来了，您可以用demo试试。
5. 构建更多的操作符、更多的通信方式
```javascript
/**
 * 创建一个流
 */
Observable.create = function(onSubscribe) {
  return new Observable(onSubscribe)
}

/**
 * 操作符 参数映射
 */
Observable.prototype.map = function(fn) {
  // 产生新的流，新的流订阅到当前事件，并采用映射函数fn处理原始数据
  // 新数据为fn(x)
  return Observable.create((observer) => {
    // 订阅当前流
    this.subscribe({
      next: async (x) => {
        // 处理数据，并作为新数据推送给新的流
        observer.next(await fn(x))
      },
      err: (err) => {
        observer.err(err)
      },
      complete: () => {
        observer.complete()
      }
    })
  })
}

/**
 * 参数过滤
 */
Observable.prototype.filter = function(fn) {
  return Observable.create((observer) => {
    this.subscribe({
      next: (x) => {
        const result = fn(x)
        if (result) {
          observer.next(x)
        } 
      },
      err: (err) => {
        observer.err(err)
      },
      complete: () => {
        observer.complete()
      }
    })
  })
}
```

### 演示代码
```javascript
// 引入流
const {Observable} = require('./index')

// 构造一个流，流的数据在订阅的时候产生
// 产生的数据是顺序整数 0 - 10， 一秒一个。
const observer$ = new Observable((observer) => {
  let i = 0
  const timer = setInterval(() => {
    // 推送到观察者
    // 或者可以理解为。观察者代理执行next函数，符合条件的话，内部会执行观察者的next函数
    observer.next(i++)
    if (i === 10) {
      clearInterval(timer)
    }
  }, 1000)
})

// 操作符、订阅、取消
const subscription1$ = observer$.map(async (x) => {
  // 异步操作
  const p = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(x * x)
    }, 2000)
  })
  const res = await p.then(x => x)
  return res
}).subscribe({
  // 新的流被推送map处理后的数据
  next: (i) => {
    // 异步打印0 1 4 9 ....
    console.log('subscription1$', i)
  },
  err: (e) => {
    console.log('error', e)
  },
  complete: () => {
    console.log('completed')
  }
})
console.log('====== main process ======')
//5s后取消订阅
setTimeout(() => {
  subscription1$.unsubscribe()
}, 5000)

```
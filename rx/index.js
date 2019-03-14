/**
 * 流、事件发布者
 * 产生一条事件流，产生事件后推送到订阅者
 * @param {*} onSubscribe 事件订阅时注册，用于产生事件
 */
const Observable = function(onSubscribe) {
  this.subscriber = null
  if (onSubscribe && typeof onSubscribe === 'function') {
    this.onSubscribe = onSubscribe
  } else {
    throw new Error('subscribe must be a function')
  }
}
/**
 * 创建一个流
 */
Observable.create = function(onSubscribe) {
  return new Observable(onSubscribe)
}
/**
 * 订阅到流
 */
Observable.prototype.subscribe = function ({next, err, complete}) {
  this.subscriber = new Subscriber({next, err, complete})
  this.onSubscribe(this.subscriber)
  return this.subscriber
}

/**
 * 操作符 参数映射
 */
Observable.prototype.map = function(fn) {
  return Observable.create((observer) => {
    this.subscribe({
      next: async (x) => {
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

/**
 * 迭代器、观察者代理
 * 根据代理状态，选择处理主体对象的方法
 * @param {*} subject 受代理的主体对象
 */
function Subscriber(subject) {
  this.subject = subject
  this.status = 'running'
}

/**
 * 下一次事件
 */
Subscriber.prototype.next = function(message) {
  if (this.subject && this.status === 'running') {
    this.subject.next(message)
  }
  return this
}

/**
 * 产生错误
 */
Subscriber.prototype.err = function(err) {
  if (this.subject && this.status === 'running') {
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
    this.subject.complete()
    this.status = 'complete'
  }
  return this
}

/**
 * 终结订阅
 */
Subscriber.prototype.unsubscribe = function () {
  this.subject = null
}

module.exports = {
  Observable
}
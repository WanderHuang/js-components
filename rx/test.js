const {Observable} = require('./index')

const observer$ = new Observable((observer) => {
  let i = 0
  const timer = setInterval(() => {
    observer.next(i++)
    if (i === 10) {
      clearInterval(timer)
    }
  }, 1000)
})

const subscription1$ = observer$.map(async (x) => {
  const p = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(x * x)
    }, 2000)
  })
  const res = await p.then(x => x)
  return res
}).subscribe({
  next: (i) => {
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
setTimeout(() => {
  subscription1$.unsubscribe()
}, 5000)

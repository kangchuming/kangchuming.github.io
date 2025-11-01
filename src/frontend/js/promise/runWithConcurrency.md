```js
async function runWithConcurrency (tasks, limit) {
  let n = tasks.length
  let res = Array(n);
  let index = 0

  async function worker () {
    while (index < n) {
      let curIndex = index++

      if (curIndex >= n) break

      try {
        res[curIndex] = { value: await tasks[curIndex](), status: 'fulfilled' }
      } catch {
        res[curIndex] = { reason: 'error', status: 'rejected' }
      }
    }
  }

  let workers = Array(Math.min(n, limit))
    .fill(0)
    .map(() => worker())
  await Promise.allSettled(workers)

  return res
}

const tasks = [
  () => Promise.resolve('A'),
  () => Promise.reject('fail B'),
  () => new Promise(r => setTimeout(() => r('C'), 200)),
  () => Promise.reject('fail D')
]

runWithConcurrency(tasks, 2).then(console.log)
```
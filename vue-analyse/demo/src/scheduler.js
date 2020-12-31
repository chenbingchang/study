import {nextTick} from './util/next-tick';

let has = {}
let queue = []

function flushSchedulerQueue() {
  for(let i = 0, len = queue.length; i < len; i++) {
    let watcher = queue[i]
    watcher.run()
  }

  queue = []
  has = {}
}

let pending = false

export function queueWatcher(watcher) {
  const id = watcher.id

  if(has[id] == null || has[id] == undefined) {
    has[id] = true
    queue.push(watcher)

    if(!pending) {
      nextTick(flushSchedulerQueue)
      pending = true
    }
  }
}
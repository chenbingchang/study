/**
 * 观测值
 */
class Observer {
  constructor(value) {
    this.walk(value)
  }

  walk(data) {
    
  }
}

export function observe(data) {
  if(typeof data !== 'object' || data == null) {
    return
  }

}
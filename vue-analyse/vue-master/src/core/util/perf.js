import { inBrowser } from './env'

export let mark
export let measure

if (process.env.NODE_ENV !== 'production') {
  // 非正式环境
  /* 
  window.performance用来测量网页和Web应用程序的性能
  Performance.mark()    根据给出 name 值，在浏览器的性能输入缓冲区中创建一个相关的timestamp
  Performance.clearMarks()  将给定的 mark 从浏览器的性能输入缓冲区中移除。
  Performance.measure()   在浏览器的指定 start mark 和 end mark 间的性能输入缓冲区中创建一个指定的 timestamp
  Performance.clearMeasures()   将给定的 measure 从浏览器的性能输入缓冲区中移除。
  */
  const perf = inBrowser && window.performance
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = tag => perf.mark(tag)
    measure = (name, startTag, endTag) => {
      perf.measure(name, startTag, endTag)
      perf.clearMarks(startTag) 
      perf.clearMarks(endTag)
      perf.clearMeasures(name)
    }
  }
}

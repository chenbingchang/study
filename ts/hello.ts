function numWays(n: number, relation: number[][], k: number): number {
  // 收集信息，key: 下标，value: 能传递到的数组
  let nextMap: {[key: string]: number[]} = {}

  // 遍历relation收集所能传的下一个的信息
  // for (let [pos, next] of relation) {
  //     if (!nextMap[pos]) {
  //         // 不存在，则新建
  //         nextMap[pos] = []
  //     }

  //     // 收集能传递的下一个
  //     nextMap[pos].push(next)
  // }
  
  // let ways: number = 0
  // 栈，深度优先
  // let stack: Array<{pos: number, k: number}> = [{
  //     pos: 0, // 当前的位置
  //     k: k // 还有几轮
  // }]

  // while(stack.length) {
  //     let info = stack.pop()

  //     if (!info) {
  //         continue
  //     }
  //     let pos = info.pos
  //     let k = info.k

  //     if (k === 1) {
  //         // 还差最后一轮，如果下一轮包含n-1，则是一条可行的方案
  //         if (nextMap[pos] && nextMap[pos].includes(n - 1)) {
  //             ways++
  //         }
  //         continue
  //     }

  //     // 下一轮的可以有哪些位置
  //     let nextList: number[] = nextMap[pos] || []
      
  //     // 下一轮所有的位置都放到栈中去执行
  //     for(let next of nextList) {
  //         stack.push({
  //             pos: next,
  //             k: --k
  //         })
  //     }
  // }

  return 0
};

numWays(
  5,
  [[0,2],[2,1],[3,4],[2,3],[1,4],[2,0],[0,4]],
  3
)
/* 

*/

const s1 = i  //第一步遍历到的index
const s2 = i 
const keyToNewIndexMap: Map<string | number, number> = new Map()
/* 把没有比较过的新的vnode节点,通过map保存 */
for (i = s2; i <= e2; i++) {
  if (nextChild.key != null) {
    keyToNewIndexMap.set(nextChild.key, i)
  }
}
let j
let patched = 0 
const toBePatched = e2 - s2 + 1 /* 没有经过 path 新的节点的数量 */
let moved = false /* 证明是否 */
let maxNewIndexSoFar = 0 
const newIndexToOldIndexMap = new Array(toBePatched)
 for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0
/* 建立一个数组，每个子元素都是0 [ 0, 0, 0, 0, 0, 0, ] */ 




for (i = s1; i <= e1; i++) {
  /* 开始遍历老节点 */
  const prevChild = c1[i]
  if (patched >= toBePatched) {
    /* 已经patch数量大于等于， */
    /* ① 如果 toBePatched新的节点数量为0 ，那么统一卸载老的节点 */
    unmount(prevChild, parentComponent, parentSuspense, true)
    continue
  }
  let newIndex
  /* ② 如果,老节点的key存在 ，通过key找到对应的index */
  if (prevChild.key != null) {
    newIndex = keyToNewIndexMap.get(prevChild.key)
  } else {
    /*  ③ 如果,老节点的key不存在 */
    for (j = s2; j <= e2; j++) {
      /* 遍历剩下的所有新节点 */
      if (
        newIndexToOldIndexMap[j - s2] === 0 && /* newIndexToOldIndexMap[j - s2] === 0 新节点没有被patch */
        isSameVNodeType(prevChild, c2[j] as VNode)
      ) {
        /* 如果找到与当前老节点对应的新节点那么 ，将新节点的索引，赋值给newIndex  */
        newIndex = j
        break
      }
    }
  }
  if (newIndex === undefined) {
    /* ①没有找到与老节点对应的新节点，删除当前节点，卸载所有的节点 */
    unmount(prevChild, parentComponent, parentSuspense, true)
  } else {
    /* ②把老节点的索引，记录在存放新节点的数组中， */
    newIndexToOldIndexMap[newIndex - s2] = i + 1
    if (newIndex >= maxNewIndexSoFar) {
      maxNewIndexSoFar = newIndex
    } else {
      /* 证明有节点已经移动了   */
      moved = true
    }
    /* 找到新的节点进行patch节点 */
    patch(
      prevChild,
      c2[newIndex] as VNode,
      container,
      null,
      parentComponent,
      parentSuspense,
      isSVG,
      optimized
    )
    patched++
  }
}
// [3, 4, 2, 0]




/*移动老节点创建新节点*/
/* 根据最长稳定序列移动相对应的节点 */
const increasingNewIndexSequence = moved ?
  getSequence(newIndexToOldIndexMap) :
  EMPTY_ARR // [3, 4]
j = increasingNewIndexSequence.length - 1 // 1
for (i = toBePatched - 1; i >= 0; i--) {
  const nextIndex = s2 + i
  const nextChild = c2[nextIndex] as VNode
  const anchor =
    nextIndex + 1 < l2 ? (c2[nextIndex + 1] as VNode).el : parentAnchor
  if (newIndexToOldIndexMap[i] === 0) {
    /* 没有老的节点与新的节点对应，则创建一个新的vnode */
    patch(
      null,
      nextChild,
      container,
      anchor,
      parentComponent,
      parentSuspense,
      isSVG
    )
  } else if (moved) {
    if (j < 0 || i !== increasingNewIndexSequence[j]) {
      /*如果没有在长*/
      /* 需要移动的vnode */
      move(nextChild, container, anchor, MoveType.REORDER)
    } else {
      j--
    }
  }
}
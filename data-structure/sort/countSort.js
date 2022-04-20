/* 计数排序 */

/**
 * 
 */
function countSort (arr) {
  let min = arr[0];
  let max = arr[0];

  // 查找数组中的最大/最小值
  for (const val of arr) {
    if (val < min) {
      min = val;
    }
    if (val > max) {
      max = val;
    }
  }

  // 计数数组，默认值都是0
  let countArr = new Array(max - min + 1).fill(0);

  // 遍历原数组
  for (const val of arr) {
    // 值出现一次就+1
    countArr[val - min] += 1;
  }
  // 计数完成后，遍历计数数组，计算对应值在排序数组中的下标
  for (let i = 1; i < countArr.length; i++) {
    countArr[i] += countArr[i - 1];
  }

  // 排序的数组
  let sortArr = new Array(arr.length);

  for (const val of arr) {
    sortArr[countArr[val - min] - 1] = val;
    countArr[val - min] -= 1;
  }

  return sortArr;
}

// 生成随机数组
function randomArr (size) {
  let arr = new Array(size);

  for (let i = 0; i < size; i++) {
    arr[i] = parseInt(Math.random() * 100);
  }

  return arr;
}

let arr = randomArr(13);
console.log(arr);
console.log(countSort(arr));

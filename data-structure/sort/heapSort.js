let length = 0;

function buildMaxHeap(arr) {
  // 
  /* 
  完全二叉树，所以第N-1层的最后一个元素的下标是Math.floor(length / 2)
  一开始要从下往上来构建最大顶堆
  */
  for (let i = Math.floor(length / 2); i >= 0; i--) {
    repairHeap(arr, i);
  }
}

function repairHeap(arr, i) {
  let left = 2 * i + 1;
  let right = 2 * i + 2;
  let lagest = i;

  if (arr[left] > arr[lagest]) {
    lagest = left;
  } else if (arr[right] > arr[lagest]) {
    lagest = right;
  }

  if (lagest !== i) {
    swap(arr, i, lagest);
    repairHeap(arr, lagest);
  }
}

function swap(arr, x, y) {
  let temp = arr[x];
  arr[x] = arr[y];
  arr[y] = temp;
}

function heapSort(arr) {
  length = arr.length;

  // 先构建大顶堆
  buildMaxHeap(arr);
  for (let i = length - 1; i >= 0; i--) {
    swap(arr, 0, i);
    length--;
    repairHeap(arr, 0);
  }
}

function randomArr() {
  let result = [];

  for (let i = 0; i < 15; i++) {
    result.push(Math.ceil(Math.random() * 100));
  }

  return result;
}

let arr = randomArr();
console.log(heapSort(arr));
let arr = [
  {
    id: 1,
    pid: 0,
    name: "a"
  },
  {
    id: 2,
    pid: 1,
    name: "b"
  },
  {
    id: 3,
    pid: 2,
    name: "c"
  },
];

// 把数组变成树的形式
let tree = [
  {
    id: 1,
    pid: 0,
    name: "a",
    children: [
      {
        id: 2,
        pid: 1,
        name: "b",
        children: [
          {
            id: 3,
            pid: 2,
            name: "c"
          },
        ]
      }
    ]
  }
]


function transform(arr) {
  let childrenMap = {}
  let idMap = {}

  arr.forEach(item => {
    let {id, pid} = item

    idMap[id] = item
    if (!childrenMap[pid]) {
      childrenMap[pid] = []
    }
    childrenMap[pid].push(item)
  })

  let result = []

  arr.forEach(item => {
    let {id, pid} = item

    if (!idMap[pid]) {
      result.push(item)
    }

    if (childrenMap[id]) {
      item.children = childrenMap[id]
    }
  })

  return result
}

console.log( transform(arr));



function foo() {
  getter = function() {alert(1)}

  return this
}
foo.getter = function() {alert(2)}
foo.prototype.getter = function() {alert(3)}
getter = function() {alert(4)}
function getter() {alert(5)}


// 写下下面的输入结果
foo.getter()
foo().getter()
getter()
new foo().getter()

/* 
结果
2
1
1
3
*/
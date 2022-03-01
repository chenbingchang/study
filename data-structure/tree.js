/**
 * 树的节点
 */
class TreeNode {
  // 父节点
  parent = null;
  // 子节点数组
  children = [];
  // 节点的数据
  data = null;

  constructor ({parent = null, children = [], data = null} = {parent: null, children: [], data: null}) {
    this.parent = parent;
    this.children = children;
    this.data = data;

    // 校验子节点数组的值
    if (!Array.isArray(this.children)) {
      this.children = [];
    }
  }

  /**
   * 添加子节点
   * @param {TreeNode} node 子节点
   */
  addChild (node) {
    // 修改子节点的父节点
    node.parent = this;
    // 子节点添加到子节点数组
    this.children.push(node);
  }

  /**
   * 移除子节点
   * @param {TreeNode} node 子节点
   */
  removeChild (node) {
    // 清空子节点的父节点
    node.parent = null;

    let index = this.children.findIndex(child => child === node);

    if (index !== -1) {
      // 移除子节点
      this.children.splice(index, 1);
    }
  }
}

/**
 * 树数据结构
 */
class Tree {
  // 根节点
  root = null;
}

let tree = new Tree();


let n0 = new TreeNode({data: "根节点"});
let n1_1 = new TreeNode({data: "n1_1"});
let n1_2 = new TreeNode({data: "n1_2"});
let n1_3 = new TreeNode({data: "n1_3"});
let n1_4 = new TreeNode({data: "n1_4"});

let n2_1 = new TreeNode({data: "n2_1"});
let n2_2 = new TreeNode({data: "n2_2"});
let n2_3 = new TreeNode({data: "n2_3"});

n1_2.addChild(n2_1);
n1_2.addChild(n2_2);
n1_2.addChild(n2_3);

n0.addChild(n1_1);
n0.addChild(n1_2);
n0.addChild(n1_3);
n0.addChild(n1_4);

console.log(n0);
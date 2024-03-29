/**
 * 二叉树节点
 */
class TreeNode {
  value = null;
  left = null;
  right = null;
  parent = null;

  constructor (value) {
    this.value = value;
  }
}

// 方向
const LEFT_OR_RIGHT = {
  left: "left",
  right: "right",
};

/**
 * 二叉搜索树
 */
class BinarySearchTree {
  // 根节点
  root = null;

  constructor () {
    
  }

  /**
   * 是否为空树
   * @returns {boolean} 是否为空树
   */
  isEmpty () {
    return this.root ? false : true;
  }
  
  /**
   * 判断值是否已经存在
   * @param {number} value 新增的值
   * @returns {boolean} 是否已经存在
   */
   isExist (value) {
    // 查找节点
    let node = this.get(value);

    return node ? true : false;
  }

  /**
   * 查找值的位置
   * @param {number} value 值
   * @param {boolean} isEqual 值是否要和节点的值相等，默认false
   * @returns {Object} 位置信息，包含node/direction两个属性
   */
  findPosition (value, isEqual = false) {
    let position = {
      node: null, // 节点，isEqual为true时是当前节点，为false时是父节点
      direction: LEFT_OR_RIGHT.left // 方向，isEqual为false时才有用
    };

    let node = this.root;

    while (node) {
      if (isEqual && value === node.value) {
        position.node = node;
        break;
      } else if (value < node.value) {
        // 值 < 当前节点的值，则走左边
        if (!node.left) {
          // 左节点为空
          if (!isEqual) {
            // 不是相等
            position.node = node;
            position.direction = LEFT_OR_RIGHT.left;
          }
          break;
        }

        // 继续遍历
        node = node.left;
      } else {
        // 值 > 当前节点的值，则走右边
        if (!node.right) {
          // 右节点为空
          if (!isEqual) {
            // 不是相等
            position.node = node;
            position.direction = LEFT_OR_RIGHT.right;
          }
          break;
        }

        // 继续遍历
        node = node.right;
      }
    }

    return position;
  }

  /**
   * 获取值对应的节点
   * @param {number} value 值
   * @returns {TreeNode | null} 对应的节点，没有则返回空
   */
  get (value) {
    if (this.isEmpty()) {
      return null;
    }

    let {node} = this.findPosition(value, true);

    return node;
  }

  /**
   * 新增数据
   * @param {number} value 新增的值
   * @returns {TreeNode | null} 新增的节点。二叉搜索树中已经存在该值对应的节点的则返回null
   */
  add (value) {
    // 先检查值是否已经存在，已经存在则不用插入
    if (this.isExist(value)) {
      return null;
    }

    // 创建新节点
    let newNode = new TreeNode(value);

    if (this.isEmpty()) {
      // 空树
      this.root = newNode;

      return newNode;
    }

    let {node: parentNode, direction} = this.findPosition(value);

    // 保存新节点
    parentNode[direction] = newNode;
    // 更新新节点的父节点
    newNode.parent = parentNode;

    return newNode;
  }

  /**
   * 删除值对应的节点
   * @param {number} value 值
   * @returns {TreeNode | null} 删除的节点。二叉搜索树中不存在的该值对应的节点则返回null
   */
  delete (value) {
    // 查找要删除的节点
    let {node} = this.findPosition(value, true);

    if (!node) {
      // 不存在则删除失败，没找到对应的节点
      return null;
    }

    let realDelNode = this.deleteNode(node);
    return realDelNode;
  }

  /**
   * 删除节点
   * @param {TreeNode} node 要删除的节点
   * @returns {TreeNode | null} 真正删除的节点。删除节点双子非空，则删除节点 !== 真正删除的节点
   */
  deleteNode (node) {
    if (!node) {
      return null;
    }

    // 真正要删除的节点
    let realDelNode;
    // 删除节点后，要用子节点连上删除节点的父节点
    let childNode;

    if (!node.left || !node.right) {
      // 至少有一个子节点是空的，则真正要删除的节点是本身
      realDelNode = node;
    } else {
      // 双子非空，则要找替代的节点
      realDelNode = this.successor(node);
    }

    // 无论要不要替代的删除节点，都至多只有一个子节点，所以左节点不为空则赋值左节点，否则赋值右节点（不论右节点是不是null）
    if (realDelNode.left !== null) {
      childNode = realDelNode.left;
    } else {
      childNode = realDelNode.right;
    }

    if (childNode) {
      // 子节点非空，则修改子节点的父节点为真正要删除节点的父节点
      childNode.parent = realDelNode.parent;
    }

    if (realDelNode.parent === null) {
      // 真正要删除节点是根节点，则把子节点当成新的根节点
      this.root = childNode;
    } else if (realDelNode.parent.left === realDelNode) {
      // 真正要删除节点是父节点的左节点，更新左节点
      realDelNode.parent.left = childNode;
    } else {
      realDelNode.parent.right = childNode;
    }

    if (realDelNode !== node) {
      // 如果是替代删除，还需要调换值
      node.value = realDelNode.value;
    }

    return realDelNode;
  }

  /**
   * 当删除一个左右子节点非空的节点时，需要找左子树的最大值或者右子树的最小值来
   * 代替要删除的节点，然后互换节点的值
   * @param {TreeNode} node 要删除的节点
   * @returns {TreeNode} 代替的删除节点
   */
  successor (node) {
    // 查找左子树的最大值
    let replaceNode = node.left;

    // 取到最大值所在的节点
    while (replaceNode.right) {
      replaceNode = replaceNode.right;
    }

    return replaceNode;
  }
}


class CanvasRender {
  constructor(container) {
      this.canvas = document.createElement('canvas');
      this.container = container;
      this.ctx = this.canvas.getContext('2d');
  }

  initSize(w, h) {
      this.canvas.width = w;
      this.canvas.height = h;
      this.container.appendChild(this.canvas)
  }

  renderNode(x, y, r, text) {
      this.ctx.beginPath();
      this.ctx.arc(x, y, r, 0, Math.PI*2);
      this.ctx.stroke();
      this.ctx.font = "20px serif";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.fillText(text, x, y);
  }

  renderLine(x1, y1, x2, y2) {
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
  }
}

class TreeDrawer {
  constructor(render) {
      this.render = render;
  }
  layout(root, nodeW, nodeH) {
      function computeWidth(root) {
          if (!root) return 0;
          if (!(root.left || root.right)) {
              root.width = nodeW;
              return root.width;
          }
          root.width = computeWidth(root.left) + computeWidth(root.right) + nodeW;
          return root.width;
      }

      function computePosition(root, left, right, curY = nodeH) {
          if (!root) return;
          let x;
          if (root.left) {
              x = left + root.left.width + nodeW;
          } else {
              x = left + nodeW;
          }
          root.position = [x, curY];
          computePosition(root.left, left, x, curY + nodeH);
          computePosition(root.right, x, right, curY + nodeH);

      }

      computeWidth(root);
      computePosition(root, 0, root.width);
      return root.width;
  }

  draw(root, nodeW=40, nodeH=40) {
      let height = getHeight(root);
      let width = this.layout(root, nodeW, nodeH);
      height = height * nodeH + nodeH;
      this.render.initSize(width + nodeW, height);

      function getHeight (root) {
        if (!root) {
          return 0;
        }

        let depth = 0;
        let children = [root];

        while (children.length) {
          depth++;
          let nextChildren = [];

          children.forEach(child => {
            child.left && nextChildren.push(child.left);
            child.right && nextChildren.push(child.right);
          });
          children = nextChildren;
        }
        return depth;
      }
      // (x, y) ===> (x1, y1)
      // 求出一个向量的单位向量, 方便连线时从圆的边缘开始
      const getVector = (x, y, x1, y1) => {
          let dis = Math.sqrt((x - x1) ** 2 + (y - y1) ** 2);
          return [
              (x1 - x)/dis,
              (y1 - y)/dis
          ]
      }
      const linkNode = (root, child) => {
          let [px, py] = root.position;
          let [cx, cy] = child.position;
          let [dx, dy] = getVector(px, py, cx, cy);
          this.render.renderLine(px + (nodeW/2)*dx, py + (nodeW/2)*dy,
                                 cx - (nodeW/2)*dx, cy - (nodeW/2)*dy)
      }

      const drawNode = (root) => {
          let [x, y] = root.position;
          this.render.renderNode(x, y, nodeW/2, root.value);
      }
      function draw(root) {
          if (!root) return;
          drawNode(root);
          if (root.left) linkNode(root, root.left);
          if (root.right) linkNode(root, root.right);
          draw(root.left);
          draw(root.right);
      }
      draw(root);
  } 
}

let treeDrawer = new TreeDrawer(new CanvasRender(document.querySelectorAll("#result")[0]));
let treeDrawer2 = new TreeDrawer(new CanvasRender(document.querySelectorAll("#result")[0]));

function randomTree (tree, count, max) {
  while (count--) {
    tree.add(Math.ceil(Math.random() * max))
  }
}

let tree = new BinarySearchTree();
function test () {
  randomTree(tree, 20, 100)
  
  treeDrawer.draw(tree.root);

  // tree.delete(23)
  // treeDrawer2.draw(tree.root);
  console.log(tree);
}

test();
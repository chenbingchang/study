function numWays(n, relation, k) {
    // 收集信息，key: 下标，value: 能传递到的数组
    var nextMap = {};
    // 遍历relation收集所能传的下一个的信息
    for (var _i = 0, relation_1 = relation; _i < relation_1.length; _i++) {
        var _a = relation_1[_i], pos = _a[0], next = _a[1];
        if (!nextMap[pos]) {
            // 不存在，则新建
            nextMap[pos] = [];
        }
        // 收集能传递的下一个
        nextMap[pos].push(next);
    }
    var ways = 0;
    // 栈，深度优先
    var stack = [{
            pos: 0,
            k: k // 还有几轮
        }];
    var _loop_1 = function () {
        var info = stack.pop();
        if (!info) {
            return "continue";
        }
        var pos = info.pos;
        var k_1 = info.k;
        if (k_1 === 1) {
            // 还差最后一轮，如果下一轮包含n-1，则是一条可行的方案
            if (nextMap[pos] && nextMap[pos].includes(n - 1)) {
                ways++;
            }
            return "continue";
        }
        // 下一轮的可以有哪些位置
        var nextList = nextMap[pos] || [];
        // 下一轮所有的位置都放到栈中去执行
        nextList.forEach(function (next) {
            stack.push({
                pos: next,
                k: k_1 - 1
            });
        });
    };
    while (stack.length) {
        _loop_1();
    }
    return ways;
}
;
numWays(5, [[0, 2], [2, 1], [3, 4], [2, 3], [1, 4], [2, 0], [0, 4]], 3);

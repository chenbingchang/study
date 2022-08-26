// 官方解法，typescript
function myAtoi(s){
    const automaton = new Automaton()

    for(let c of s) {
        if (automaton.get(c)) {
            // 溢出了直接停止
            break
        }
    }

    return automaton.sign * automaton.ans
};

// 状态
const State = {
    Start : 0,
    Signed : 1,
    InNumber : 2,
    End : 3
}

class Automaton {
    // 最大值
    INT_MAX = 2 ** 31 - 1
    // 最小值
    INT_MIN = 2 ** 31
    // 当前状态
    state = State.Start
    // 符号
    sign = 1
    // 结果
    ans = 0
    // 状态转换表
    table = {
        [State.Start]: [State.Start, State.Signed, State.InNumber, State.End],
        [State.Signed]: [State.End, State.End, State.InNumber, State.End],
        [State.InNumber]: [State.End, State.End, State.InNumber, State.End],
        [State.End]: [State.End, State.End, State.End, State.End],
    }

    get(c) {
        this.state = this.table[this.state][this.getCol(c)]

        if (this.state === State.InNumber) {
            // 数字
            let num = parseInt(c)

            // 判断是否会溢出
            if (
                this.ans > Math.floor(this.INT_MAX / 10) || 
                (
                    this.ans === Math.floor(this.INT_MAX / 10) &&
                    (
                        (this.sign > 0 && num > 7) ||
                        (this.sign < 0 && num > 8)
                    )
                )
            ) {
                // 溢出
                this.ans = this.sign > 0 ? this.INT_MAX : this.INT_MIN
                return true
            }

            this.ans = this.ans * 10 + num
        } else if (this.state === State.Signed) {
            // 符号
            this.sign = c === '+' ? 1 : -1
        } else if (this.state === State.End) {
            // 结束
            return true
        }

        return false
    }

    getCol(c) {
        if (c === ' ') {
            return State.Start
        } else if (c === '-' || c === '+') {
            return State.Signed
        }  else if (c.charCodeAt(0) >= 48 && c.charCodeAt(0) <= 57) {
            // 48~47是数字的码点
            return State.InNumber
        } else {
            return State.End
        }
    }
}

console.log(myAtoi("2147483648"));

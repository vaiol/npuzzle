class State {
    constructor(ctx, field, target) {
        this.ctx = ctx;
        this.target = target.slice();
        this.h_score = null;
        this.g_score = 0;
        this.field = [];
        for (const item of field) {
            this.field.push(item.slice());
        }
        this.size = this.field.length;
        const tmp = [];
        for (const item of this.field) {
            tmp.push(...item);
        }
        this.key = tmp.join('-');
        this.open = false;
        this.closed = false;
    }

    /**
     * Compare method for queue priority
     * @param {State} other
     * @returns {boolean}
     */
    compare(other) {
        return this.getHScore() < other.getHScore()
    }

    /**
     * Swap empty cell with (y, x) cell
     * @param {number} y
     * @param {number} x
     * @returns {State}
     */
    swap(y, x) {
        const [ty, tx] = this.target;
        const field = [];
        for (const item of this.field) {
            field.push(item.slice());
        }
        field[ty][tx] = field[y][x];
        field[y][x] = 0;
        return new State(this.ctx, field, [y, x])
    }

    /**
     * Return positions (y, x) of neighbor cells
     */
    neighbors() {
        const neighborsSet = [];
        const [ty, tx] = this.target;
        for (const item of [[ty + 1, tx], [ty, tx + 1], [ty - 1, tx], [ty, tx - 1]]) {
            const [y, x] = item;
            if (x < 0 || x >= this.size || y < 0 || y >= this.size) {
                continue;
            }
            neighborsSet.push({ y, x });
        }
        return new Set(neighborsSet);
    }


    /**
     * Select and run heuristic function if provided
     * @returns {number}
     */
    getHScore() {
        if (this.h_score)
            return this.h_score;
        let result;
        switch (this.ctx.argv.heuristic) {
            case 3:
                result = this.hammingDistance();
                break;
            case 2:
                result = this.manhattan();
            case 1:
            default:
                result = this.linearConflictsManhattan();
        }
        return result;
    }

    /**
     * Hamming distance
     */
    hammingDistance() {
        if (this.h_score)
            return this.h_score;
        let result = 0;
        for (const [y, row] of this.field.entries()) {
            for (const [x, cell] of row.entries()) {
                if (cell === 0)
                    continue;
                if (this.ctx.goal[y][x] !== cell)
                    result += 1;
            }
        }
        this.h_score = result;
        return this.h_score
    }

    /**
     * Manhattan distance
     */
    manhattan() {
        if (this.h_score)
            return this.h_score;

        let result = 0;
        for (const [y, row] of this.field.entries()) {
            for (const [x, cell] of row.entries()) {
                if (cell === 0)
                    continue;
                const [gy, gx] = this.ctx.goalHash[cell];
                result += Math.abs(y - gy) + Math.abs(x - gx);
            }
        }
        this.h_score = result;
        return this.h_score
    }

    /**
     * Linear conflict, one tile must move up or down or left or right to allow the other to pass by and then back up
     * For each conflict add two moves to the manhattan distance
     * @returns {*}
     */
    linearConflictsManhattan() {
        if (this.h_score)
            return this.h_score;
        const conflictData = { maxY: 0, maxX: 0, num: 0 };
        let result = 0;
        for (const [y, row] of this.field.entries()) {
            for (const [x, cell] of row.entries()) {
                if (cell === 0)
                    continue;
                const goalPos = this.ctx.goalHash[cell];

                this._checkConflict(cell, y, x, goalPos, conflictData);
                result += Math.abs(y - goalPos[0]) +  Math.abs(x - goalPos[1])
            }
            conflictData.maxY = 0;
            conflictData.maxX = 0;
        }
        this.h_score = result + (2 * conflictData['num']);
        return this.h_score
    }

    /**
     * Check vertical and horizontal linear conflict
     * @private
     */
    _checkConflict(value, y, x, goalPos, conflictData) {
        const [gy, gx] = goalPos;

        if (y === gy) {
            if (value > conflictData.maxY)
                conflictData.maxY = value;
            else
                conflictData.num += 1;
        }

        if (x === gx) {
            if (value > conflictData.maxX)
                conflictData.maxX = value;
            else
                conflictData.num += 1;
        }
        return conflictData;
    }
    showField() {
        const w = (this.size * this.size).toString().length + 1;
        let breakLine = '-';
        for (let i = 0; i < this.size; i++) {
            breakLine += '-'.padStart(w);
        }
        console.log(breakLine);
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const toOut = this.field[i][j].toString().padStart(w);
                process.stdout.write(toOut);
            }
            process.stdout.write('\n');
        }
        console.log(breakLine);
    }
}

module.exports = State;

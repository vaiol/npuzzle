/**
 * Class that show state of puzzle field.
 * Represent size, field, target and other information.
 */
class State {
    constructor(ctx, field, target) {
        this.ctx = ctx;
        this.target = target.slice();
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
        this.distanceToTarget = null;
        this.distanceToStart = 0;
    }

    /**
     * Create new neighbor state for current state and chosen coordinate!
     * @param {number} y
     * @param {number} x
     * @returns {State} neighbor
     */
    getNeighbor(y, x) {
        const [ty, tx] = this.target;
        const field = [];
        for (const item of this.field) {
            field.push(item.slice());
        }
        field[ty][tx] = field[y][x];
        field[y][x] = 0;
        const newState = new State(this.ctx, field, [y, x]);
        newState.distanceToStart = this.distanceToStart + 1;
        newState.getDistance();
        return newState;
    }

    /**
     * Return positions (y, x) of neighbor cells
     * @returns {Set<{number, number}>}
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
     * Calculate distance with selected function!
     * @returns {number} distance
     */
    getDistance() {
        if (this.distanceToTarget)
            return this.distanceToTarget;
        let result;
        switch (this.ctx.argv.heuristic) {
            case 3:
                result = this.hammingDistance();
                break;
            case 2:
                result = this.manhattan();
                break;
            case 1:
            default:
                result = this.linearConflictsManhattan();
        }
        this.distanceToTarget = result;
        return result;
    }

    /**
     * Calculate hamming distance
     * @returns {number} distance
     */
    hammingDistance() {
        let result = 0;
        for (const [y, row] of this.field.entries()) {
            for (const [x, cell] of row.entries()) {
                if (cell === 0)
                    continue;
                if (this.ctx.goal[y][x] !== cell)
                    result += 1;
            }
        }
        return result;
    }

    /**
     * Calculate manhattan distance
     * @returns {number} distance
     */
    manhattan() {
        let result = 0;
        for (const [y, row] of this.field.entries()) {
            for (const [x, cell] of row.entries()) {
                if (cell === 0)
                    continue;
                const [gy, gx] = this.ctx.goalHash[cell];
                result += Math.abs(y - gy) + Math.abs(x - gx);
            }
        }
        return result;
    }

    /**
     * Linear conflict, one tile must move up or down or left or right to allow the other to pass by and then back up
     * For each conflict add two moves to the manhattan distance
     * @returns {number} distance
     */
    linearConflictsManhattan() {
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
        return result + (2 * conflictData['num']);
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

    /**
     * display current state field.
     */
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

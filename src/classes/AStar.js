const Queue = require('./HeapQueue');
const State = require('./State');

class AStar {
    constructor(ctx) {
        this.ctx = ctx;
        this.heap = new Queue();
        this.fScoresMap = {};
        this.allStepsMap = {};
        this.iterations = 0;
        this.startTime = null;
        this.startState = new State(this.ctx, this.ctx.field, this.ctx.target);
        this.resultSteps = [];
    }
    getResult(start) {
        let current = this.ctx.goalKey;
        while (current !== start) {
            this.resultSteps.push(current);
            current = this.allStepsMap[current];
        }
        this.resultSteps.push(start);
        this.resultSteps = this.resultSteps.reverse();
        this.ctx.saveResults(this.resultSteps, this.iterations, this.heap.max);
        this.ctx.saveSearchTime(this.startTime);
    }
    search() {
        // if search already done
        if (this.resultSteps.length) {
            return true;
        }
        // set startTime to current
        this.startTime = process.hrtime();
        this.fScoresMap[this.startState.key] = this.startState.getDistance();
        this.startState.showField();
        this.heap.push(this.startState, 0);
        this.allStepsMap[this.startState.key] = null;
        while (!this.heap.empty()) {
            // get state with best priority
            const current = this.heap.pop();
            // if puzzle solved
            if (current.key === this.ctx.goalKey)
                return this.getResult(this.startState.key);
            // for all neighbors of current state
            for (const { x, y } of current.neighbors()) {
                // create neighbor state with g score and distance calculated
                const neighbor = current.getNeighbor(y, x);
                let fScore = (this.ctx.size > 3) ? 1 + neighbor.distanceToTarget : neighbor.distanceToStart + neighbor.distanceToTarget;
                if (this.fScoresMap.hasOwnProperty(neighbor.key) && fScore >= this.fScoresMap[neighbor.key])
                    continue;
                this.fScoresMap[neighbor.key] = fScore;
                this.allStepsMap[neighbor.key] = current.key;
                this.heap.push(neighbor, fScore);
            }
            this.iterations += 1;

            // log iterations
            if (this.ctx.argv.log && this.iterations % 1000 === 0) {
                process.stdout.write(`\rIteration: ${this.iterations}, Queue len: ${this.heap.size()}`);
            }
        }
        console.log();
        throw new Error(`Solution not found. Total iterations: ${this.iterations}`);
    }
}

module.exports = AStar;

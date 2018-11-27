const Queue = require('./HeapQueue');
const State = require('./State');

class AStar {
    constructor(ctx) {
        this.ctx = ctx;
        this.heap = new Queue();
        this.fScore = {};
        this.cameFrom = {};
        this.totalSteps = 0;
    }
    parseHrtimeToSeconds(hrtime) {
        return (hrtime[0] + (hrtime[1] / 1e9)).toFixed(3);
    }
    getResult(start, startTime) {
        console.log('found');
        let current = this.ctx.goalKey;
        let steps = [];
        while (current !== start) {
            steps.push(current);
            current = this.cameFrom[current];
        }
        steps.push(start);
        steps = steps.reverse();
        this.ctx.saveResult(steps, this.totalSteps, this.heap.max);
        this.ctx.searchTime = this.parseHrtimeToSeconds(process.hrtime(startTime));
    }
    search() {
        const startTime = process.hrtime();
        const start = new State(this.ctx, this.ctx.field, this.ctx.target);
        this.fScore[start.key] = start.getHScore();
        start.showField();

        this.heap.push(start, 0);
        this.cameFrom[start.key] = null;
        while (!this.heap.empty()) {
            const current = this.heap.pop();
            // log iteration
            if (this.ctx.argv.log && this.totalSteps % 1000 === 0)
                process.stdout.write(`\rIteration: ${this.totalSteps}, Queue len: ${this.heap.size()}`);
            // set this state to opened
            current.open = true;
            if (current.key === this.ctx.goalKey)
                return this.getResult(start.key, startTime);
            // loop through neighbor positions
            for (const { x, y } of current.neighbors()) {
                // move empty cell to neighbor cell
                const neighbor = current.swap(y, x);
                // calculate neighbor g_score ( the cost from the starting state to the current state )
                neighbor.g_score = current.g_score + 1;
                neighbor.getHScore();
                // calculate evaluation ( f = g + h )
                let f;
                if (this.ctx.size > 3)
                    f = 1 + neighbor.h_score;
                else
                    f = neighbor.g_score + neighbor.h_score;
                // if already processed move on to next
                if (neighbor.closed || (this.fScore.hasOwnProperty(neighbor.key) && f >= this.fScore[neighbor.key]))
                    continue;

                this.fScore[neighbor.key] = f;
                // add to queue
                neighbor.open = true;
                neighbor.closed = true;
                this.heap.push(neighbor, f);
                // set open state

                // add state to graph
                this.cameFrom[neighbor.key] = current.key
            }
            // set this state to be closed
            current.closed = true;

            // add iteration
            this.totalSteps += 1;
        }
        console.log('\nFailed to find', this.totalSteps);
        process.exit(1);
        return null;
    }
}

module.exports = AStar;

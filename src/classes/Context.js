const sleep = require('sleep');

class Context {

    /**
     *
     * @param {object} argv
     * @param {array} field
     */
    constructor(argv, field) {
        this.argv = argv;
        this.size = null;
        this.searchTime = null;
        this.field = field;
        this.goal = [];
        this.goalHash = {};
        this.goalKey = '';
        this.target = [];
        this.results = [];
        this._setField(field);
    }

    /**
     *
     * @param {array} field
     * @private
     */
    _setField(field) {
        this._setSize(field.length);
        for (let i = 0; i < field.length; i++) {
            for (let j = 0; j < field[i].length; j++) {
                if (field[i][j] === 0) {
                    this.target = [i, j];
                }
            }
        }
    }

    /**
     *
     * @param {number} size
     * @private
     */
    _setSize(size) {
        this.size = size;
        // - goal
        for (let i = 0; i < size; i++) {
            this.goal.push([]);
            for (let j = 0; j < size; j++) {
                this.goal[i].push((i * size) + (j + 1));
            }
        }
        this.goal[size - 1][size - 1] = 0
        // - goal hash
        for (const [y, row] of this.goal.entries()) {
            for (const [x, cell] of row.entries()) {
                this.goalHash[cell] = [y, x];
            }
        }
        // - goal keys
        const tmp = [];
        for (const item of this.goal) {
            tmp.push(...item);
        }
        this.goalKey = tmp.join('-');
    }
    printInitPuzzle() {
        console.log('INITIAL PUZZLE');
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
    printPuzzle(field) {
        if (!field) {
            this.printInitPuzzle();
        }
        const w = (this.size * this.size).toString().length + 1;
        let breakLine = '-';
        for (let i = 0; i < this.size; i++) {
            breakLine += '-'.padStart(w);
        }
        if (typeof field === 'string') {
            field = field.split('-');
            for (let i = 0; i < this.size; i++) {
                for (let j = 0; j < this.size; j++) {
                    const toOut = field[i * this.size + j].toString().padStart(w);
                    process.stdout.write(toOut);
                }
                process.stdout.write('\n');
            }
        }
        console.log(breakLine);
    }
    printStats(result) {
        if (this.argv.log) {
            console.log(`Total iterations: ${result.totalIterations}`);
            console.log(`Max heap length : ${result.maxInQueue}`);
        }
        console.log(`Path long       : ${result.steps.length}`);
        console.log(`Search time     : ${this.searchTime}s.`);

    }
    saveResult(steps, totalIterations, maxInQueue) {
        this.results.push({ steps, totalIterations, maxInQueue });
    }

    displayResults() {
        let DELAY = 500;
        if (this.size > 3) {
            DELAY = 100;
        }
        if (this.size > 5) {
            DELAY = 50;
        }
        for (const result of this.results) {
            if (this.argv.log) {
                for (const state of result['steps']) {
                    console.log('\x1Bc');
                    this.printInitPuzzle();
                    console.log('SOLVING PUZZLE');
                    this.printPuzzle(state);
                    this.printStats(result);
                    sleep.msleep(DELAY)
                }
            } else {
                console.log('SOLVING PUZZLE');
                for (const state of result['steps']) {
                    this.printPuzzle(state);
                }
                this.printStats(result);
            }
        }
    }
}

module.exports = Context;

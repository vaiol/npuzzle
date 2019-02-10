const sleep = require('sleep');

/**
 * Class represent context of current npuzzle game!
 */
class Context {
    constructor(argv, field) {
        this.argv = argv;
        this.field = field;
        this.size = this.field.length;
        this.searchTime = null;
        this.goal = [];
        this.goalHash = {};
        this.goalKey = '';
        this.target = [];
        this.results = [];
        this._setTarget();
        // this._setGoal(this.size);
        this._serGoal();
        this._setGoalHash();
        this._setGoalKey();
        console.log(this.goalKey);
    }

    /**
     * set target
     * @private
     */
    _setTarget() {
        for (let i = 0; i < this.field.length; i++) {
            for (let j = 0; j < this.field[i].length; j++) {
                if (this.field[i][j] === 0) {
                    this.target = [i, j];
                }
            }
        }
    }

    /**
     * set goal
     * @private
     */
    _serGoal() {
        for (let i = 0; i < this.size; i++) {
            this.goal.push([]);
            for (let j = 0; j < this.size; j++) {
                this.goal[i].push((i * this.size) + (j + 1));
            }
        }
        this.goal[this.size - 1][this.size - 1] = 0;
        console.log(this.goal);
    }

    _setGoal(n) {
        const size = n;
        // a is the result matrix
        const a = [[]];

        // d is the direction: right, bottom = 1; left, top = -1
        let d = 1;

        // c is the counter value.
        let c = 0;

        // x and y are the coordinates of the number in the matrix
        let x = 0;
        let y = -1;

        // for n in [n ... 0]
        for(; n; n--){

            // NB: the following two for loops are merged in the minified code

            // fill n columns
            for(let i = 0; i < n; i++){

                y += d;
                a[x][y] = ++c;
            }

            // fill n-1 lines
            for(let i = 0; i < n - 1; i++){

                x += d;
                if(!a[x]){
                    a[x] = [];
                }
                a[x][y] = ++c;
            }

            // change direction
            d = -d;
        }
        this.goal = a.map(arr => arr.map(item => (item === size * size) ? 0 : item));
        console.log(this.goal);
    }

    /**
     * set goal hash
     * @private
     */
    _setGoalHash() {
        for (const [y, row] of this.goal.entries()) {
            for (const [x, cell] of row.entries()) {
                this.goalHash[cell] = [y, x];
            }
        }
    }

    /**
     * set goal key
     * @private
     */
    _setGoalKey() {
        const tmp = [];
        for (const item of this.goal) {
            tmp.push(...item);
        }
        this.goalKey = tmp.join('-');
    }

    /**
     * Print Inital state of puzzle.
     */
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

    /**
     * Print puzzle using key!
     * @param {string} field
     */
    printPuzzle(field) {
        const w = (this.size * this.size).toString().length + 1;
        let breakLine = '-';
        for (let i = 0; i < this.size; i++) {
            breakLine += '-'.padStart(w);
        }
        const fieldArr = field.split('-');
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const toOut = fieldArr[i * this.size + j].toString().padStart(w);
                process.stdout.write(toOut);
            }
            process.stdout.write('\n');
        }
        console.log(breakLine);
    }

    /**
     * Print statistic of search
     * @param result
     */
    printStats(result) {
        if (this.argv.log) {
            console.log(`Total iterations: ${result.totalIterations}`);
            console.log(`Max heap length : ${result.maxInQueue}`);
        }
        console.log(`Path long       : ${result.steps.length}`);
        console.log(`Search time     : ${this.searchTime}s.`);

    }

    /**
     * Save result, if puzzle was solved!
     * @param {Array} steps
     * @param {number} totalIterations
     * @param {number} maxInQueue
     */
    saveResults(steps, totalIterations, maxInQueue) {
        this.results.push({ steps, totalIterations, maxInQueue });
    }

    /**
     * Set and calculate search time!
     * Parse hrtime
     * @param startTime
     */
    saveSearchTime(startTime) {
        const hrtime = process.hrtime(startTime);
        this.searchTime = (hrtime[0] + (hrtime[1] / 1e9)).toFixed(3);
    }

    /**
     * Display result, when puzzle was solved.
     */
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

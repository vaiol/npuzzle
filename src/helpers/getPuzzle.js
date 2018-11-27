const fs = require('fs');
const { PythonShell } = require('python-shell');
const isSolvable = require('./isSolvable');

/**
 * Parse plain string rows and validate it!
 * @param {Array} rows
 * @returns {Array} - valid puzzle field
 */
const parseAndValidatePuzzle = (rows) => {
    const result = [];
    const set = new Set();
    rows = rows.map(item => item.replace(/\s+/g,' ').trim());
    rows = rows.filter(item => item);
    rows = rows.filter(item => !item.startsWith('#'));
    const size = parseInt(rows.shift());
    const max = size * size;
    if (!size || size < 0 || rows.length !== size) {
        throw new Error('Size is incorrect');
    }
    if (rows.length !== size) {
        throw new Error('Size not match rows count');
    }
    for (let i = 0; i < size; i++) {
        const numbers = rows[i].split('#')[0].trim().split(' ').map(item => parseInt(item));
        for (const item of numbers) {
            if (isNaN(item)) {
                throw new Error(`Some element is not number (row: ${i+1})`);
            }
            if (item < 0 || item >= max) {
                throw new Error(`Some element is out of range (row: ${i+1})`);
            }
            set.add(item);
        }
        if (numbers.length !== size) {
            throw new Error(`Row: ${i+1} is incorrect length!`);
        }
        result.push(numbers)
    }
    if (set.size !== (max)) {
        throw new Error(`Puzzle has repeated numbers!`);
    }
    return result
};

/**
 * Genrate puzzle using intra.42.fr standard generator.
 * Check subject!
 * @param size
 * @returns {Promise<Array>}
 */
const generatePuzzle = async (size) => {
    let options = {
        mode: 'text',
        scriptPath: 'src/',
        args: [`-S ${size}`, '-s']
    };
    return new Promise((resolve) => {
        PythonShell.run('generator.py', options, function (err, results) {
            if (err) throw err;
            resolve(parseAndValidatePuzzle(results));
        });
    });
};

/**
 * Generate puzzle and check solvability.
 * 3 behaviour available.
 * - generate: do not check solvability
 * - generate-solvable: generate only solvable puzzle
 * - generate-error: generate puzzle and throw error if puzzle unsolvable.
 * @param argv
 * @returns {Promise<Array>}
 */
const generateSolvablePuzzle = async (argv) => {
    const size = argv['generate'] || argv['generate-solvable'] || argv['generate-error'];
    let puzzle = await generatePuzzle(size);
    let solvable = isSolvable(puzzle);
    if (argv['generate-solvable']) {
        while (!solvable) {
            puzzle = await generatePuzzle(size);
            solvable = isSolvable(puzzle);
        }
    }
    if (argv['generate-error'] && !solvable) {
        console.log(puzzle);
        throw new Error('Generated puzzle is unsolvable');
    }
    return puzzle;
};

/**
 * Read puzzle from file, parse plain text to array of numbers and validate it.
 * @param filename
 * @returns {Promise<Array>}
 */
const readPuzzleFromFile = async (filename) => {
    const content = fs.readFileSync(filename, 'utf8');
    let rows = content.split('\n');
    return parseAndValidatePuzzle(rows);
};

/**
 * Get puzzle from array or randomly generated!
 * @param argv
 * @returns {Promise<Array>}
 */
const getPuzzle = async (argv) => {
    let puzzle;

    if (argv.file) {
        puzzle = await readPuzzleFromFile(argv.file);
    } else if (argv['generate'] || argv['generate-solvable'] || argv['generate-error']) {
        puzzle = await generateSolvablePuzzle(argv);
    }
    return puzzle;
};

module.exports = getPuzzle;

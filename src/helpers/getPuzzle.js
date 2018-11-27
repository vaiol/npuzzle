const fs = require('fs');
const { PythonShell } = require('python-shell');
const isSolvable = require('./isSolvable');

const generatePuzzle = async (argv) => {
    let options = {
        mode: 'text',
        scriptPath: 'src/',
        args: [`-S ${argv.g}`, '-s']
    };
    return new Promise((resolve) => {
        PythonShell.run('generator.py', options, function (err, results) {
            if (err) throw err;
            const result = [];
            for (let i = 1; i < results.length; i++) {
                result.push(results[i].toString().replace(/\s+/g,' ').trim().split(' ').map(item => parseInt(item)))
            }
            resolve(result);
        });
    });
};

const generateValidPuzzle = async (argv) => {
    let puzzle;
    let solvable = false;
    while (!solvable) {
        puzzle = await generatePuzzle(argv);
        solvable = isSolvable(puzzle);
    }
    return puzzle;
};

const readPuzzleFromFile = async (filename) => {
    const set = new Set();
    const result = [];
    const content = fs.readFileSync(filename, 'utf8');
    let rows = content.split('\n');
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
    return result;
};

/**
 *
 * @param {object} argv
 * @returns {Promise<void>}
 */
const getPuzzle = async (argv) => {
    let rows;

    if (argv.file) {
        rows = await readPuzzleFromFile(argv.file);
    } else if (argv.generate) {
        rows = await generateValidPuzzle(argv);
    }
    return rows;
};

module.exports = getPuzzle;

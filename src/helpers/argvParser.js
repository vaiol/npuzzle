const fs = require('fs');

module.exports = require('yargs')
    .option('generate', {
        alias: 'g',
        describe: 'Size of the puzzle\'s side. Must be > 3. Optional.',
        type: 'number'
    })
    .option('heuristic', {
        alias: 'H',
        describe: 'Select heuristic function.\n' +
            '1 - Manhattan distance + linear conflict.\n' +
            '2 - Manhattan distance.\n' +
            '3 - Hamming distance\n' +
            'Default 1.',
        type: 'number',
        choices: [1, 2, 3],
        default: 1
    })
    .option('iterations', {
        alias: 'i',
        describe: 'Number of passes. Default 10000. Optional.',
        default: 10000,
        type: 'number'
    })
    .option('file', {
        alias: 'f',
        describe: 'Get puzzle from file. If conflicting overrides everything else.',
        type: 'string'
    })
    .option('log', {
        alias: 'l',
        describe: 'Show log',
        default: false,
        type: 'boolean'
    })
    .option('depth', {
        alias: 'd',
        describe: 'Convert A star to depth-first search by ignoring distance from starting position.',
        default: false,
        type: 'boolean'
    })
    .check(argv => {
        if (!argv.file && !argv.generate) {
            return '\'genrate\' or \'file\' option should be provided'
        }
        return true;
    })
    .check(argv => {
        if (argv.generate < 3) {
            return 'Can\'t generate a puzzle with size lower than 3.'
        }
        return true;
    })
    .check(argv => {
        if (argv.file) {
            if (!fs.existsSync(argv.file))
                return `File '${argv.file}' doesn't exist!`;
            if (fs.lstatSync(argv.file).isDirectory()) {
                return `'${argv.file}' directory, not file!`;
            }
        }

        return true;
    })
    .argv;


const fs = require('fs');

module.exports = require('yargs')
    .option('generate', {
        describe: 'Choose size of generating puzzle.',
        type: 'number'
    })
    .option('generate-solvable', {
        alias: 'g',
        describe: 'Generate only solvable puzzle.',
        type: 'number'
    })
    .option('generate-error', {
        describe: 'Generate and throw error if puzzle unsolvable.',
        type: 'number'
    })
    .option('heuristic', {
        alias: 'H',
        describe: '1: Manhattan distance + linear conflict.\n' +
            '2: Manhattan distance.\n' +
            '3: Hamming distance\n',
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
        describe: 'Read puzzle from file.',
        type: 'string'
    })
    .option('log', {
        alias: 'l',
        describe: 'Show log',
        default: false,
        type: 'boolean'
    })
    .check(argv => {
        if (!argv.file && !argv.generate && !argv['generate-solvable'] && !argv['generate-error']) {
            return '\'generate\' or \'file\' option should be provided'
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


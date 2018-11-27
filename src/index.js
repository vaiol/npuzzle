#!/usr/bin/env node
'use strict';

const argv = require('./helpers/argvParser');
const Context = require('./classes/Context');
const AStar = require('./classes/AStar');
const puzzle = require('./helpers/getPuzzle');


const main = async () => {
    console.time('search');
    const puzzleField = await puzzle(argv);
    const ctx = new Context(argv, puzzleField);
    const aStar = new AStar(ctx);
    aStar.search();
    ctx.displayResults();
    console.timeEnd('search');
};

main().catch(err => {
    console.error(err);
});

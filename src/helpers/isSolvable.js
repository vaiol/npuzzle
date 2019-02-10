const isSolvableSnail = (arrayMap) => {
    const size = arrayMap.length;
    const array = [].concat(...arrayMap); // flatten


    let inv = 0;
    for (const [i, puzzle] of array.entries()) {
        for (const elem of array.slice(i)) {
            if (!puzzle) {
                break;
            }
            if (elem > puzzle) {
                inv += 1
            }
        }
    }
    const is_inv_even = inv % 2 === 0;

    if (size % 2 !== 0) { // size not even
        return !is_inv_even
    }


    const odds = [].concat(...arrayMap.filter((element, index) => {
        return (index % 2 === 0);
    }));
    const evens = [].concat(...arrayMap.filter((element, index) => {
        return (index % 2 !== 0);
    }));
    if (odds.includes(0)) {
        return is_inv_even
    } else if (evens.includes(0)) {
        return !is_inv_even
    }
    return false;
};

const countInversions = (arr) => {
    if (arr.length === 1) {
        return [arr, 0];
    }
    const slice = parseInt(arr.length / 2);
    const tmpA = arr.slice(0, slice);
    const tmpB = arr.slice(slice);
    const [partA, invA] = countInversions(tmpA);
    const [partB, invB] = countInversions(tmpB);
    let inversions = 0 + invA + invB;

    const partC = [];
    let i = 0;
    let j = 0;
    while (i < partA.length && j < partB.length) {
        if (partA[i] <= partB[j]) {
            partC.push(partA[i]);
            i += 1;
        } else {
            partC.push(partB[j]);
            j += 1;
            inversions += (partA.length - i);
        }
    }
    partC.push(...partA.slice(i));
    partC.push(...partB.slice(j));

    return [partC, inversions];
};

const isSolvable = (array) => {
    const size = array.length;
    array = [].concat(...array);
    const zeroY = size - parseInt(array.indexOf(0) / size) + 2;
    array = array.filter(item => item !== 0);
    const [_, inversions] = countInversions(array);
    if (size % 2 === 0) {
        if (zeroY % 2 === 0) {
            return !inversions % 2 === 0
        }
        return inversions % 2 === 0
    }
    return inversions % 2 === 0
};

module.exports = {
    isSolvable,
    isSolvableSnail,
};



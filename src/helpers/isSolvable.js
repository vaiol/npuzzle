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

module.exports = isSolvable;



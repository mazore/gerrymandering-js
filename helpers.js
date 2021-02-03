/** Returns the number of times `value` appears in the array */
Array.prototype.count = function(value) {
    return this.reduce((a, v) => (v === value ? a + 1 : a), 0)
}

/** Returns if array contains `obj` (using the `id` of `obj`) */
Array.prototype.containsObject = function(obj) {
    for (const item of this) {
        if (item.id == obj.id) {
            return true;
        }
    }
    return false;
}

/** Returns an array of `length` with values of `value` */
function filledArray(value, length) {
    return Array(length).fill(value)
}

/** Groups same values, from https://codegolf.stackexchange.com/a/173976 */
Array.prototype.group = function(f){
    const r = []
    let k = r
    for (const i of this) {
        k !== (k = f ? f(i) : i) ? r.push(a = [i]) : a.push(i);
    }
    return r
}

/** Returns the given array shuffled */
function shuffled(original) {
    copied = [...original]
    for (let i = copied.length - 1; i > 0; i--) {
        const j = floor(random() * (i + 1));
        [copied[i], copied[j]] = [copied[j], copied[i]];
    }
    return copied;
}

/** Pass in a list of [(item, weight), ...], from https://blobfolio.com/2019/randomizing-weighted-choices-in-javascript */
function weightedChoice(data) {
    let total = 0;
    for (let i = 0; i < data.length; i++) {
        total += data[i][1];

    }
    const threshold = Math.random() * total;
    total = 0;
    for (let i = 0; i < data.length - 1; ++i) {
        total += data[i][1];
        if (total >= threshold) {
            return data[i][0];
        }
    }
    return data[data.length - 1][0];
}

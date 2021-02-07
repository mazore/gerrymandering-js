/** Returns a random item from `arr` */
function choice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

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

/**
 * Returns the distance between points, use lessThan or greaterThan for comparisons to
 * avoid using costly square root function
 */
function distance(x1, y1, x2, y2, lessThan=null, greaterThan=null) {
    if (lessThan != null)
        return ((x2 - x1) ** 2 + (y2 - y1) ** 2) < lessThan ** 2
    if (greaterThan != null)
        return ((x2 - x1) ** 2 + (y2 - y1) ** 2) > greaterThan ** 2
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

/** Returns an array of `length` with values of `value` */
function filledArray(value, length) {
    return Array(length).fill(value)
}

/** Returns r, g, and b channels (strings) from 'rgb(r, g, b)' string */
function getRGB(str) {
    return str.match(/\d+/g);
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

/** Returns 'rgb(r, g, b)' string that is `percent` percent towards white, 1 being white, 0 being no change */
function lighten(str, percent) {
    let [r, g, b] = getRGB(str);
    r = parseInt(r) + (255 - r)*percent;
    g = parseInt(g) + (255 - g)*percent;
    b = parseInt(b) + (255 - b)*percent;
    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

/** Increments the value at the given key by `amount` */
Map.prototype.increment = function(key, amount=1) {
    this.set(key, (this.get(key) ?? 0) + amount);
}

/** Shuffle and return the given array, from https://github.com/processing/p5.js/blob/main/src/utilities/array_functions.js#L209 */
function shuffled(arr) {
    let idx = arr.length;
    while (idx > 1) {
        const rnd = (Math.random(0, 1) * idx) | 0;
        idx--;
        [arr[idx], arr[rnd]] = [arr[rnd], arr[idx]];
    }
    return arr;
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

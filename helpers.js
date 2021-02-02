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

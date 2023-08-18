"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.explode_array = exports.compact_list = exports.suffix = exports.prefix = exports.rev = exports.concat = exports.len = exports.equals = exports.cons = exports.nil = void 0;
exports.nil = "nil";
function cons(hd, tl) {
    return { kind: "cons", hd: hd, tl: tl };
}
exports.cons = cons;
/**
 * Determines whether L and R contain the same (===) elements in the same order
 * @param L first list to compare
 * @param R second list to compare
 * @returns true if both are nil or both are non-nil, L.hd === R.hd, and
 *     equals(L.tl, R.tl)
 */
function equals(L, R) {
    if (L === exports.nil) {
        return R === exports.nil;
    }
    else if (R === exports.nil) {
        return false;
    }
    else if (L.hd !== R.hd) {
        return false;
    }
    else {
        return equals(L.tl, R.tl);
    }
}
exports.equals = equals;
/**
 * Returns the length of the list.
 * @param L list whose length should be returned
 * @returns 0 if L = nil else 1 + len(tail(L))
 */
function len(L) {
    if (L === exports.nil) {
        return 0;
    }
    else {
        return 1 + len(L.tl);
    }
}
exports.len = len;
/**
 * Returns the a list consisting of L followed by R.
 * @param L list to go at the front of the result
 * @param R list to go at the end of the result
 * @returns A single list consisting of L's elements followed by R's
 */
function concat(L, R) {
    if (L === exports.nil) {
        return R;
    }
    else {
        return cons(L.hd, concat(L.tl, R));
    }
}
exports.concat = concat;
/**
 * Returns the reverse of the given list.
 * @param L list to revese
 * @returns list containing the same elements but in reverse order
 */
function rev(L) {
    if (L === exports.nil) {
        return exports.nil;
    }
    else {
        return concat(rev(L.tl), cons(L.hd, exports.nil));
    }
}
exports.rev = rev;
/**
 * Returns the first n elements of the list.
 * @param n number of elements to return
 * @param L list in question
 * @requires n <= len(L)
 * @returns nil if n = 0 else cons(L.hd, prefix(n - 1, L.tl))
 */
function prefix(n, L) {
    if (n === 0) {
        return exports.nil;
    }
    else if (L === exports.nil) {
        throw new Error('ran out of elements trying to get a prefix');
    }
    else {
        return cons(L.hd, prefix(n - 1, L.tl));
    }
}
exports.prefix = prefix;
/**
 * Returns everything after the first n elements of the list.
 * @param n number of elements to skip
 * @param L list in question
 * @requires n <= len(L)
 * @returns L if n = 0 else suffix(n - 1, L.tl)
 */
function suffix(n, L) {
    if (n === 0) {
        return L;
    }
    else if (L === exports.nil) {
        throw new Error('ran out of elements trying to get a suffix');
    }
    else {
        return suffix(n - 1, L.tl);
    }
}
exports.suffix = suffix;
/**
 * Returns the elements of a list, packed into an array.
 * @param L the list to turn into an array
 * @returns array containing the same elements as in L in the same order
 */
function compact_list(L) {
    var arr = [];
    while (L !== exports.nil) {
        arr.push(L.hd);
        L = L.tl;
    }
    return arr;
}
exports.compact_list = compact_list;
/**
 * Returns the elements in the given array as a list.
 * @param arr the array to turn into a list
 * @returns list containing the same elements as in arr in the same order
 */
function explode_array(arr) {
    var L = exports.nil;
    for (var i = arr.length - 1; i >= 0; i--) {
        L = cons(arr[i], L);
    }
    return L;
}
exports.explode_array = explode_array;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9saXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUlhLFFBQUEsR0FBRyxHQUFHLEtBQUssQ0FBQztBQUV6QixTQUFnQixJQUFJLENBQUksRUFBSyxFQUFFLEVBQVc7SUFDeEMsT0FBTyxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFDLENBQUM7QUFDeEMsQ0FBQztBQUZELG9CQUVDO0FBR0Q7Ozs7OztHQU1HO0FBQ0gsU0FBZ0IsTUFBTSxDQUFJLENBQVUsRUFBRSxDQUFVO0lBQzlDLElBQUksQ0FBQyxLQUFLLFdBQUcsRUFBRTtRQUNiLE9BQU8sQ0FBQyxLQUFLLFdBQUcsQ0FBQztLQUNsQjtTQUFNLElBQUksQ0FBQyxLQUFLLFdBQUcsRUFBRTtRQUNwQixPQUFPLEtBQUssQ0FBQztLQUNkO1NBQU0sSUFBSSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUU7UUFDeEIsT0FBTyxLQUFLLENBQUM7S0FDZDtTQUFNO1FBQ0wsT0FBTyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDM0I7QUFDSCxDQUFDO0FBVkQsd0JBVUM7QUFFRDs7OztHQUlHO0FBQ0gsU0FBZ0IsR0FBRyxDQUFJLENBQVU7SUFDL0IsSUFBSSxDQUFDLEtBQUssV0FBRyxFQUFFO1FBQ2IsT0FBTyxDQUFDLENBQUM7S0FDVjtTQUFNO1FBQ0wsT0FBTyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUN0QjtBQUNILENBQUM7QUFORCxrQkFNQztBQUVEOzs7OztHQUtHO0FBQ0gsU0FBZ0IsTUFBTSxDQUFJLENBQVUsRUFBRSxDQUFVO0lBQzlDLElBQUksQ0FBQyxLQUFLLFdBQUcsRUFBRTtRQUNiLE9BQU8sQ0FBQyxDQUFDO0tBQ1Y7U0FBTTtRQUNMLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNwQztBQUNILENBQUM7QUFORCx3QkFNQztBQUVEOzs7O0dBSUc7QUFDSCxTQUFnQixHQUFHLENBQUksQ0FBVTtJQUMvQixJQUFJLENBQUMsS0FBSyxXQUFHLEVBQUU7UUFDYixPQUFPLFdBQUcsQ0FBQztLQUNaO1NBQU07UUFDTCxPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLFdBQUcsQ0FBQyxDQUFDLENBQUM7S0FDM0M7QUFDSCxDQUFDO0FBTkQsa0JBTUM7QUFFRDs7Ozs7O0dBTUc7QUFDSCxTQUFnQixNQUFNLENBQUksQ0FBUyxFQUFFLENBQVU7SUFDN0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ1gsT0FBTyxXQUFHLENBQUM7S0FDWjtTQUFNLElBQUksQ0FBQyxLQUFLLFdBQUcsRUFBRTtRQUNwQixNQUFNLElBQUksS0FBSyxDQUFDLDRDQUE0QyxDQUFDLENBQUM7S0FDL0Q7U0FBTTtRQUNMLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDeEM7QUFDSCxDQUFDO0FBUkQsd0JBUUM7QUFFRDs7Ozs7O0dBTUc7QUFDSCxTQUFnQixNQUFNLENBQUksQ0FBUyxFQUFFLENBQVU7SUFDN0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ1gsT0FBTyxDQUFDLENBQUM7S0FDVjtTQUFNLElBQUksQ0FBQyxLQUFLLFdBQUcsRUFBRTtRQUNwQixNQUFNLElBQUksS0FBSyxDQUFDLDRDQUE0QyxDQUFDLENBQUM7S0FDL0Q7U0FBTTtRQUNMLE9BQU8sTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQzVCO0FBQ0gsQ0FBQztBQVJELHdCQVFDO0FBRUQ7Ozs7R0FJRztBQUNILFNBQWdCLFlBQVksQ0FBSSxDQUFVO0lBQ3hDLElBQU0sR0FBRyxHQUFRLEVBQUUsQ0FBQztJQUNwQixPQUFPLENBQUMsS0FBSyxXQUFHLEVBQUU7UUFDZCxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNmLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDO0tBQ1o7SUFDRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFQRCxvQ0FPQztBQUVEOzs7O0dBSUc7QUFDSCxTQUFnQixhQUFhLENBQUksR0FBcUI7SUFDcEQsSUFBSSxDQUFDLEdBQVksV0FBRyxDQUFDO0lBQ3JCLEtBQUssSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUN0QyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUN2QjtJQUNELE9BQU8sQ0FBQyxDQUFDO0FBQ1gsQ0FBQztBQU5ELHNDQU1DIn0=
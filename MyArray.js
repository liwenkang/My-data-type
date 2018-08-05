const log = console.log.bind(console)

function quickSort(ary) {
    if (ary.length <= 1) {
        return ary
    }
    var sentinel = ary[Math.floor(Math.random() * ary.length)]
    var left = []
    var mid = []
    var right = []
    for (var i = 0; i < ary.length; i++) {
        if (ary[i] < sentinel) {
            left.push(ary[i])
        } else if (ary[i] === sentinel) {
            mid.push(ary[i])
        } else {
            right.push(ary[i])
        }
    }
    return quickSort(left).concat(mid, quickSort(right))
}

class MyArray {
    // 构造函数
    constructor(...args) {
        if (args.length === 1 && typeof args[0] === "number") {
            //到这了
            if (args[0] < Math.pow(2, 32)) {
                for (var i = 0; i < args[0]; i++) {
                    this[i] = undefined
                }
            }
        } else {
            for (var i = 0; i < args.length; i++) {
                this[i] = args[i]
            }
        }
    }

    static from(arrayLike) {
        var array = new MyArray()
        if (typeof arrayLike === "string") {
            for (var i = 0; i < arrayLike.length; i++) {
                array.push(arrayLike[i])
            }
        }
        if (Array.isArray(arrayLike)) {
            for (var i = 0; i < arrayLike.length; i++) {
                array.push(arrayLike[i])
            }
        }
        return array
    }

    static isArray(value) {
        if (value instanceof this) {
            return true
        } else {
            return false
        }
    }

    static of(...args) {
        return MyArray.prototype.slice.call(arguments)
    }

    get length() {
        var count = 0
        for (var i in this) {
            count++
        }
        return count
    }

    push(value) {
        this[this.length] = value
        return this
    }

    pop() {
        // 删掉末尾的
        delete this[this.length - 1]
        return this
    }

    shift() {
        // 从头删除
        delete this[0]
        // 后面的要重排序
        for (var i in this) {
            this[i - 1] = this[i]
        }
        delete this[this.length - 1]
        return this
    }

    unshift(value) {
        // 从前面添加
        for (var i in this) {
            this[parseInt(i + 1)] = this[i]
        }
        this[0] = value
        return this
    }

    indexOf(searchElement, fromIndex = 0) {
        for (var i = fromIndex; i < this.length; i++) {
            if (this[i] === searchElement) {
                return i
            }
            // NaN
            if (searchElement !== searchElement) {
                if (this[i] !== this[i]) {
                    return i
                }
            }
        }
        return -1
    }

    slice(begin = 0, end = this.length) {
        // 不改变原数组

        // 复制一份 this 给 that
        var that = new MyArray()
        for (var i in this) {
            that[i] = this[i]
        }

        // 把 0 ~ begin 内的都删掉
        for (var i = 0; i < begin; i++) {
            delete that[i]
        }

        // 把 end ~ 最后的都删掉
        for (var i = end; i < this.length; i++) {
            delete that[i]
        }

        // 恢复 index
        var result = new MyArray()
        for (var i in that) {
            result.push(that[i])
        }
        return result
    }

    concat(...values) {
        // 不能改变this
        var that = new MyArray()
        for (var i in this) {
            that[i] = this[i]
        }

        for (var i = 0; i < values.length; i++) {
            for (var item in values[i]) {
                that.push(values[i][item])
            }
        }
        return that
    }

    splice(start, deleteCount, ...items) {
        // 改变原数组
        var preArr = this.slice(0, start)
        var midArr = new MyArray(...items)
        var endArr = this.slice(start + deleteCount)
        var result = preArr.concat(midArr, endArr)

        var deleteArr = this.slice(start, start + deleteCount)

        if (this.length <= result.length) {
            // this 的少
            for (var i in result) {
                this[i] = result[i]
            }
        } else {
            // this.length 多
            for (var i in this) {
                if (parseInt(i) < result.length) {
                    this[i] = result[i]
                } else {
                    delete this[i]
                }
            }
        }
        return deleteArr
    }

    copyWithin(target, start = 0, end = this.length) {
        if (target < 0) {
            if (Math.abs(target) < this.length) {
                target = this.length + target
            } else {
                target = 0
            }
        }
        if (target > this.length) {
            return this
        }

        if (start < 0) {
            if (Math.abs(start) < this.length) {
                start = this.length + start
            } else {
                start = 0
            }
        }

        if (end < 0) {
            if (Math.abs(end) < this.length) {
                end = this.length + end
            } else {
                end = 0
            }
        }

        var preArr = this.slice(0, target)
        var midArr = this.slice(start, end)
        var endArr = this.slice(target + end - start)
        var result = preArr.concat(midArr, endArr)
        result = result.slice(0, this.length)
        return result
    }

    fill(value, start = 0, end = this.length) {
        while (start < 0) {
            start = this.length + start
        }
        while (end < 0) {
            end = this.length + end
        }

        for (var i = start; i < end && i < this.length; i++) {
            this[i] = value
        }
        return this
    }

    find(callback, thisArg = this) {
        for (var i = 0; i < thisArg.length; i++) {
            if (callback(thisArg[i])) {
                return thisArg[i]
            }
        }
        return undefined
    }

    // 迭代器不会写
    entries() {
        var result = new MyArray()
        for (var i = 0; i < this.length; i++) {
            result.push(new MyArray(i, this[i]))
        }
        // ????
    }

    every(callback, thisArg = this) {
        for (var i = 0; i < thisArg.length; i++) {
            if (!callback(thisArg[i])) {
                return false
            }
        }
        return true
    }

    filter(callback, thisArg) {
        // 不更改原有的,复制一份
        var that = new MyArray()
        for (var i in this) {
            that[i] = this[i]
        }

        for (var i = 0; i < that.length; i++) {
            if (!callback(that[i])) {
                that.splice(i, 1)
                i--
            }
        }
        return that
    }

    findIndex(callback, thisArg = this) {
        for (var i = 0; i < thisArg.length; i++) {
            if (callback(thisArg[i])) {
                return i
            }
        }
        return -1
    }

    flat(depth = 1) {
        var count = 0
        while (count < depth) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] instanceof MyArray) {
                    var array = this[i]
                    this.splice(i, 1)
                    for (var j = 0; j < array.length; j++) {
                        this.push(array[j])
                    }
                    i--
                    i += array.length
                }
            }
            count++
        }
        return this
    }

    forEach(func, thisArg = this) {
        for (var i = 0; i < thisArg.length; i++) {
            func(thisArg[i], i, thisArg)
        }
    }

    includes(searchElement, fromIndex) {
        return this.indexOf(searchElement, fromIndex) >= 0
    }

    join(string = ",") {
        var result = ""
        for (var i = 0; i < this.length; i++) {
            if (i < this.length - 1) {
                result += this[i] + string
            } else {
                result += this[i]
            }
        }
        return result
    }

    // 没法写
    keys() {
        var result = new MyArray()
        for (var i = 0; i < this.length; i++) {
            result.push(i)
        }
        return result[Symbol.iterator]()
    }

    lastIndexOf(searchElement, fromIndex = this.length - 1) {
        if (fromIndex < 0) {
            fromIndex = this.length + fromIndex
        }

        if (fromIndex >= this.length) {
            fromIndex = this.length - 1
        }

        for (var i = fromIndex; i >= 0; i--) {
            if (this[i] === searchElement) {
                return i
            }

            if (searchElement !== searchElement && this[i] !== this[i]) {
                return i
            }
        }
        return -1
    }

    map(func, thisArg = this) {
        var that = new MyArray()
        for (var i in thisArg) {
            that[i] = this[i]
        }
        for (var i = 0; i < that.length; i++) {
            that[i] = func(that[i])
        }
        return that
    }

    reduce(callback, initialValue) {
        for (var i = 0; i < this.length; i++) {
            initialValue = callback(initialValue, this[i])
        }
        return initialValue
    }

    reduceRight(callback, initialValue) {
        for (var i = this.length - 1; i >= 0; i--) {
            initialValue = callback(initialValue, this[i])
        }
        return initialValue
    }

    reverse() {
        for (var i = 0; i < Math.floor(this.length / 2); i++) {
            var tmp = this[i]
            this[i] = this[this.length - 1 - i]
            this[this.length - 1 - i] = this[i]
        }
        return this
    }

    some(callback, thisArg = this) {
        for (var i = 0; i < thisArg.length; i++) {
            if (callback(thisArg[i], i, thisArg)) {
                return true
            }
        }
        return false
    }

    // 喵喵喵
    sort() {
        // 升序方法
        for (var i = 0; i < this.length; i++) {
            for (var j = 0; j < this.length - i; j++) {
                if (this[j] > this[j + 1]) {    /*改成<就是降序*/
                    var transferDate = this[j]
                    this[j] = this[j + 1]
                    this[j + 1] = transferDate
                }
            }
        }
        return this
    }

    // 没法写
    values() {

    }

    toString() {
        return this.join(",")
    }
}

// push, shift, unshift, pop()
// var fruits = new MyArray('Apple', 'Banana')
// console.log(fruits.length)
//--------------------------------------------
// var first = fruits[0]
// log(first)
// // Apple
//--------------------------------------------
// var last = fruits[fruits.length - 1]
// log(last)
// // Banana
//--------------------------------------------
// fruits.forEach(function (item, index, array) {
//     console.log(item, index)
// })
// Apple 0
// Banana 1
//--------------------------------------------
// fruits.push('Orange')
// // log(newLength)
// // ["Apple", "Banana", "Orange"]
//--------------------------------------------
// fruits.pop() // remove Orange (from the end)
// // log(last)
// // ["Apple", "Banana"];
//--------------------------------------------
// fruits.shift() // remove Apple from the front
// log(fruits)
// // ["Banana"];
//--------------------------------------------
// fruits.unshift('Strawberry') // add to the front
// log(fruits)
// // ["Strawberry", "Banana"];
//--------------------------------------------
// fruits.push('Mango')
// // ["Strawberry", "Banana", "Mango"]
//--------------------------------------------

// indexOf()
// var pos = fruits.indexOf('Banana')
// log(pos)

// splice() 测试
// var myFish = new MyArray('angel', 'clown', 'mandarin', 'sturgeon')
// var removed = myFish.splice(2, 0, 'drum')
//
// log("myFish", myFish)
// log("removed", removed)
// ----------------------------------------------------------
// var myFish = new MyArray('angel', 'clown', 'drum', 'mandarin', 'sturgeon')
// var removed = myFish.splice(3, 1)
//
// log("myFish", myFish)
// log("removed", removed)
// // myFish is ["angel", "clown", "drum", "sturgeon"]
// // removed is ["mandarin"]

// concat() 测试
// var num1 = new MyArray(1, 2, 3)
// var num2 = new MyArray(4, 5, 6)
// var num3 = new MyArray(7, 8, 9)
//
// var nums = num1.concat(num2, num3)
//
// console.log(nums)
// // results in [1, 2, 3, 4, 5, 6, 7, 8, 9]

// slice() 测试
// var myFish = new MyArray('angel', 'clown', 'mandarin', 'sturgeon')
// var removed = myFish.slice(2)
//
// log("myFish", myFish)
// log("removed", removed)
//-------------------------------------
// var fruits = ['Banana', 'Orange', 'Lemon', 'Apple', 'Mango'];
// var citrus = fruits.slice(1, 3);
//
// log(fruits)
// log(citrus)
// // fruits contains ['Banana', 'Orange', 'Lemon', 'Apple', 'Mango']
// // citrus contains ['Orange','Lemon']

// copyWithin() 测试
// log(new MyArray(1, 2, 3, 4, 5).copyWithin(-2))
// // [1, 2, 3, 1, 2]
// log(new MyArray(1, 2, 3, 4, 5).copyWithin(0, 3))
// // [4, 5, 3, 4, 5]
// log(new MyArray(1, 2, 3, 4, 5).copyWithin(0, 3, 4))
// // [4, 2, 3, 4, 5]
// log(new MyArray(1, 2, 3, 4, 5).copyWithin(-2, -3, -1))
// // [1, 2, 3, 3, 4]

// fill() 测试
// log(new MyArray(1, 2, 3).fill(4))               // [4, 4, 4]
// log(new MyArray(1, 2, 3).fill(4, 1))            // [1, 4, 4]
// log(new MyArray(1, 2, 3).fill(4, 1, 2))         // [1, 4, 3]
// log(new MyArray(1, 2, 3).fill(4, 1, 1))         // [1, 2, 3]
// log(new MyArray(1, 2, 3).fill(4, 3, 3))         // [1, 2, 3]
// log(new MyArray(1, 2, 3).fill(4, -3, -2))       // [4, 2, 3]
// log(new MyArray(1, 2, 3).fill(4, NaN, NaN))     // [1, 2, 3]
// log(new MyArray(1, 2, 3).fill(4, 3, 5))         // [1, 2, 3]
// log(new MyArray(3).fill(4))                     // [4, 4, 4]
// log(new MyArray().fill.call({length: 3}, 4))     // {0: 4, 1: 4, 2: 4, length: 3}
// //
// // // Objects by reference.
// var arr = new MyArray(3).fill({}) // [{}, {}, {}];
// arr[0].hi = "hi" // [{ hi: "hi" }, { hi: "hi" }, { hi: "hi" }]
// log(arr)

// find() 测试
// var inventory = new MyArray(
//     {name: 'apples', quantity: 2},
//     {name: 'bananas', quantity: 0},
//     {name: 'cherries', quantity: 5}
// )
//
// function isCherries(fruit) {
//     return fruit.name === 'cherries'
// }
//
// console.log(inventory.find(isCherries))
// // { name: 'cherries', quantity: 5 }
// -----------------------------------------------------
// const inventory = new MyArray(
//     {name: 'apples', quantity: 2},
//     {name: 'bananas', quantity: 0},
//     {name: 'cherries', quantity: 5}
// )
//
// const result = inventory.find(fruit => fruit.name === 'cherries')
//
// console.log(result) // { name: 'cherries', quantity: 5 }
// ----------------------------------------------------------
// function isPrime(element, index, array) {
//     var start = 2
//     while (start <= Math.sqrt(element)) {
//         if (element % start++ < 1) {
//             return false
//         }
//     }
//     return element > 1
// }
//
// console.log(new MyArray(4, 6, 8, 12).find(isPrime)) // undefined, not found
// console.log(new MyArray(4, 5, 8, 12).find(isPrime)) // 5
// ------------------------------------------------------------
// 没考虑稀疏数组
// // Declare array with no element at index 2, 3 and 4
// var array = new MyArray(0, 1, , , , 5, 6)
//
// // Shows all indexes, not just those that have been assigned values
// array.find(function (value, index) {
//     console.log('Visited index ' + index + ' with value ' + value)
// })
//
// Shows all indexes, including deleted
// array.find(function (value, index) {
//
//     // Delete element 5 on first iteration
//     if (index == 0) {
//         console.log('Deleting array[5] with value ' + array[5])
//         delete array[5]
//     }
//     // Element 5 is still visited even though deleted
//     console.log('Visited index ' + index + ' with value ' + value)
// })
// expected output:
// Deleting array[5] with value 5
// Visited index 0 with value 0
// Visited index 1 with value 1
// Visited index 2 with value undefined
// Visited index 3 with value undefined
// Visited index 4 with value undefined
// Visited index 5 with value undefined
// Visited index 6 with value 6

// entries() 测试失败
// var a = new MyArray('a', 'b', 'c')
// var iterator = a.entries()
//
// for (let e of iterator) {
//     console.log(e)
// }
// // [0, 'a']
// // [1, 'b']
// // [2, 'c']

// every() 测试
// function isBigEnough(element, index, array) {
//     return element >= 10
// }
//
// log(new MyArray(12, 5, 8, 130, 44).every(isBigEnough))// false
// log(new MyArray(12, 54, 18, 130, 44).every(isBigEnough)) // true

// filter() 测试
// function isBigEnough(value) {
//     return value >= 10
// }
//
// var filtered = new MyArray(12, 5, 8, 130, 44).filter(isBigEnough)
// log(filtered)
// // filtered is [12, 130, 44]/
// -----------------------------------------------------------
// var arr = new MyArray(
//     {id: 15},
//     {id: -1},
//     {id: 0},
//     {id: 3},
//     {id: 12.2},
//     {},
//     {id: null},
//     {id: NaN},
//     {id: 'undefined'}
// )
//
// var invalidEntries = 0
//
// function isNumber(obj) {
//     return obj !== undefined && typeof(obj) === 'number' && !isNaN(obj)
// }
//
// function filterByID(item) {
//     if (isNumber(item.id) && item.id !== 0) {
//         return true
//     }
//     invalidEntries++
//     return false
// }
//
// var arrByID = arr.filter(filterByID)
//
// console.log('Filtered Array\n', arrByID)
// // Filtered Array
// // [{ id: 15 }, { id: -1 }, { id: 3 }, { id: 12.2 }]
//
// console.log('Number of Invalid Entries = ', invalidEntries)
// // Number of Invalid Entries = 5
// -------------------------------------------------------------------------
// var fruits = new MyArray('apple', 'banana', 'grapes', 'mango', 'orange')
//
// /**
//  * Array filters items based on search criteria (query)
//  */
// function filterItems(query) {
//     return fruits.filter(function (el) {
//         return el.toLowerCase().indexOf(query.toLowerCase()) > -1
//     })
// }
//
// console.log(filterItems('ap')) // ['apple', 'grapes']
// console.log(filterItems('an')) // ['banana', 'mango', 'orange']
// --------------------------------------------------------------------------
// const fruits = new MyArray('apple', 'banana', 'grapes', 'mango', 'orange')
//
// /**
//  * Array filters items based on search criteria (query)
//  */
// const filterItems = (query) => {
//     return fruits.filter((el) =>
//         el.toLowerCase().indexOf(query.toLowerCase()) > -1
//     )
// }
//
// console.log(filterItems('ap')) // ['apple', 'grapes']
// console.log(filterItems('an')) // ['banana', 'mango', 'orange']

// findIndex() 测试
// function isPrime(element, index, array) {
//     var start = 2;
//     while (start <= Math.sqrt(element)) {
//         if (element % start < 1) {
//             return false;
//         } else {
//             start++;
//         }
//     }
//     return element > 1;
// }
//
// console.log(new MyArray(4, 6, 8, 12).findIndex(isPrime)) // -1, not found
// console.log(new MyArray(4, 6, 7, 12).findIndex(isPrime)) // 2
// -----------------------------------------------------------------------------
// const fruits = new MyArray("apple", "banana", "cantaloupe", "blueberries", "grapefruit")
//
// const index = fruits.findIndex(fruit => fruit === "blueberries")
//
// console.log(index) // 3
// console.log(fruits[index]) // blueberries

// flat() 测试
// var arr1 = new MyArray(1, 2, new MyArray(3, 4))
// log(arr1.flat())
// // [1, 2, 3, 4]
//
// var arr2 = new MyArray(1, 2, new MyArray(3, 4, new MyArray(5, 6)))
// log(arr2.flat())
// // // [1, 2, 3, 4, [5, 6]]
// //
// var arr3 = new MyArray(1, 2, new MyArray(3, 4, new MyArray(5, 6)))
// log(arr3.flat(2))
// // [1, 2, 3, 4, 5, 6]
//

// includes() 测试
// log(new MyArray(1, 2, 3).includes(2))// true
// log(new MyArray(1, 2, 3).includes(4))// false
// log(new MyArray(1, 2, 3).includes(3, 3))// false
// log(new MyArray(1, 2, 3).includes(3, -1))// true
// log(new MyArray(1, 2, NaN).includes(NaN))// true
// -------------------------------------------------------
// var arr = new MyArray('a', 'b', 'c')
//
// log(arr.includes('c', 3))   // false
// log(arr.includes('c', 100)) // false
// -------------------------------------------------------
// var arr = new MyArray('a', 'b', 'c')
//
// log(arr.includes('a', -100)) // true
// log(arr.includes('b', -100)) // true
// log(arr.includes('c', -100)) // true

// isArray() 测试
// all following calls return true
// log(MyArray.isArray(new MyArray()))
// log(MyArray.isArray(new MyArray(1)))
// log(MyArray.isArray(new MyArray('a', 'b', 'c', 'd')))
// log(MyArray.isArray(new MyArray(3)))
// Little known fact: Array.prototype itself is an array: //测试失败
// log(MyArray.isArray(MyArray.prototype))
// --------------------------------------------------------------------
// // all following calls return false
// log(MyArray.isArray())
// log(MyArray.isArray({}))
// log(MyArray.isArray(null))
// log(MyArray.isArray(undefined))
// log(MyArray.isArray(17))
// log(MyArray.isArray('Array'))
// log(MyArray.isArray(true))
// log(MyArray.isArray(false))
// log(MyArray.isArray({__proto__: Array.prototype}))

// join() 测试
// var a = ['Wind', 'Rain', 'Fire']
// log(a.join()) // 'Wind,Rain,Fire'
// log(a.join(', ')) // 'Wind, Rain, Fire'
// log(a.join(' + ')) // 'Wind + Rain + Fire'
// log(a.join('')) // 'WindRainFire'
// ----------------------------------------------------------------
// function f(a, b, c) {
//     var s = Array.prototype.join.call(arguments);
//     console.log(s); // '1,a,true'
// }
// f(1, 'a', true);
// //expected output: "1,a,true"

// keys()测试 失败
// var array1 = new MyArray('a', 'b', 'c')
// var iterator = array1.keys()
//
// for (let key of iterator) {
//     console.log(key) // expected output: 0 1 2
// }

// lastIndexOf() 测试
// var numbers = new MyArray(2, 5, 9, 2)
// log(numbers.lastIndexOf(2)) // 3
// log(numbers.lastIndexOf(7))// -1
// log(numbers.lastIndexOf(2, 3)) // 3
// log(numbers.lastIndexOf(2, 2)) // 0
// log(numbers.lastIndexOf(2, -2)) // 0
// log(numbers.lastIndexOf(2, -1)) // 3
// -------------------------------------------
// var indices = new MyArray()
// var array = new MyArray('a', 'b', 'a', 'c', 'a', 'd')
// var element = 'a'
// var idx = array.lastIndexOf(element)
// while (idx !== -1) {
//     indices.push(idx)
//     idx = (idx > 0 ? array.lastIndexOf(element, idx - 1) : -1)
// }
//
// console.log(indices)
// // [4, 2, 0]

// map() 测试
// var numbers = new MyArray(1, 4, 9)
// var roots = numbers.map(Math.sqrt)
// log(numbers)
// log(roots)
// // numbers is still [1, 4, 9]
// // roots is now [1, 2, 3]
// ---------------------------------------------------------
// var kvArray = new MyArray({key: 1, value: 10},
//     {key: 2, value: 20},
//     {key: 3, value: 30})
//
// var reformattedArray = kvArray.map(obj => {
//     var rObj = {}
//     rObj[obj.key] = obj.value
//     return rObj
// })
//
// log(reformattedArray)
// log(kvArray)
// // reformattedArray is now [{1: 10}, {2: 20}, {3: 30}],
//
// // kvArray is still:
// // [{key: 1, value: 10},
// //  {key: 2, value: 20},
// //  {key: 3, value: 30}]
//----------------------------------------------------------
// var numbers = new MyArray(1, 4, 9)
// var doubles = numbers.map(function (num) {
//     return num * 2
// })
//
// log(doubles)
// log(numbers)
// // doubles is now [2, 8, 18]
// // numbers is still [1, 4, 9]
//----------------------------------------------------------
// var map = MyArray.prototype.map;
// var a = map.call('Hello World', function(x) {
//     return x.charCodeAt(0);
// });
// log(a)
// // a now equals [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100]

// of 测试
// log(MyArray.of(1))         // [1]
// log(MyArray.of(1, 2, 3))   // [1, 2, 3]
// log(MyArray.of(undefined)) // [undefined]

// reduce() 测试
// var sum = new MyArray(0, 1, 2, 3).reduce(function (accumulator, currentValue) {
//     return accumulator + currentValue
// }, 0)
// log(sum)
// // sum is 6
//----------------------------------------------------------------
// var initialValue = 0;
// var sum = new MyArray({x: 1}, {x:2}, {x:3}).reduce(function (accumulator, currentValue) {
//     return accumulator + currentValue.x;
// },initialValue)
//
// console.log(sum) // logs 6
//----------------------------------------------------------------
// var flattened = new MyArray(new MyArray(0, 1), new MyArray(2, 3), new MyArray(4, 5)).reduce(
//     function (accumulator, currentValue) {
//         return accumulator.concat(currentValue)
//     },
//     new MyArray()
// )
//
// log(flattened)
// // flattened is [0, 1, 2, 3, 4, 5]
//----------------------------------------------------------------
// var names = new MyArray('Alice', 'Bob', 'Tiff', 'Bruce', 'Alice')
//
// var countedNames = names.reduce(function (allNames, name) {
//     if (name in allNames) {
//         allNames[name]++
//     }
//     else {
//         allNames[name] = 1
//     }
//     return allNames
// }, {})
// log(countedNames)
// // countedNames is:
// // { 'Alice': 2, 'Bob': 1, 'Tiff': 1, 'Bruce': 1 }

// reduceRight() 测试
// var flattened = new MyArray(new MyArray(0, 1), new MyArray(2, 3), new MyArray(4, 5)).reduceRight(function (a, b) {
//     return a.concat(b)
// }, new MyArray())
// log(flattened)
// // flattened is [4, 5, 2, 3, 0, 1]

// reverse() 测试
// const a = new MyArray(1, 2, 3)
//
// console.log(a) // [1, 2, 3]
//
// a.reverse()
//
// console.log(a) // [3, 2, 1]

// some() 测试
// function isBiggerThan10(element, index, array) {
//     return element > 10
// }
//
// log(new MyArray(2, 5, 8, 1, 4).some(isBiggerThan10))  // false
// log(new MyArray(12, 5, 8, 1, 4).some(isBiggerThan10)) // true

// sort() 测试失败
// var numbers = new MyArray(4, 2, 5, 1, 3)
//
// numbers.sort(
//     function (a, b) {
//         return a - b
//     }
// )
//
// console.log(numbers)
// // [1, 2, 3, 4, 5]

// values() 测试
// var a = new MyArray('w', 'y', 'k', 'o', 'p')
// var iterator = a.values()
//
// console.log(iterator.next().value) // w
// console.log(iterator.next().value) // y
// console.log(iterator.next().value) // k
// console.log(iterator.next().value) // o
// console.log(iterator.next().value) // p

// toString() 测试
// var array1 = new MyArray(1, 2, 'a', '1a')
//
// console.log(array1.toString())
// // expected output: "1,2,a,1a"

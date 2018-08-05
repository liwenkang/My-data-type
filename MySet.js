const log = console.log.bind(console)

// 使用数组,模拟实现 Set

class MySet {
    // 构造函数
    constructor(array = []) {
        // 接受一个数组作为初始化
        if (!Array.isArray(array)) {
            throw new Error("请输入一个数组用于初始化 Set")
        }
        // this._values 是实际存储 数据的数组
        this._values = []
        array.forEach(value => this.add(value))

        // 为了实现 set.@@iterator
        this[Symbol.iterator] = function () {
            return this._values[Symbol.iterator]()
        }

        this.prototype = {
            writable: false,
            enumerable: false,
            configurable: false
        }
    }

    // 属性
    get size() {
        return this._values.length
    }

    // 方法
    has(value) {
        for (var item of this._values) {
            if (item === value || (item !== item && value !== value)) {
                return true
            }
        }
        return false
    }

    add(value) {
        if (!this.has(value)) {
            this._values.push(value)
        }
        return this
    }

    forEach(func, thisArg = this) {
        for (var i = 0; i < thisArg.size; i++) {
            func(thisArg._values[i], thisArg._values[i], thisArg._values)
        }
    }

    clear() {
        this._values = []
    }

    delete(value) {
        if (this.has(value)) {
            for (var i = 0; i < this.size; i++) {
                if (this._values[i] === value ||
                    (this._values[i] !== this._values[i] && value !== value)
                ) {
                    this._values.splice(i, 1)
                    return true
                }
            }
        } else {
            return false
        }
    }

    // 这个解决方案不好
    entries() {
        var result = []
        for (var i = 0; i < this.size; i++) {
            result.push([this._values[i], this._values[i]])
        }
        return result[Symbol.iterator]()
    }

    values() {
        return this._values[Symbol.iterator]()
    }

    keys() {
        return this._values[Symbol.iterator]()
    }
}

// // 测试 has()
// const set1 = new MySet([1, 2, 3, 4, 5])
//
// console.log(set1.has(1))
// // expected output: true
//
// console.log(set1.has(5))
// // expected output: true
//
// console.log(set1.has(6))
// // expected output: false

// // 测试 add()
// var mySet = new MySet()
// mySet.add(1)
// mySet.add(5).add('some text') // chainable
//
// console.log(mySet)
// // Set [1, 5, "some text"]
//----------------------------------------------------
// const set1 = new Set();
//
// set1.add(42);
// set1.add(42);
// set1.add(13);
//
// for (let item of set1) {
//     console.log(item);
//     // expected output: 42
//     // expected output: 13
// }

// // 测试 clear()
// const set1 = new MySet()
// set1.add(1);
// set1.add('foo');
//
// console.log(set1.size);
// // expected output: 2
//
// set1.clear();
//
// console.log(set1.size);
// // expected output: 0
//-----------------------------------------
// var mySet = new MySet()
// mySet.add(1)
// mySet.add('foo')
//
// log(mySet.size)       // 2
// log(mySet.has('foo')) // true
//
// mySet.clear()
//
// log(mySet.size)       // 0
// log(mySet.has('bar'))  // false

// // 测试 delete() 和 forEach
// const set1 = new MySet()
// set1.add({x: 10, y: 20}).add({x: 20, y: 30})
//
// // // Delete any point with `x > 10`.
// set1.forEach(function (point) {
//     if (point.x > 10) {
//         set1.delete(point)
//     }
// })
//
// console.log(set1)
// console.log(set1.size)
// // expected output: 1

// // 测试 entries()
// const set1 = new MySet()
// set1.add(42)
// set1.add('forty two')
//
// const iterator1 = set1.entries()
//
// for (let entry of iterator1) {
//     console.log(entry)
//     // expected output: [42, 42]
//     // expected output: ["forty two", "forty two"]
// }
//-----------------------------------------------------
// var mySet = new MySet()
// mySet.add('foobar')
// mySet.add(1)
// mySet.add('baz')
//
// var setIter = mySet.entries()
//
// console.log(setIter.next().value) // ["foobar", "foobar"]
// console.log(setIter.next().value) // [1, 1]
// console.log(setIter.next().value) // ["baz", "baz"]

// // 测试 values()
// var mySet = new MySet()
// mySet.add('foo')
// mySet.add('bar')
// mySet.add('baz')
//
// var setIter = mySet.values()
//
// console.log(setIter.next().value) // "foo"
// console.log(setIter.next().value) // "bar"
// console.log(setIter.next().value) // "baz"

// // 测试 keys()
// var mySet = new MySet();
// mySet.add('foo');
// mySet.add('bar');
// mySet.add('baz');
//
// var setIter = mySet.keys();
//
// console.log(setIter.next().value); // "foo"
// console.log(setIter.next().value); // "bar"
// console.log(setIter.next().value); // "baz"

// // 测试 set.@@iterator
// var mySet = new MySet()
// mySet.add('0')
// mySet.add(1)
// mySet.add({})
//
// var setIter = mySet[Symbol.iterator]()
//
// console.log(setIter.next().value) // "0"
// console.log(setIter.next().value) // 1
// console.log(setIter.next().value) // Object
//----------------------------------------------------
// var mySet = new MySet();
// mySet.add('0');
// mySet.add(1);
// mySet.add({});
//
// for (var v of mySet) {
//     console.log(v);
// }

// 测试 Set.@@species 失败
// log(MySet[Symbol.species])
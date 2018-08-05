const log = console.log.bind(console)

// 私有 indexOf 方法, 为了查询 NaN
function _indexOf(array, searchElement, fromIndex = 0) {
    if (searchElement !== searchElement) {
        if (fromIndex < 0) {
            if (fromIndex + array.length > 0) {
                fromIndex = fromIndex + array.length
            } else {
                fromIndex = 0
            }
        }
        // NaN
        for (var i = fromIndex; i < array.length; i++) {
            if (array[i] !== array[i]) {
                return i
            }
        }
    } else {
        return array.indexOf(searchElement, fromIndex)
    }
}

// 使用数组,模拟实现 Map
class MyMap {
    // 构造函数
    constructor(array = []) {
        if(!Array.isArray(array)) {
            throw new Error("请输入一个数组用于初始化 Map")
        }
        // 接受一个数组作为初始化
        // [['foo', 3], ['bar', {}], ['baz', undefined]]

        // this._keys 是实际存储 keys
        this._keys = []
        // this._values 是实际存储 value
        this._values = []

        array.forEach(value => this.set(value[0], value[1]))

        this[Symbol.iterator] = function () {
            return this.entries()
        }

        // Map.@@species ???
        // map.@@toStringTag ???
    }

    get size() {
        return this._keys.length
    }

    // 方法
    set(key, value) {
        // 由于在 Map 中 传入相同 key 不同 value 的对象时, 后者会将前者覆盖
        var index = _indexOf(this._keys, key)
        if (index >= 0) {
            // 已有,覆盖掉
            this._values[index] = value
        } else {
            // 没有
            this._keys.push(key)
            this._values.push(value)
            return this
        }
    }

    has(key) {
        return _indexOf(this._keys, key) >= 0
    }

    get(key) {
        var index = _indexOf(this._keys, key)
        return this._values[index]
    }

    clear() {
        this._keys = []
        this._values = []
        return this
    }

    delete(key) {
        var index = _indexOf(this._keys, key)
        if (index >= 0) {
            this._keys.splice(index, 1)
            return true
        } else {
            return false
        }
    }

    forEach(func, thisArg = this) {
        for (var i = 0; i < thisArg.size; i++) {
            func(thisArg._values[i], thisArg._keys[i], thisArg)
        }
    }

    keys() {
        return this._keys[Symbol.iterator]()
    }

    values() {
        return this._values[Symbol.iterator]()
    }

    entries() {
        var result = []
        for (var i = 0; i < this.size; i++) {
            result.push([this._keys[i], this._values[i]])
        }
        return result[Symbol.iterator]()
    }
}

// has() 测试
// var myMap = new MyMap()
// myMap.set('bar', "foo")
//
// log(myMap.has('bar'))  // returns true
// log(myMap.has('baz'))  // returns false

// set() size get() 测试
// var myMap = new MyMap()
//
// var keyString = 'a string',
//     keyObj = {},
//     keyFunc = function () {
//     }
//
// // setting the values
// myMap.set(keyString, "value associated with 'a string'")
// myMap.set(keyObj, 'value associated with keyObj')
// myMap.set(keyFunc, 'value associated with keyFunc')
//
// log(myMap.size) // 3
//
// // getting the values
// log(myMap.get(keyString))   // "value associated with 'a string'"
// log(myMap.get(keyObj))   // "value associated with keyObj"
// log(myMap.get(keyFunc))   // "value associated with keyFunc"
//
// log(myMap.get('a string'))   // "value associated with 'a string'"
// // because keyString === 'a string'
// log(myMap.get({}))           // undefined, because keyObj !== {}
// log(myMap.get(function () {
// })) // undefined, because keyFunc !== function () {}

// clear() 测试
// var myMap = new MyMap()
// myMap.set('bar', 'baz')
// myMap.set(1, 'foo')
//
// log(myMap.size)    // 2
// log(myMap.has('bar')) // true
//
// myMap.clear()
//
// log(myMap.size)    // 0
// log(myMap.has('bar'))// false

// delete() 测试
// var myMap = new MyMap()
// myMap.set('bar', 'foo')
//
// log(myMap.delete('bar')) // Returns true. Successfully removed.
// log(myMap.has('bar')) // Returns false. The "bar" element is no longer present.

// forEach() 测试
// function logMapElements(value, key, map) {
//     console.log(`m[${key}] = ${value}`)
// }
//
// new MyMap([['foo', 3], ['bar', {}], ['baz', undefined]]).forEach(logMapElements)
// // logs:
// // "m[foo] = 3"
// // "m[bar] = [object Object]"
// // "m[baz] = undefined"

// keys(), values() 测试
// var myMap = new MyMap()
// myMap.set('0', 'foo')
// myMap.set(1, 'bar')
// myMap.set({}, 'baz')
//
// // var mapIter = myMap.keys()
// //
// // console.log(mapIter.next().value) // "0"
// // console.log(mapIter.next().value) // 1
// // console.log(mapIter.next().value) // Object
//
// var mapIter = myMap.values();
//
// console.log(mapIter.next().value); // "foo"
// console.log(mapIter.next().value); // "bar"
// console.log(mapIter.next().value); // "baz"

// entries() 测试
// var myMap = new MyMap();
// myMap.set('0', 'foo');
// myMap.set(1, 'bar');
// myMap.set({}, 'baz');
//
// var mapIter = myMap.entries();
//
// console.log(mapIter.next().value); // ["0", "foo"]
// console.log(mapIter.next().value); // [1, "bar"]
// console.log(mapIter.next().value); // [Object, "baz"]

// map.@@iterator 测试
// const myMap = new MyMap()
// myMap.set('0', 'foo')
// myMap.set(1, 'bar')
// myMap.set({}, 'baz')
//
// const mapIter = myMap[Symbol.iterator]()
//
// console.log(mapIter.next().value) // ["0", "foo"]
// console.log(mapIter.next().value) // [1, "bar"]
// console.log(mapIter.next().value) // [Object, "baz"]
// --------------------------------------------------------------------
// const myMap = new MyMap();
// myMap.set('0', 'foo');
// myMap.set(1, 'bar');
// myMap.set({}, 'baz');
//
// for (const entry of myMap) {
//     console.log(entry);
// }
// // ["0", "foo"]
// // [1, "bar"]
// // [{}, "baz"]
//
// for (const [key, value] of myMap) {
//     console.log(`${key}: ${value}`);
// }
// // 0: foo
// // 1: bar
// // [Object]: baz

//  map.@@toStringTag 测试失败
// var map1 = Object.prototype.toString.call(new MyMap())
//
// console.log(map1)
// // expected output: "[object Map]"

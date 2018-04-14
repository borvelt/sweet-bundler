/* eslint-disable */

function foo({
  name: x
}) {
  console.log(x)
}

// foo({name: 50});

function bar({
  x,
  y,
  z
}) {
  console.log(x, y, z)
}

// bar({x: 20, y: 10, z: 99});

const fibonacci = {
  [Symbol.iterator]: () => {
    let pre = 0,
      cur = 1
    return {
      next() {
        [pre, cur] = [cur, pre + cur]
        return {
          done: false,
          value: cur
        }
      },
    }
  },
}
//
// for (let n of fibonacci) {
//   if (n > 1000)
//     break;
//   console.log(n);
// }

const fibonacciGenerator = {
  [Symbol.iterator]: function* () {
    let pre = 0,
      cur = 1
    while (true) {
      [pre, cur] = [cur, pre + cur]
      yield cur
    }
  },
}

// for (let g of fibonacciGenerator) {
//   if (g > 1000)
//     break;
//   console.log(g);
// }

const target = {
  test: true
}

const handler = {
  // target.prop
  get: (target, prop) => {
    return target[prop]
  },
  // target.prop = value
  set: (target, prop, value) => {
    target[prop] = value
    return target
  },
  // 'prop' in target
  has: (target, prop) => {
    return target.hasOwnProperty(prop)
  },
  // delete target.prop
  deleteProperty: (target, prop) => {
    delete target[prop]
    return target
  },
  // target(...args)
  apply: (target, ...args) => {},
  // new target(...args)
  construct: (target, ...args) => {},
  // Object.getOwnPropertyDescriptor(target, 'prop')
  getOwnPropertyDescriptor: (target, prop) => {

  },
  // Object.defineProperty(target, 'prop', descriptor)
  defineProperty: (target, prop, descriptor) => {
    Object.defineProperty(target, prop, descriptor)
  },
  // Object.getPrototypeOf(target), Reflect.getPrototypeOf(target),
  // target.__proto__, object.isPrototypeOf(target), object instanceof target
  getPrototypeOf: () => {},
  // Object.setPrototypeOf(target), Reflect.setPrototypeOf(target)
  setPrototypeOf: () => {},
  // for (let i in target) {}
  enumerate: (target) => {
    return [1, 2, 3][Symbol.iterator]()
  },
  // Object.keys(target)
  ownKeys: (target) => {
    return ['a']
  },
  // Object.preventExtensions(target)
  preventExtensions: (target) => {
    Object.preventExtensions(target)
    return true
  },
  // Object.isExtensible(target)
  isExtensible: () => {
    return false
  },
}

// const p = new Proxy(target, handler);

function resolveAfter2Seconds(x) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(x)
    }, 2000)
  })
}

async function add1(x) {
  const a = resolveAfter2Seconds(20)
  const b = resolveAfter2Seconds(30)
  return x + await a + await b
}

// add1(10).then(v => {
//   console.log(v);
// });

const obj1 = {
  test1: 10,
  test2: 20
}
const obj2 = {
  test3: 30
}
obj2.__proto__ = obj1

export const sum = (a, b) => {
  return a + b
}
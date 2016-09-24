const slice = Array.prototype.slice

const _curry = (n, fn, curryArgs = []) => {
  return (...args) => {
    var concatArgs = curryArgs.concat(args)

    if (n > concatArgs.length) {
      return _curry(n, fn, concatArgs)
    } else {
      return fn.apply(null, slice.call(concatArgs, 0, n))
    }
  }
}

export function curryN (n, fn) {
  return _curry(n, fn)
}

export const curry1 = curryN(2, curryN)(1)
export const curry2 = curryN(2, curryN)(2)
export const curry3 = curryN(2, curryN)(3)
export const curry4 = curryN(2, curryN)(4)

export const apply = curry2((fn, args) => fn.apply(null, args))

export const identity = a => a
export const always = a => true

export const when = curry2((predicates, value) => {
  const {length} = predicates
  for (let i = 0; i < length; i++) {
    const [predicate, resolve] = predicates[i]

    if (predicate(value)) { return resolve(value) }
  }
})

export function compose (...fns) {
  fns.push(apply(fns.pop()))
  return (...args) => fns.reduceRight((memo, fn) => fn(memo), args)
}

export function inputPredicate (...types) {
  return input => input.nodeName === 'INPUT' && types.indexOf(input.type) > -1
}

export function selectPredicate (multiple) {
  return input => input.nodeName === 'SELECT' && input.multiple === multiple
}

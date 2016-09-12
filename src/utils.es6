export function apply (fn, ...args) {
  const app = (args) => fn.apply(null, args)

  return args.length > 0 ? app(args) : app
}

export function compose (...fns) {
  fns.push(apply(fns.pop()))
  return (...args) => fns.reduceRight((memo, fn) => fn(memo), args)
}

export function when (predicates, value, ...args) {
  const fn = (value, ...args) => {
    const {length} = predicates
    for (let i = 0; i < length; i++) {
      const [predicate, resolve] = predicates[i]

      if (predicate(value)) { return resolve(value, ...args) }
    }
  }

  return value ? fn(value, ...args) : fn
}

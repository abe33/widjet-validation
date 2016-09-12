import {parent, asArray} from 'widjet-utils'

export function fieldValue (field, resolvers) {
  if (!field) { return }

  return when(resolvers, field)

  function when (resolvers, field) {
    const {length} = resolvers
    for (let i = 0; i < length; i++) {
      const [predicate, resolve] = resolvers[i]

      if (predicate(field)) { return resolve(field) }
    }
  }
}

export default [
  [i => i.nodeName === 'INPUT' && i.type === 'checkbox', i => i.checked],
  [i => i.nodeName === 'INPUT' && i.type === 'radio', i => {
    const container = parent(i, 'form')
    const checked = container && container.querySelector(`[name="${i.name}"]:checked`)
    return checked ? checked.value : undefined
  }],
  [i => i.nodeName === 'SELECT' && i.multiple, i => optionValues(i)],
  [i => i.nodeName === 'SELECT' && !i.multiple, i => optionValues(i)[0]],
  [i => true, i => i.value]
]

function optionValues (i) {
  return asArray(i.querySelectorAll('option'))
  .filter(o => o.selected)
  .map(o => o.value)
}

import {parent, asArray} from 'widjet-utils'

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

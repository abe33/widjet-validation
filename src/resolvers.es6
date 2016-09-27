import {parent, asArray, always} from 'widjet-utils'
import {inputPredicate, selectPredicate} from './utils'

export default [
  [inputPredicate('checkbox'), i => i.checked],
  [inputPredicate('number', 'range'), i => i.value && parseFloat(i.value)],
  [inputPredicate('radio'), i => radioValue(parent(i, 'form'), i.name)],
  [selectPredicate(true), i => optionValues(i)],
  [selectPredicate(false), i => optionValues(i)[0]],
  [always, i => i.value]
]

function optionValues (input) {
  return asArray(input.querySelectorAll('option'))
  .filter(o => o.selected)
  .map(o => o.value)
}

function radioValue (form, name) {
  const checked = form && form.querySelector(`[name="${name}"]:checked`)
  return checked ? checked.value : undefined
}

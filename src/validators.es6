import {inputPredicate} from './utils'

export function validatePresence (i18n, t) {
  return (t != null) && t.length !== 0 ? null : i18n('blank_value')
}

export function validateChecked (i18n, t) {
  return t ? null : i18n('unchecked')
}

export function validateEmail (i18n, t) {
  return validatePresence(i18n, t) || /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/.test(t.toUpperCase())
    ? null
    : i18n('invalid_email')
}

export default [
  [inputPredicate('email'), validateEmail],
  [inputPredicate('checkbox'), validateChecked],
  [i => true, validatePresence]
]

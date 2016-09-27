import {inputPredicate} from './utils'
import {always} from 'widjet-utils'

export function validatePresence (i18n, value) {
  return value != null && value.length !== 0 ? null : i18n('blank_value')
}

export function validateChecked (i18n, value) {
  return value ? null : i18n('unchecked')
}

export function validateEmail (i18n, value) {
  return validatePresence(i18n, value) || (
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/.test(value.toUpperCase())
      ? null
      : i18n('invalid_email')
  )
}

export default [
  [inputPredicate('email'), validateEmail],
  [inputPredicate('checkbox'), validateChecked],
  [always, validatePresence]
]

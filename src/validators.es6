
const defaultI18n = s => s

export function validatePresence (t, i18n = defaultI18n) {
  return (t != null) && t !== '' ? null : i18n('blank value')
}

export function validateChecked (t, i18n = defaultI18n) {
  return t ? null : i18n('must be checked')
}

export function validateEmail (t, i18n = defaultI18n) {
  return validatePresence(t) || /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/.test(t.toUpperCase())
    ? null
    : i18n('invalid email')
}

export default {
  email: validateEmail,
  checkbox: validateChecked
}

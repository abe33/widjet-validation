import {inputPredicate, attributePredicate} from './utils';
import {always, when} from 'widjet-utils';

export function nativeValidation(i18n, value, input) {
  return input.checkValidity() ? null : labelForValidity(input);
}

const MESSAGES = {
  badInput: 'bad_input',
  customError: 'custom_error',
  patternMismatch: 'pattern_mismatch',
  rangeOverflow: 'range_overflow',
  rangeUnderflow: 'range_underflow',
  stepMismatch: 'step_mismatch',
  tooLong: 'too_long',
  tooShort: 'too_short',
  typeMismatch: 'type_mismatch',
  valueMissing: 'value_missing',
};

function labelForValidity(input) {
  return Object.keys(MESSAGES).reduce((memo, key) => {
    if (memo) { return memo; }
    if (input.validity[key]) { return MESSAGES[key]; }
    return null;
  }, null);
}

export function validatePresence(i18n, value) {
  return value != null && value.length !== 0 ? null : i18n('blank_value');
}

export function validateChecked(i18n, value) {
  return value ? null : i18n('unchecked');
}

export function validateEmail(i18n, value) {
  return validatePresence(i18n, value) || (
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/.test(value.toUpperCase())
      ? null
      : i18n('invalid_email')
  );
}

const match = (re, s) => new RegExp(re).test(s);

const escDot = s => s.replace('.', '\\.');

const compact = a => a.filter(v => v != null);

const getFileValidator = when([
  [s => /^\./.test(s), s => f => match(`${escDot(s)}$`, f.name)],
  [s => /\/\*/.test(s), s => f => match(`^${s.replace('*', '')}`, f.type)],
  [always, s => f => f.type === s],
]);

export function validateAccept(i18n, value, input) {
  const accepted = input.getAttribute('accept').split(',');
  const validators = accepted.map(getFileValidator);
  const results = compact(value.map(file =>
    validators.some(f => f(file))
      ? null
      : i18n('invalid_file_type', {file: value.name})
  ));
  return results.length ? results.join('\n') : null;
}

export default [
  [inputPredicate('email'), validateEmail],
  [inputPredicate('checkbox'), validateChecked],
  [attributePredicate('required'), validatePresence],
  [always, nativeValidation],
];

import widgets from 'widjet';
import {DisposableEvent, Disposable, CompositeDisposable} from 'widjet-disposables';
import {when, apply, curry2, compose, identity, asArray, getNode, detachNode, fill, mapEach} from 'widjet-utils';

import DEFAULT_VALIDATORS, {validatePresence, validateChecked, validateEmail, validateAccept} from './validators';
import DEFAULT_RESOLVERS from './resolvers';

export { DEFAULT_VALIDATORS, DEFAULT_RESOLVERS, validatePresence, validateChecked, validateEmail, validateAccept };

widgets.define('live-validation', (options) => {
  const validator = getValidator(options);
  const events = options.events || 'change blur';
  const inputBuffer = options.inputBuffer || 0;

  return (input) => {
    input.validate = () => validator(input);

    if (options.validateOnInit) { input.validate(); }

    return new CompositeDisposable([
      new DisposableEvent(input, events, withInputBuffer(inputBuffer, () => input.validate())),
      new Disposable(() => delete input.validate),
    ]);
  };
});

widgets.define('form-validation', (options) => {
  const fieldSelector = options.fieldSelector || 'input, select, textarea';
  const events = options.events || 'submit';
  const validator = getValidator(options);
  const reducer = (memo, item) =>
    (item.validate ? item.validate() : validator(item)) || memo;

  return (form) => {
    form.validate = () =>
      asArray(form.querySelectorAll(fieldSelector)).reduce(reducer, false);

    if (options.validateOnInit) { form.validate(); }

    return new CompositeDisposable([
      new Disposable(() => {
        form.removeAttribute('novalidate');
        delete form.validate;
      }),
      new DisposableEvent(form, events, (e) => {
        const hasErrors = form.validate();
        if (hasErrors) {
          e.stopImmediatePropagation();
          e.preventDefault();
        }
        return !hasErrors;
      }),
    ]);
  };
});

export function getValidator(options) {
  const validators = (options.validators || []).concat(DEFAULT_VALIDATORS);
  const resolvers = (options.resolvers || []).concat(DEFAULT_RESOLVERS);
  const i18n = options.i18n || identity;
  const onSuccess = options.onSuccess || identity;
  const onError = options.onError || defaultErrorFeedback;
  const clean = options.clean || defaultCleanFeedback;
  const validator = when(validators.map(([predicate, validate]) =>
    [
      predicate,
      compose(
        apply(curry2(validate)(i18n)),
        mapEach([when(resolvers), identity]),
        fill(2)
      ),
    ]
  ));

  return input => {
    clean(input);
    const res = validator(input);

    res != null ? onError(input, res) : onSuccess(input);
    return res != null;
  };
}

function defaultErrorFeedback(input, res) {
  const prevError = document.querySelector(`[name="${input.name}"] + .error`);
  if (prevError) { detachNode(prevError); }

  const error = getNode(`<div class='error'>${res}</div>`);
  input.parentNode.insertBefore(error, input.nextElementSibling);
}

function defaultCleanFeedback(input) {
  const next = input.nextElementSibling;
  if (next && next.classList.contains('error')) { detachNode(next); }
}

function withInputBuffer(buffer, callback) {
  let timeout;
  return buffer <= 0
    ? callback
    : () => {
      clearTimeout(timeout);
      timeout = setTimeout(callback, buffer);
    };
}

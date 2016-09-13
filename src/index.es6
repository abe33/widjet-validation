import widgets from 'widjet'
import {DisposableEvent, Disposable, CompositeDisposable} from 'widjet-disposables'
import {asArray, getNode, detachNode} from 'widjet-utils'

import DEFAULT_VALIDATORS from './validators'
import DEFAULT_RESOLVERS from './resolvers'
import {when, curry2, compose} from './utils'

// const log = (v) => { console.log(v); return v }

widgets.define('live-validation', (input, options = {}) => {
  const validator = getValidator(options)

  input.validate = () => validator(input)

  const subscription = new CompositeDisposable([
    new DisposableEvent(input, 'change blur', () => input.validate()),
    new Disposable(() => delete input.validate)
  ])

  if (options.validateOnInit) { input.validate() }

  return subscription
})

widgets.define('form-validation', (form, options = {}) => {
  const validator = getValidator(options)
  const reducer = (memo, item) =>
    (item.validate ? item.validate() : validator(item)) || memo

  form.validate = () =>
    asArray(form.querySelectorAll('[required]')).reduce(reducer, false)

  return new CompositeDisposable([
    new Disposable(() => {
      form.removeAttribute('novalidate')
      delete form.validate
    }),
    new DisposableEvent(form, 'submit', (e) => {
      const hasErrors = form.validate()
      if (hasErrors) {
        e.stopImmediatePropagation()
        e.preventDefault()
      }
      return !hasErrors
    })
  ])
})

function getValidator (options) {
  const validators = (options.validators || []).concat(DEFAULT_VALIDATORS)
  const resolvers = (options.resolvers || []).concat(DEFAULT_RESOLVERS)
  const i18n = options.i18n || (k => k)
  const onSuccess = options.onSuccess || (i => i)
  const onError = options.onError || ((input, res) => {
    const prevError = document.querySelector(`[name="${input.name}"] + .error`)
    if (prevError) { detachNode(prevError) }

    const error = getNode(`<div class='error'>${res}</div>`)
    input.parentNode.insertBefore(error, input.nextElementSibling)
  })
  const clean = options.clean || ((input) => {
    const next = input.nextElementSibling
    if (next && next.classList.contains('error')) { detachNode(next) }
  })
  const validator = when(validators.map(([predicate, validate]) => {
    return [predicate, compose(curry2(validate)(i18n), when(resolvers))]
  }))

  return input => {
    clean(input)
    const res = validator(input)

    res != null ? onError(input, res) : onSuccess(input)
    return res != null
  }
}

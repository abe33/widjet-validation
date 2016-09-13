import widgets from 'widjet'
import {DisposableEvent} from 'widjet-disposables'
import {getNode, detachNode} from 'widjet-utils'

import DEFAULT_VALIDATORS from './validators'
import DEFAULT_RESOLVERS from './resolvers'
import {when, curry2, compose} from './utils'

// const log = (v) => { console.log(v); return v }

widgets.define('live-validation', (input, options = {}) => {
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

  const fieldValue = when(resolvers)
  const validator = when(validators.map(([predicate, validate]) => {
    return [predicate, compose(curry2(validate)(i18n), fieldValue)]
  }))

  input.validate = () => {
    clean(input)
    const res = validator(input)

    res != null ? onError(input, res) : onSuccess(input)
    return res != null
  }

  const subscription = new DisposableEvent(input, 'change blur', () => {
    input.validate()
  })

  if (options.validateOnInit) { input.validate() }

  return subscription
})

// widgets.define('form-validation', (form) => {
//   form.setAttribute('novalidate', 'novalidate')
//
//   form.addEventListener('submit', (e) => {
//     const required = form.querySelectorAll('[required]')
//     const reducer = (memo, item) => memo || validate(item)
//     const hasErrors = asArray(required).reduce(reducer, false)
//
//     if (hasErrors) { e.stopImmediatePropagation() }
//     return !hasErrors
//   })
// })

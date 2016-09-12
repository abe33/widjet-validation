import widgets from 'widjet'
import {DisposableEvent} from 'widjet-disposables'
import {getNode, detachNode, nodeIndex} from 'widjet-utils'

import DEFAULT_VALIDATORS from './validators'
import DEFAULT_RESOLVERS from './resolvers'
import {when, compose} from './utils'

// const log = (v) => { console.log(v); return v }

widgets.define('live-validation', (input, options = {}) => {
  const validators = (options.validators || []).concat(DEFAULT_VALIDATORS)
  const resolvers = (options.resolvers || []).concat(DEFAULT_RESOLVERS)
  const fieldValue = when(resolvers)

  const validator = when(validators.map(([predicate, v]) => {
    return [predicate, compose(v, fieldValue)]
  }))

  const subscription = new DisposableEvent(input, 'change blur', () => {
    validate(validator, input)
  })

  if (options.validateOnInit) { validate(validator, input) }

  return subscription
})

function validate (validator, input) {
  const field = input.parentNode
  const index = nodeIndex(input)

  removeFieldFeedback(field)

  const res = validator(input)

  if (res != null) {
    addFieldErrorFeedback(field, index, res)
    return true
  } else {
    addFieldSuccessFeedback(field)
    return false
  }
}

function addFieldSuccessFeedback (field) {
  // field.classList.add('has-success')
  //
  // const label = field.querySelector('label')
  // label.insertBefore(getNode('<i class="icon-tick feedback-icon"></i>'), label.firstChild)
}

function addFieldErrorFeedback (field, index, res) {
  const error = getNode(`<div class='error'>${res}</div>`)
  field.insertBefore(error, field.children[index + 1])
}

function removeFieldFeedback (field) {
  const error = field.querySelector('.error')
  if (error) { detachNode(error) }
}

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

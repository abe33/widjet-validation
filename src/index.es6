import widgets from 'widjet'
import {DisposableEvent} from 'widjet-disposables'
import {merge, getNode, detachNode, nodeIndex} from 'widjet-utils'

import DEFAULT_VALIDATORS, {validatePresence} from './validators'
import DEFAULT_RESOLVERS, {fieldValue} from './resolvers'

widgets.define('live-validation', (input, options = {}) => {
  const validators = merge(DEFAULT_VALIDATORS, options.validators || {})
  const resolvers = (options.resolvers || []).concat(DEFAULT_RESOLVERS)
  const context = {validators, resolvers}

  const subscription = new DisposableEvent(input, 'change blur', () => {
    validate(input, context)
  })

  if (options.validateOnInit) { validate(input, context) }

  return subscription
})

function validate (input, {validators, resolvers}) {
  const field = input.parentNode
  const type = input.type || input.nodeName.toLocaleLowerCase()
  const index = nodeIndex(input)
  const value = fieldValue(input, resolvers)
  let res

  removeFieldFeedback(field)

  if (type != null) {
    const validator = validators[type] != null
      ? validators[type]
      : validatePresence

    res = validator(value)
  } else {
    res = validatePresence(value)
  }

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

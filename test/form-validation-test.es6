import expect from 'expect.js'
import jsdom from 'mocha-jsdom'
import widgets from 'widjet'
import {clearNodeCache} from 'widjet-utils'

import '../src/index'

describe('form-validation', () => {
  let form

  jsdom()

  describe('with a form with required fields', () => {
    beforeEach(() => {
      clearNodeCache()

      widgets.release('live-validation')
      widgets.release('form-validation')

      document.body.innerHTML = `
        <form>
          <input type='text' name='name' required>

          <input type='number' name='num' required>

          <input type='checkbox' name='tos' required>

          <input type='radio' name='radio' value='1' required>
          <input type='radio' name='radio' value='2' required>
          <input type='radio' name='radio' value='3' required>

          <textarea name='message' required></textarea>

          <select name='single' required>
            <option></option>
            <option value='value'>Value</option>
          </select>

          <select name='multi' required multiple>
            <option></option>
            <option value='value1'>Value 1</option>
            <option value='value2'>Value 2</option>
            <option value='value3'>Value 3</option>
            <option value='value4'>Value 4</option>
          </select>
        </form>
      `

      form = document.querySelector('form')
    })

    describe('with no config and no live validation', () => {
      beforeEach(() => {
        widgets('form-validation', 'form', {on: 'init'})
      })

      it('sets the novalidate attribute on the form', () => {
        expect(form.hasAttribute('novalidate'))
      })

      describe('on form submission', () => {
        beforeEach(() => {
          widgets.dispatch(form, 'submit')
        })

        it('validates the required fields', () => {
          expect(document.querySelectorAll('.error')).to.have.length(7)
        })
      })
    })
  })
})

import expect from 'expect.js'
import jsdom from 'mocha-jsdom'
import widgets from 'widjet'
import {nodeIndex} from 'widjet-utils'

import '../src/index'

describe('live-validation', () => {
  let [input, error] = []

  jsdom()

  describe('with a form with required fields', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <form>
          <input type='text' name='name' required>

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
    })

    const inputs = [
      ['input[type="text"]', input => input.value = 'foo'],
      ['input[type="checkbox"]', input => input.checked = true],
      ['input[type="radio"]', input => input.checked = true],
      ['select:not([multiple])', input => input.selectedIndex = 1],
      ['select[multiple]', input => input.selectedIndex = 1],
      ['textarea', input => input.value = 'foo']
    ]

    describe('with no config at all', () => {
      beforeEach(() => {
        widgets('live-validation', '[required]', {on: 'init'})
      })
      inputs.forEach(([selector, changeValue]) => {
        describe(`on ${selector}`, () => {
          beforeEach(() => {
            input = document.querySelector(selector)
          })

          it('adds an error message after the node when not validated', () => {
            widgets.dispatch(input, 'change')

            error = document.querySelector('.error')

            expect(error).not.to.be(null)
            expect(nodeIndex(error)).to.eql(nodeIndex(input) + 1)
          })

          it('removes the error once it validates', () => {
            widgets.dispatch(input, 'change')

            changeValue(input)
            widgets.dispatch(input, 'change')

            error = document.querySelector('.error')

            expect(error).to.be(null)
          })
        })
      })
    })

    describe('with the validateOnInit param enabled', () => {
      beforeEach(() => {
        widgets('live-validation', '[required]', {
          on: 'init',
          validateOnInit: true
        })
      })
      it('validates all the fields at init', () => {
        expect(document.querySelector('.error')).not.to.be(null)
      })
    })
  })
})

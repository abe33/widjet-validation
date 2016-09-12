import expect from 'expect.js'
import jsdom from 'mocha-jsdom'
import widgets from 'widjet'
import {nodeIndex} from 'widjet-utils'

import '../src/index'

describe('live-validation', () => {
  let [input, error, select, textarea] = []

  jsdom()

  describe('with a form with required fields', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <form>
          <input type='text' name='name' required>
          <textarea name='message' required></textarea>
          <select name='choice' required>
            <option></option>
            <option value='value'>Value</option>
          </select>
        </form>
      `

      input = document.querySelector('input')
      select = document.querySelector('select')
      textarea = document.querySelector('textarea')
    })

    describe('with no config at all', () => {
      beforeEach(() => {
        widgets('live-validation', '[required]', {on: 'init'})
      })

      it('adds an error message after an input when not validated', () => {
        widgets.dispatch(input, 'change')

        error = document.querySelector('.error')

        expect(error).not.to.be(null)
        expect(nodeIndex(error)).to.eql(nodeIndex(input) + 1)
      })

      it('adds an error message after a textare when not validated', () => {
        widgets.dispatch(textarea, 'change')

        error = document.querySelector('.error')

        expect(error).not.to.be(null)
        expect(nodeIndex(error)).to.eql(nodeIndex(textarea) + 1)
      })

      it('adds an error message after a select when not validated', () => {
        widgets.dispatch(select, 'change')

        error = document.querySelector('.error')

        expect(error).not.to.be(null)
        expect(nodeIndex(error)).to.eql(nodeIndex(select) + 1)
      })
    })
  })
})

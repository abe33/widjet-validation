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
          <textarea name='message' required></textarea>
          <select name='choice' required>
            <option></option>
            <option value='value'>Value</option>
          </select>
        </form>
      `
    })

    describe('with no config at all', () => {
      beforeEach(() => {
        widgets('live-validation', '[required]', {on: 'init'})
      })

      describe('on a text input', () => {
        beforeEach(() => {
          input = document.querySelector('input[type="text"]')
        })

        it('adds an error message after the node when not validated', () => {
          widgets.dispatch(input, 'change')

          error = document.querySelector('.error')

          expect(error).not.to.be(null)
          expect(nodeIndex(error)).to.eql(nodeIndex(input) + 1)
        })

        it('removes the error once it validates', () => {
          widgets.dispatch(input, 'change')

          input.value = 'foo'
          widgets.dispatch(input, 'change')

          error = document.querySelector('.error')

          expect(error).to.be(null)
        })
      })

      describe('on a checkbox', () => {
        beforeEach(() => {
          input = document.querySelector('input[type="checkbox"]')
        })

        it('adds an error message after the node when not validated', () => {
          widgets.dispatch(input, 'change')

          error = document.querySelector('.error')

          expect(error).not.to.be(null)
          expect(nodeIndex(error)).to.eql(nodeIndex(input) + 1)
        })

        it('removes the error once it validates', () => {
          widgets.dispatch(input, 'change')

          input.checked = true
          widgets.dispatch(input, 'change')

          error = document.querySelector('.error')

          expect(error).to.be(null)
        })
      })

      describe('on a textarea', () => {
        beforeEach(() => {
          input = document.querySelector('textarea')
        })

        it('adds an error message after the node when not validated', () => {
          widgets.dispatch(input, 'change')

          error = document.querySelector('.error')

          expect(error).not.to.be(null)
          expect(nodeIndex(error)).to.eql(nodeIndex(input) + 1)
        })

        it('removes the error once it validates', () => {
          widgets.dispatch(input, 'change')

          input.value = 'foo'
          widgets.dispatch(input, 'change')

          error = document.querySelector('.error')

          expect(error).to.be(null)
        })
      })

      describe('on a select', () => {
        beforeEach(() => {
          input = document.querySelector('select')
        })

        it('adds an error message after the node when not validated', () => {
          widgets.dispatch(input, 'change')

          error = document.querySelector('.error')

          expect(error).not.to.be(null)
          expect(nodeIndex(error)).to.eql(nodeIndex(input) + 1)
        })

        it('removes the error once it validates', () => {
          widgets.dispatch(input, 'change')

          input.selectedIndex = 1
          widgets.dispatch(input, 'change')

          error = document.querySelector('.error')

          expect(error).to.be(null)
        })
      })
    })
  })
})

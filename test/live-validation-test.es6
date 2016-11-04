import expect from 'expect.js'
import jsdom from 'mocha-jsdom'
import widgets from 'widjet'
import sinon from 'sinon'
import {setPageContent, getTestRoot} from 'widjet-test-utils/dom'
import {identity, clearNodeCache} from 'widjet-utils'
import {getFile, pickFile} from './helpers'

import '../src/index'

describe('live-validation', () => {
  let input

  jsdom()

  describe('with a form with required fields', () => {
    beforeEach(() => {
      clearNodeCache()

      widgets.release('live-validation')
      widgets.release('form-validation')

      setPageContent(`
        <form>
          <input type='text' name='name' required>

          <input type='number' name='num' required>

          <input type='file' name='file' required>

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
      `)
    })

    const inputs = [
      ['input[type="text"]', input => input.value = 'foo'],
      ['input[type="number"]', input => input.value = '0'],
      ['input[type="file"]', input => pickFile(input, getFile('foo.jpg', 'image/jpeg'))],
      ['input[type="checkbox"]', input => input.checked = true],
      ['input[type="radio"]', input => input.checked = true],
      ['select[name="single"]', input => input.selectedIndex = 1],
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
            input = getTestRoot().querySelector(selector)
          })

          it('adds an error message after the node when not validated', () => {
            widgets.dispatch(input, 'change')

            const next = input.nextElementSibling

            expect(next).not.to.be(null)
            expect(next != null && next.classList.contains('error')).to.be(true)
          })

          it('removes the error once it validates', () => {
            widgets.dispatch(input, 'change')

            changeValue(input)
            widgets.dispatch(input, 'change')

            const next = input.nextElementSibling

            expect(next != null && next.classList.contains('error')).to.be(false)
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
        expect(getTestRoot().querySelectorAll('.error')).to.have.length(inputs.length)
      })
    })

    describe('with the events param defined', () => {
      beforeEach(() => {
        widgets('live-validation', '[required]', {
          on: 'init',
          events: 'foo'
        })
      })
      inputs.forEach(([selector, changeValue]) => {
        describe(`on ${selector}`, () => {
          beforeEach(() => {
            input = getTestRoot().querySelector(selector)
          })

          it('validates the input on the specified event', () => {
            widgets.dispatch(input, 'foo')

            const next = input.nextElementSibling

            expect(next).not.to.be(null)
            expect(next != null && next.classList.contains('error')).to.be(true)
          })
        })
      })
    })

    describe('with a locale function provided', () => {
      beforeEach(() => {
        widgets('live-validation', '[required]', {
          on: 'init',
          validateOnInit: true,
          i18n: k => k.toUpperCase()
        })
      })
      it('passes the error string to the locale method', () => {
        const error = getTestRoot().querySelector('.error')
        expect(error.textContent).to.eql('BLANK_VALUE')
      })
    })

    describe('with custom validators', () => {
      let spy
      beforeEach(() => {
        spy = sinon.spy(i => 'some error')
        widgets('live-validation', '[required]', {
          on: 'init',
          validateOnInit: true,
          validators: [
            [i => i.nodeName === 'INPUT', spy]
          ]
        })
      })

      it('runs the passed-in validators in priority', () => {
        const error = getTestRoot().querySelector('.error')
        expect(error.textContent).to.eql('some error')
      })

      it('calls the validator with the value and the input', () => {
        const input = getTestRoot().querySelector('input')
        expect(spy.calledWith(identity, '', input)).to.be.ok()
      })
    })

    describe('with custom resolvers', () => {
      beforeEach(() => {
        widgets('live-validation', '[required]', {
          on: 'init',
          validateOnInit: true,
          resolvers: [
            [i => true, i => 'some value']
          ]
        })
      })

      it('uses the passed-in resolvers to get the input values', () => {
        expect(getTestRoot().querySelector('.error')).to.be(null)
      })
    })

    describe('with custom feedback methods', () => {
      beforeEach(() => {
        widgets('live-validation', '[required]', {
          on: 'init',
          validateOnInit: true,
          clean: i => i.classList.remove('error'),
          onError: i => i.classList.add('error')
        })
      })

      it('uses the provided methods', () => {
        inputs.forEach(([selector, changeValue]) => {
          input = getTestRoot().querySelector(selector)

          expect(input.classList.contains('error')).to.be(true)

          changeValue(input)
          widgets.dispatch(input, 'change')

          expect(input.classList.contains('error')).to.be(false)
        })
      })
    })
  })
})

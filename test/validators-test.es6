import expect from 'expect.js'
import {validatePresence, validateChecked, validateEmail} from '../src/validators'
import {identity} from 'widjet-utils'

describe('validators', () => {
  describe('validatePresence()', () => {
    it('does not validate empty string', () => {
      expect(validatePresence(identity, '')).not.to.be(null)
    })

    it('does not validate empty array', () => {
      expect(validatePresence(identity, [])).not.to.be(null)
    })

    it('does not validate null or undefined value', () => {
      expect(validatePresence(identity, null)).not.to.be(null)
      expect(validatePresence(identity, undefined)).not.to.be(null)
    })

    it('validates any other value', () => {
      expect(validatePresence(identity, 0)).to.be(null)
      expect(validatePresence(identity, 'foo')).to.be(null)
      expect(validatePresence(identity, ['foo'])).to.be(null)
      expect(validatePresence(identity, true)).to.be(null)
      expect(validatePresence(identity, false)).to.be(null)
    })
  })

  describe('validateChecked()', () => {
    it('does not validate a falsy value', () => {
      expect(validateChecked(identity, 0)).not.to.be(null)
      expect(validateChecked(identity, false)).not.to.be(null)
    })

    it('validates a truthy value', () => {
      expect(validateChecked(identity, 1)).to.be(null)
      expect(validateChecked(identity, true)).to.be(null)
    })
  })

  describe('validateEmail()', () => {
    it('does not validate null or undefined value', () => {
      expect(validateEmail(identity, null)).not.to.be(null)
      expect(validateEmail(identity, undefined)).not.to.be(null)
    })

    it('does not validate invalid email', () => {
      expect(validateEmail(identity, 'foo')).not.to.be(null)
    })

    it('validates valid email', () => {
      expect(validateEmail(identity, 'foo@foo.com')).to.be(null)
    })
  })
})

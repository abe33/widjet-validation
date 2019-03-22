import expect from 'expect.js';
import jsdom from 'mocha-jsdom';
import {setPageContent, getTestRoot} from 'widjet-test-utils/dom';
import {identity} from 'widjet-utils';

import {validatePresence, validateChecked, validateEmail, validateAccept} from '../src/validators';
import {getFile} from './helpers';

describe('validators', () => {
  describe('validatePresence()', () => {
    it('does not validate empty string', () => {
      expect(validatePresence(identity, '')).not.to.be(null);
    });

    it('does not validate empty array', () => {
      expect(validatePresence(identity, [])).not.to.be(null);
    });

    it('does not validate null or undefined value', () => {
      expect(validatePresence(identity, null)).not.to.be(null);
      expect(validatePresence(identity, undefined)).not.to.be(null);
    });

    it('validates any other value', () => {
      expect(validatePresence(identity, 0)).to.be(null);
      expect(validatePresence(identity, 'foo')).to.be(null);
      expect(validatePresence(identity, ['foo'])).to.be(null);
      expect(validatePresence(identity, true)).to.be(null);
      expect(validatePresence(identity, false)).to.be(null);
    });
  });

  describe('validateChecked()', () => {
    it('does not validate a falsy value', () => {
      expect(validateChecked(identity, 0)).not.to.be(null);
      expect(validateChecked(identity, false)).not.to.be(null);
    });

    it('validates a truthy value', () => {
      expect(validateChecked(identity, 1)).to.be(null);
      expect(validateChecked(identity, true)).to.be(null);
    });
  });

  describe('validateEmail()', () => {
    it('does not validate null or undefined value', () => {
      expect(validateEmail(identity, null)).not.to.be(null);
      expect(validateEmail(identity, undefined)).not.to.be(null);
    });

    it('does not validate invalid email', () => {
      expect(validateEmail(identity, 'foo')).not.to.be(null);
    });

    it('validates valid email', () => {
      expect(validateEmail(identity, 'foo@foo.com')).to.be(null);
    });
  });

  describe('validateAccept()', () => {
    jsdom({url: 'http://localhost'});

    let input;

    describe('when the target has a accept attribute', () => {
      beforeEach(() => {
        setPageContent('<input type="file" accept="image/*,.pdf,application/x-javascript">');
        input = getTestRoot().querySelector('input');
      });

      it('validates files using a mime type glob', () => {
        expect(validateAccept(identity, [
          getFile('foo.jpg', 'image/jpeg'),
          getFile('foo.png', 'image/png'),
        ], input)).to.be(null);
      });

      it('validates files using a full mime type', () => {
        expect(validateAccept(identity, [
          getFile('foo.js', 'application/x-javascript'),
        ], input)).to.be(null);
      });

      it('validates files using the extension', () => {
        expect(validateAccept(identity, [
          getFile('foo.pdf', 'application/pdf'),
        ], input)).to.be(null);
      });

      it('does not validate a file that do not match the patterns', () => {
        expect(validateAccept(identity, [
          getFile('foo.txt', 'text/plain'),
        ], input)).not.to.be(null);
      });
    });
  });
});

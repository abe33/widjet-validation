import expect from 'expect.js';
import jsdom from 'mocha-jsdom';
import widgets from 'widjet';
import sinon from 'sinon';
import {setPageContent, getTestRoot} from 'widjet-test-utils/dom';
import {clearNodeCache} from 'widjet-utils';

import '../src/index';

describe('form-validation', () => {
  let form, input, didValidateSpy, didNotValidateSpy;

  jsdom({url: 'http://localhost'});

  describe('with a form with required fields', () => {
    beforeEach(() => {
      clearNodeCache();

      widgets.release('live-validation');
      widgets.release('form-validation');

      setPageContent(`
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
      `);

      didValidateSpy = sinon.spy();
      didNotValidateSpy = sinon.spy();

      form = getTestRoot().querySelector('form');
      input = getTestRoot().querySelector('input');

      form.addEventListener('did-validate', didValidateSpy);
      form.addEventListener('did-not-validate', didNotValidateSpy);
    });

    describe('with no config and no live validation', () => {
      beforeEach(() => {
        widgets('form-validation', 'form', {on: 'init'});
      });

      it('sets the novalidate attribute on the form', () => {
        expect(form.hasAttribute('novalidate'));
      });

      describe('on form submission', () => {
        beforeEach(() => {
          widgets.dispatch(form, 'submit');
        });

        it('validates the required fields', () => {
          expect(getTestRoot().querySelectorAll('.error')).to.have.length(7);
        });

        it('emits a did-not-validate event', () => {
          expect(didNotValidateSpy.called).to.be(true);
        });
      });

      describe('when there is no longer any error', () => {
        beforeEach(() => {
          getTestRoot().querySelector('input[type="text"]').value = 'foo';
          getTestRoot().querySelector('input[type="number"]').value = '1';
          getTestRoot().querySelector('input[type="checkbox"]').checked = true;
          getTestRoot().querySelector('input[type="radio"]').checked = true;
          getTestRoot().querySelector('textarea').value = 'bar';
          getTestRoot().querySelector('select').selectedIndex = 1;
          getTestRoot().querySelectorAll('select[multiple] option')[1].selected = true;

          form.addEventListener('submit', (e) => {
            e.preventDefault();
            return false;
          });

          widgets.dispatch(form, 'submit');
        });

        it('does not display errors', () => {
          expect(getTestRoot().querySelectorAll('.error')).to.have.length(0);
        });

        it('emits a did-validate event', () => {
          expect(didValidateSpy.called).to.be(true);
        });
      });
    });

    describe('with no config but live validation', () => {
      beforeEach(() => {
        widgets('live-validation', '[required]', {on: 'init'});
        widgets('form-validation', 'form', {on: 'init'});

        sinon.stub(input, 'validate');

        widgets.dispatch(form, 'submit');
      });

      it('validates the required fields', () => {
        expect(input.validate.called).to.be(true);
      });
    });

    describe('with required selector setting', () => {
      beforeEach(() => {
        widgets('form-validation', 'form', {
          on: 'init',
          fieldSelector: 'input',
        });

        widgets.dispatch(form, 'submit');
      });

      it('validates the required fields', () => {
        expect(getTestRoot().querySelectorAll('.error')).to.have.length(4);
      });
    });

    describe('with the events setting defined', () => {
      beforeEach(() => {
        widgets('form-validation', 'form', {
          on: 'init',
          events: 'foo',
        });

        widgets.dispatch(form, 'foo');
      });

      it('validates the required fields', () => {
        expect(getTestRoot().querySelectorAll('.error')).to.have.length(7);
      });
    });

    describe('with validateOnInit setting', () => {
      beforeEach(() => {
        widgets('form-validation', 'form', {
          on: 'init',
          validateOnInit: true,
        });
      });

      it('validates the required fields', () => {
        expect(getTestRoot().querySelectorAll('.error')).to.have.length(7);
      });
    });

    describe('with custom validators', () => {
      beforeEach(() => {
        widgets('form-validation', 'form', {
          on: 'init',
          validateOnInit: true,
          validators: [
            [i => i.nodeName === 'INPUT', i => 'some error'],
          ],
        });
      });

      it('runs the passed-in validators in priority', () => {
        const error = getTestRoot().querySelector('.error');
        expect(error.textContent).to.eql('some error');
      });
    });

    describe('with custom resolvers', () => {
      beforeEach(() => {
        widgets('form-validation', 'form', {
          on: 'init',
          validateOnInit: true,
          resolvers: [
            [i => true, i => 'some value'],
          ],
          validators: [
            [i => true, (i18n, v) => v === 'some value' ? null : 'error'],
          ],
        });
      });

      it('uses the passed-in resolvers to get the input values', () => {
        expect(getTestRoot().querySelector('.error')).to.be(null);
      });
    });

    describe('with custom feedback methods', () => {
      beforeEach(() => {
        widgets('form-validation', 'form', {
          on: 'init',
          validateOnInit: true,
          clean: i => i.classList.remove('error'),
          onError: i => i.classList.add('error'),
        });
      });

      it('uses the provided methods', () => {
        expect(getTestRoot().querySelectorAll('.error[required]')).to.have.length(9);
      });
    });
  });
});

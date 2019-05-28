'use strict';

import expect from 'expect.js';
import jsdom from 'mocha-jsdom';
import {inputPredicate, selectPredicate, attributePredicate} from '../src/utils';

describe('inputPredicate(type)', () => {
  function createInput(type) {
    const input = document.createElement('input');
    input.type = type;

    return input;
  }

  jsdom({url: 'http://localhost'});

  it('returns true if the passed-in element is an input that matches the type', () => {
    expect(inputPredicate('text')(createInput('text'))).to.be.ok();
    expect(inputPredicate('url')(createInput('text'))).not.to.be.ok();
    expect(inputPredicate('url')(document.createElement('div'))).not.to.be.ok();
  });
});

describe('selectPredicate(multiple)', () => {
  function createSelect(multiple) {
    const select = document.createElement('select');
    select.multiple = multiple;

    return select;
  }

  jsdom({url: 'http://localhost'});

  it('returns true if the passed-in element is an input that matches the type', () => {
    expect(selectPredicate(false)(createSelect(false))).to.be.ok();
    expect(selectPredicate(true)(createSelect(true))).to.be.ok();
    expect(selectPredicate(false)(createSelect(true))).not.to.be.ok();
    expect(selectPredicate(false)(document.createElement('div'))).not.to.be.ok();
    expect(selectPredicate(true)(document.createElement('div'))).not.to.be.ok();

  });
});

describe('attributePredicate(attr)', () => {
  function createNodeWithAttr(attr) {
    const div = document.createElement('div');
    div.setAttribute(attr, attr);

    return div;
  }

  jsdom({url: 'http://localhost'});

  it('returns true if the passed-in element is an input that matches the type', () => {
    expect(attributePredicate('id')(createNodeWithAttr('id'))).to.be.ok();
    expect(attributePredicate('id')(document.createElement('div'))).not.to.be.ok();
  });
});

# widjet-validation [![Build Status](https://travis-ci.org/abe33/widjet-validation.svg?branch=master)](https://travis-ci.org/abe33/widjet-validation)

A validation widget for [widjet](http://github.com/abe33/widjet).

## Install

```sh
npm install widjet-validation --save
```

## Usage

```js
import widgets from 'widjet'
import 'widjet-validation'

widgets('live-validation', '[required]', {on: 'load'})
widgets('form-validation', 'form', {on: 'load'})
```

This package provides two widgets, `live-validation` and `form-validation`. The former validates inputs as they change, while the latter ensures that a form cannot be submitted when some of its required field are still invalid.

Both widgets use the same validation mecanisms, meaning that both widgets can share the same config.

### live-validation

The `live-validation` widget adds a `validate` method on each target and registers itself by default for the `change` and `blur` events to run the validation.

### form-validation

The `form-validation` widget adds a `validate` method on each targets and registers itself by default for the `submit` event to run the validation.

The main difference with `live-validation`, beside the registered events, is that the form validation consists in running the validator on each field matching the `required` selector and to prevent the form submission if any of these fields didn't validate.

## Core Principles

### Value Resolvers

A resolver is a function that takes an HTML element as argument and that returns its value in a JavaScript-friendly type. A resolver is always defined along with a predicate function that also takes an HTML element as argument and returns whether the resolver applies to this element or not.

For instance, the resolver for inputs of type `checkbox` are defined like this:

```js
const checkboxResolver = [
  i => i.nodeName === 'INPUT' && i.type === 'checkbox',
  i => i.checked
]
```

The fallback resolver is defined like this:

```js
const defaultResolver = [i => true, i => i.value]
```

Resolvers are stored in an array and evaluated in order. When a predicate function returns `true` the resolver function is called the value returned
by the resolver will be used.

```js
const resolvers = [
  [i => i.nodeName === 'INPUT' && i.type === 'checkbox', i => i.checked],
  // other resolvers...
  [i => true, i => i.value]
]
```

### Value Validators

A validator, like a resolver, combines a predicate function with a validation function. The validation function takes a translation function and a value and should return either `undefined` if the value is valid or a string with the error message if the value isn't valid.

For instance the presence validation function is defined as follow:

```js
export function validatePresence (i18n, value) {
  return value != null && value.length !== 0 ? null : i18n('blank_value')
}
```

In that context the `i18n` function is for you to provide, by default the passed-in function will be `s => s`.

Along with a predicate, the typical validator for a mandatory checkbox is:

```js
const validateCheckbox = [
  i => i.nodeName === 'INPUT' && i.type === 'checkbox',
  (i18n, value) => value ? null : i18n('unchecked')
]
```

The default validator being defined with:

```js
const defaultValidator = [i => true, validatePresence]
```

Put together, as for resolvers, validators are stored in an array:

```js
const validators = [
  [
    i => i.nodeName === 'INPUT' && i.type === 'checkbox',
    (i18n, value) => value ? null : i18n('unchecked')
  ],
  // other validators...
  [i => true, validatePresence]
]
```

## Configuration

#### Options common to both widgets

|Option|Description|
|---|---|
|`i18n`|TODO|
|`onError`|TODO|
|`onSucces`|TODO|
|`resolvers`|TODO|
|`validateOnInit`|TODO|
|`validators`|TODO|

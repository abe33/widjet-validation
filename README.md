# widjet-validation [![Build Status](https://travis-ci.org/abe33/widjet-validation.svg?branch=master)](https://travis-ci.org/abe33/widjet-validation) [![codecov](https://codecov.io/gh/abe33/widjet-validation/branch/master/graph/badge.svg)](https://codecov.io/gh/abe33/widjet-validation)

A validation widget for [widjet](http://github.com/abe33/widjet).

## Install

```sh
npm install widjet-validation --save
```

## Usage

```js
import widgets from 'widjet';
import 'widjet-validation';

widgets('live-validation', '[required]', {on: 'load'});
widgets('form-validation', 'form', {on: 'load'});
```

This package provides two widgets, `live-validation` and `form-validation`.

The former validates inputs as they change, while the latter ensures that a form cannot be submitted when some of its required field are still invalid.

Both widgets use the same validation mecanisms, meaning that both widgets can share the same config.

### live-validation

The `live-validation` widget adds a `validate` method on each target and registers itself by default for the `change` and `blur` events to run the validation.

### form-validation

The `form-validation` widget adds a `validate` method on each targets and registers itself by default for the `submit` event to run the validation.

The main difference with `live-validation`, beside the registered events, is that the form validation consists in running the validator on each field matching the `fieldSelector` selector and to prevent the form submission if any of these fields didn't validate.

## Core Principles

### Validation Flow

The validation flows as follow:

1. When a validation for an input is performed the first step is to clean the already existing feedbacks, if any, the `clean` function is thus called with that input as argument.
2. The input is then passed to a resolver in order to retrieve its value. Resolvers mecanism is described below.
3. Once retrieved, the value is passed to a validator. The validator either returns `null` if the value is valid or a `String` with the validation error message. Custom validators are executed first and the process finishes using the native validation provided by the `checkValidity()` method.
4. Depending on the validator result the success or error feedback function will be called for that input.

### Value Resolvers

A resolver is a function that takes an HTML element as argument and returns its value in a JavaScript-friendly type. A resolver is always defined along with a predicate function that also takes an HTML element as argument and returns whether the resolver applies to this element or not.

For instance, the resolver for inputs of type `checkbox` is defined like this:

```js
const checkboxResolver = [
  i => i.nodeName === 'INPUT' && i.type === 'checkbox',
  i => i.checked,
];
```

The fallback resolver is defined like this:

```js
const defaultResolver = [i => true, i => i.value];
```

Resolvers are stored in an array and evaluated in order. When a predicate function returns `true` the resolver function is called and the value it returns
will be used in the validation.

```js
const resolvers = [
  [
    i => i.nodeName === 'INPUT' && i.type === 'checkbox',
    i => i.checked,
  ],
  // other resolvers...
  [i => true, i => i.value], // catch all resolver
];
```

### Value Validators

A validator, like a resolver, combines a predicate function with a validation function. The validation function takes a translation function and a value and should return either `null` if the value is valid or a string with the error message if the value isn't valid.

For instance the presence validation function is defined as follow:

```js
export function validatePresence(i18n, value) {
  return value != null && value.length !== 0 ? null : i18n('value_missing');
}
```

In that context the `i18n` function is for you to provide, by default the passed-in function will be `s => s`.

Along with a predicate, the typical validator for a mandatory checkbox is:

```js
const validateCheckbox = [
  i => i.nodeName === 'INPUT' && i.type === 'checkbox',
  (i18n, value) => value ? null : i18n('unchecked'),
];
```

The default validator being defined with:

```js
const defaultValidator = [i => true, nativeValidation];
```

Put together, as for resolvers, validators are stored in an array and the first whose predicate matches will be used to validate the current input:

```js
const validators = [
  [
    i => i.nodeName === 'INPUT' && i.type === 'checkbox',
    (i18n, value) => value ? null : i18n('unchecked'),
  ],
  // other validators...
  [i => true, nativeValidation], // catch all validator
];
```

### Native Validation Support

The default validators includes a general validator that relies on `checkValidity` and `ValidityState` from the browser APIs.

### Feedback Functions

The validation feedback are handled by a group of three functions, one for cleaning the feedback for an input, and two to display success and error in the validation.

By default, only an error feedback is provided, in the form of a `div` with the class `error` appended after the target input in the DOM. On that principle, the default `clean` implementation will look for a `div.error` after the target input and remove it.

### Events

Depending on whether the form validation succeeded or not a `did-validate` and `did-not-validate` event will be dispatched from the form.

## Configuration

#### Options common to both widgets

Option|Type|Description|
|---|---|---|
`clean`|`function(input)`|Given an input to validate, this function will be called to remove any previous validation feedback|
|`events`|`String`|A space-separated string containing the events that will trigger the validation, i.e `change blur`|
|`i18n`|`function(string):string`|A function to translate the error messages from the validators|
|`onError`|`function(input, msg)`|Given an input whose validation failed, this function will be called with the input and the error message to provide the visual feedback|
|`onSucces`|`function(input)`|Given an input whose validation succeeded, this function will be called with the input to provide the visual feedback|
|`resolvers`|`Array`|An array of extra resolvers to apply before the provided ones|
|`validateOnInit`|`Boolean`|If true, a validation of all the target fields will be performed during the initialization of the widget|
|`validators`|`Array`|An array of extra validators to apply before the provided ones|

#### form-validation Options

|Option|Type|Description|
|---|---|---|
|`fieldSelector`|`String`|A CSS selector to match the field that will be targeted by the form validation, it defaults to `input, select, textarea`|

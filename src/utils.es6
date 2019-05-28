export function inputPredicate(...types) {
  return input => input.nodeName === 'INPUT' && types.indexOf(input.type) > -1;
}

export function selectPredicate(multiple) {
  return input => input.nodeName === 'SELECT' && input.multiple === multiple;
}

export function attributePredicate(attr) {
  return (input) => input.hasAttribute(attr);
}

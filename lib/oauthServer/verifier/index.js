const regex = {
  unicode: /^[\u002D|\u002E|\u005F|\w]+$/,
  unicodeWithExclamation: /^[\u0021|\u0023-\u005B|\u005D-\u007E]+$/,
  unicodeWithExclamationSpace: /^[\u0020-\u0021|\u0023-\u005B|\u005D-\u007E]+$/,
  unicodeWithoutNewline: /^[\u0009|\u0020-\u007E|\u0080-\uD7FF|\uE000-\uFFFD|\u10000-\u10FFFF]+$/,
  printableUnicode: /^[\u0020-\u007E]+$/,
  uri: /^[a-zA-Z][a-zA-Z0-9+.-]+:/,
}

const test = key => str => regex[key].test(str)

module.exports = {
  isUnicode: test('unicode'),
  isUnicodeWithExclamation: test('unicodeWithExclamation'),
  isUnicodeWithExclamationSpace: test('unicodeWithExclamationSpace'),
  isUnicodeWithoutNewline: test('unicodeWithoutNewline'),
  isPrintableUnicode: test('printableUnicode'),
  isUri: test('uri'),
}

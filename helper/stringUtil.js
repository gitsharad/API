var _ = require('lodash')

RegExp.quote = require('regexp-quote')
var ignoreCase = function ignoreCase (msg, strictCheck) {
  if (strictCheck === false) {
    return new RegExp('^.*' + sanitizeInputForRegex(msg, false) + '.*', 'i')
  } else {
    return new RegExp('^' + sanitizeInputForRegex(msg, false) + '$', 'i')
  }
}

var sanitizeInput = function sanitizeInput (input, upperCase) {
  if (_.isObject(input)) {
    var upperObj = _.transform(input, function (result, val, key) {
      result[key] = upperCase ? val.trim().toUpperCase() : val.trim().toUpperCase()
    })
    return upperObj
  } else {
    if (!(typeof input === 'number' || typeof input === 'boolean')) {
      return upperCase ? input.trim().toUpperCase() : input.trim().toUpperCase()
    } else {
      return input
    }
  }
}

var sanitizeInputForRegex = function sanitizeInputForRegex (input, upperCase) {
  input = upperCase ? input.trim().toUpperCase() : input.trim().toUpperCase()
  return RegExp.quote(input)
}

module.exports = {
 sanitizeInput: sanitizeInput,
 sanitizeInputForRegex: sanitizeInputForRegex
 
}
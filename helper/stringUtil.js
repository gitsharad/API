var _ = require('lodash')

RegExp.quote = require('regexp-quote')
var ignoreCase = function ignoreCase (msg, strictCheck = true) {
  if (strictCheck === false) {
    return new RegExp('^.*' + sanitizeInputForRegex(msg, false) + '.*', 'i')
  } else {
    return new RegExp('^' + sanitizeInputForRegex(msg, false) + '$', 'i')
  }
}

var sanitizeInput = function sanitizeInput (input, upperCase = true) {
  if (_.isObject(input)) {
    var upperObj = _.transform(input, function (result, val, key) {
      result[key] = upperCase ? val.trim().toUpperCase() : val.trim()
    })
    return upperObj
  } else {
    if (!(typeof input === 'number' || typeof input === 'boolean')) {
      return upperCase ? input.trim().toUpperCase() : input.trim()
    } else {
      return input
    }
  }
}

var sanitizeInputForRegex = function sanitizeInputForRegex (input, upperCase = true) {
  input = upperCase ? input.trim().toUpperCase() : input.trim()
  return RegExp.quote(input)
}

var sortOption = function sortOption (sortByField, sortOrder) {
  var sortOptions = {}
  if (sortByField) {
    sortOptions = { [sortByField]: 1 }
    if (sortOrder === 'desc') {
      sortOptions = { [sortByField]: -1 }
    }
  }
  return sortOptions
}

/**
 * Get duplicate value from array of object.
 * @param  array Array = 
 * [{"name": "subFamily","value": "Property Attributes Parcels"},{"name": "subFamily","value": "Community"}];
 * @param  string key = "name"
 * @return if duplicate exists then return duplicate key otherwise
 * return null
 */
var getDuplicateObjectValue = function getDuplicateObjectValue (array, key) {
  if (Array.isArray(array)) {
    var valueArr = array.map(function (item) { return item[key] })
    var duplicate = null
    valueArr.some(function (item, idx) {
      if (valueArr.indexOf(item) !== idx) {
        duplicate = item
      }
    })
    return duplicate
  }
}

var createRegexAutoComplete = function createRegexAutoComplete (input, fieldName) {
  input = sanitizeInput(input)
  input = removeSpecialCharacterFromString(input)
  var jsons = []
  input = input.trim()
  if (input) {
    var splitStr = _.split(input, ' ')
    _.forEach(splitStr, function (value) {
      var item = {}
      item[fieldName] = new RegExp('\\b' + value + '[a-z\\d]*\\b', 'i')
      jsons.push(item)
    })
  }
  return jsons
}

var removeSpecialCharacterFromString = function removeSpecialCharacterFromString (input) {
  input = input.replace(/\)|\(|\*|\+|\/|&|\.|-|:|_|'|,/g, ' ') // (.,_'()&-/:+*)
  input = input.replace(/#|\[|\]|\{|\}|\\|@|\$/g, '')
  return input
}

function traverseOnJsonInput (o, func) {
  for (var i in o) {
    if (o[i] !== null && typeof (o[i]) === 'object') {
      // going one step down in the object tree!!
      traverseOnJsonInput(o[i])
    } else {
      if (o[i] === null) {
        o[i] = o[i]
      } else {
        o[i] = sanitizeInput(o[i], false)
      }
    }
  }
}
function isEmptyObject (obj) {
  return !Object.keys(obj).length
}

function stringifyFilterRegex (key, value) {
  if (value instanceof RegExp) {
    return value.toString()
  }
  return value
}

var makeCaseInsensitive = function makeCaseInsensitive (item, isAuto) {
  item = RegExp.quote(item)
  if (isAuto) {
    return new RegExp(item, 'i')
  } else {
    return new RegExp('^' + item + '$', 'i')
  }
}

// This function will remove $regex example below
// var json= { name: { '$regex': /^Amer$/i }, 'countries.name': { '$regex': /^UNited states$/i } }
// This function will convert above object to { name: 'Amer', 'countries.name': 'UNited states' }
function removeRegex (json) {
  Object.entries(json).forEach(([k, v]) => {
    if (v.$regex !== undefined) {
      json[k] = v.$regex.source.slice(1, -1)
    }
  })
  return json
}

function iterateJsonEmptyObj (obj) {
  var emptyProperties = []
  for (var property in obj) {
    if (obj.hasOwnProperty(property)) {
      if (typeof obj[property] === 'object' && Array.isArray(obj[property]) === false) {
        if (Object.keys(obj[property]).length === 0) {
          emptyProperties.push(property)
        } else {
          let x = iterateJsonEmptyObj(obj[property])
          emptyProperties.push(...x)
        }
      } else {
        continue
      }
    }
  }
  return emptyProperties
}
module.exports = {
  ignoreCase: ignoreCase,
  sanitizeInput: sanitizeInput,
  sortOption: sortOption,
  sanitizeInputForRegex: sanitizeInputForRegex,
  createRegexAutoComplete: createRegexAutoComplete,
  traverseOnJsonInput: traverseOnJsonInput,
  isEmptyObject: isEmptyObject,
  stringifyFilterRegex: stringifyFilterRegex,
  makeCaseInsensitive: makeCaseInsensitive,
  removeRegex: removeRegex,
  getDuplicateObjectValue: getDuplicateObjectValue,
  iterateJsonEmptyObj: iterateJsonEmptyObj
}

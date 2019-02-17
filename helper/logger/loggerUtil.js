var moment = require('moment')
/**
 * This function is used to create formatted error message which will be set in error response
 * @param  {} callingModule : calling module passed using module variable
 * @param  {} message : error message
 */
var createLoggerMessage = function (callingModule, message) {
  // extract filename
  var parts = callingModule.filename.split('/')
  var filename = parts[parts.length - 2] + '/' + parts.pop()

  // create message
  return 'FileName: ' + filename + ', LogMessage: ' + message
}

/**
 * This function is used to create formatted error message which will be set in error response
 * @param  {} callingModule : calling module passed using module variable
 * @param  {} message : error message
 */
var createLoggerReqResMessage = function (callingModule, message, res) {
  // extract filename
  var parts = callingModule.filename.split('/')
  var filename = parts[parts.length - 2] + '/' + parts.pop()
  var req = res.req
  // create message
  var requestFromClient = JSON.stringify(req.body)
  var responseTimestamp = moment().format()
  var requestURL = req.url
  var responseStatus = res.statusCode
  var authorization = req.header('authorization')
  var httpMethod = req.method

  return 'requestURL: ' + requestURL +
         ', requestFromClient: ' + requestFromClient +
         ', HTTP Method: ' + httpMethod +
         ', authorization: ' + authorization +
         ', responseStatus: ' + responseStatus +
         ', responseTimestamp: ' + responseTimestamp +
         ', FileName: ' + filename +
         ', LogMessage: ' + message
}

module.exports = {
  createLoggerMessage: createLoggerMessage,
  createLoggerReqResMessage: createLoggerReqResMessage
}

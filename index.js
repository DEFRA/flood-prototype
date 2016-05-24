const Glupe = require('glupe')
const config = require('./config')
const appName = require('./package.json').name

Glupe.compose(__dirname, config, function (err, server) {
  if (err) {
    throw err
  }

  const meta = {
    title: 'Site title here',
    description: 'Meta description here...',
    keywords: 'Meta keywords here...',
    author: 'Meta author here...'
  }

  const onPostHandler = function (request, reply) {
    const response = request.response
    if (response.variety === 'view') {
      if (!response.source.context) {
        response.source.context = {}
      }

      /*
       * Apply page meta data
       * to the view context data
       */
      var context = response.source.context
      context.meta = context.meta || {}

      for (var key in meta) {
        if (!context.meta[key]) {
          context.meta[key] = meta[key]
        }
      }
    }
    return reply.continue()
  }

  const preResponse = function (request, reply) {
    var response = request.response

    if (response.isBoom) {
      // An error was raised during
      // processing the request
      var statusCode = response.output.statusCode

      // In the event of 404
      // return the `404` view
      if (statusCode === 404) {
        return reply.view('404').code(statusCode)
      }

      request.log('error', {
        statusCode: statusCode,
        data: response.data,
        message: response.message
      })

      // The return the `500` view
      return reply.view('500').code(statusCode)
    }
    return reply.continue()
  }

  server.ext('onPostHandler', onPostHandler)
  server.ext('onPreResponse', preResponse)

  /*
   * Start the server
   */
  server.start(function (err) {
    var details = {
      name: appName,
      info: server.info
    }

    if (err) {
      details.error = err
      details.message = 'Failed to start ' + details.name
      server.log('error', details)
      throw err
    } else {
      details.config = config
      details.message = 'Started ' + details.name
      server.log('info', details)
      console.info('Server running at:', server.info)
    }
  })
})

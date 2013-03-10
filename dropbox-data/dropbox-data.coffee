dropbox = require 'dropbox'
path = require 'path'
_ = require 'underscore'

errors = {
  '${dropbox.ApiError.INVALID_TOKEN}': 'Invalid token'
  '${dropbox.ApiError.NOT_FOUND}': 'Not found'
  '${dropbox.ApiError.OVER_QUOTA}': 'Over quota'
  '${dropbox.ApiError.RATE_LIMITED}': 'Rate limited'
  '${dropbox.ApiError.NETWORK_ERROR}': 'Network error'
  '${dropbox.ApiError.INVALID_PARAM}': 'Invalid parameter'
  '${dropbox.ApiError.OAUTH_ERROR}': 'OAuth Error'
  '${dropbox.ApiError.INVALID_METHOD}': 'Invalid method'
}

sectionpaths = []

module.exports =
  configure: (app) ->
    app.postal.channel().subscribe 'section.new', (section) ->
      sectionpaths.push section.path

    app.postal.channel().subscribe 'section.changepath', (message) ->
      sectionpaths.remove message.oldpath
      sectionpaths.push message.newpath

    app.fetch.bind 'sectionpaths', 'all', (app, params, cb) ->
      cb null, sectionpaths

    app.fetch.bind 'pagenames', 'all', (app, params, cb) ->
      req = app.inject.one 'req'
      client = app.inject.one('dropbox.client')()

      if !client?
        cb null, []
        return

      await app.fetch.exec 'sectionpaths', 'all', app, null, defer error, sections
      throw error if error?

      sections = for section in sections
        path: section
        name: path.basename section

      await
        for section in sections
          client.readdir section.path, defer error, section.items
      
          cb errors[error] if error?

      for section in sections
        section.items = _(section.items).filter (item) ->
          item.endsWith '.md'

      cb null, sections

  init: (app) ->
    app.postal.publish 
      topic: 'section.new'
      data:
        name: 'Patterns and Practices'
        path: 'Knowledge/Patterns and Practices'

    app.postal.publish 
      topic: 'section.new'
      data:
        name: 'Work'
        path: 'Knowledge/Work'
      
    app.postal.publish 
      topic: 'section.new'
      data:
        name: 'Brain Dump'
        path: 'Knowledge/Brain Dump'
      
    app.postal.publish 
      topic: 'section.new'
      data:
        name: 'Leader of Men'
        path: 'Knowledge/Leader of Men'
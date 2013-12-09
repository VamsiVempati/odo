requirejs = require 'requirejs'

# requirejs
requirejs.config {
		# Pass the top-level main.js/index.js require
		# function to requirejs so that node modules
		# are loaded relative to the top-level JS file.
		nodeRequire: require
		paths: {
		}
}

requirejs ['odo/express'], (express) ->
	
	process.env.PORT = 3000
	
	app = express [
		requirejs './odo/peek'
		requirejs './odo/handlebars'
		requirejs './nodecqrs/socket'
		requirejs './nodecqrs/routes'
	]
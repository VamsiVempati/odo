define ['odo/messaging/hub', 'odo/express/app'], (hub, app) ->
	class Messaging
		web: =>
			app.post '/sendcommand/:command', @sendcommand
		
		sendcommand: (req, res) =>
			if !req.user?
				res.send 403, 'authentication required'
				return
			
			req.body.by = req.user.id
			
			hub.send
				command: req.params.command
				payload: req.body
			
			res.send 'Ok'
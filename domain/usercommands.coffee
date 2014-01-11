define ['odo/eventstore', 'odo/domain/user'], (es, User) ->
	
	defaultHandler = (command) ->
		user = new User command.payload.id
		es.extend user
		user.applyHistoryThenCommand command
	
	startTrackingUser: defaultHandler
	assignEmailAddressToUser: defaultHandler
	assignDisplayNameToUser: defaultHandler
	assignUsernameToUser: defaultHandler
	
	attachTwitterToUser: defaultHandler
	attachFacebookToUser: defaultHandler
	attachGoogleToUser: defaultHandler
	createLocalSigninForUser: defaultHandler
	
	
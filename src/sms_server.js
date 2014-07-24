/*
 * David Lettier (C) 2014.
 * http://www.lettier.com/
 * 
 * The back-end SMS server.
 * 
*/

var http    = require( "http"        );
var mongojs = require( "mongojs"     );
var qs      = require( "querystring" );

var uri = "mongodb://localhost:27017/bullytextsms";

// Connect to the bullytextsms database and select the two collections.

var db = { 

	users: mongojs.connect( uri, [ "sms_users"    ] ),
	msgs:  mongojs.connect( uri, [ "sms_messages" ] )

};

function request_handler( request, response ) 
{

	// An plain text response.
	
	response.writeHead( 200, { "Content-Type": "text/plain" } );
	
	// Respond to POST requests.
	
	if ( request.method == "POST" ) 
	{
		
		// Gather the POST body.
		
		var body = "";
		
		request.on( "data", function ( data ) {
			
			body += data;

			// Avoid large POST bodies.
			
			if ( body.length > 1e6 )
			{
				
				request.connection.destroy( );
				
			}
			
		} );
		
		request.on( "end", function ( ) {
			
			var post    = qs.parse( body );
			
			var uid     = post[ "uid"     ]; // Get the unique identifier.
			var message = post[ "message" ]; // Get the message.
			
			if ( uid === "" || uid === undefined || message === "" || message === undefined  )
			{
				
				console.log( "UID and/or message not set." );
				
				// The UID and the message were not set in the request.
				// Send them scene one.
				
				db.msgs.sms_messages.find( { "name": "scene1" }, function( error, records ) {
					
					if ( error ) 
					{
						
						console.log( "Database query error." );
						
						response.end( );
						
						return false;
						
					}
					
					if ( records.length != 0 )
					{
					
						// Should only be one record.
						
						response.write( records[ 0 ].message );
						
					}
					
					// Finish the server HTTP response.
					
					response.end( );
					
				} );
				
				return false;
				
			}
			
			// Find the user in the database and get their current state.
			// If a user is not found, create a new database entry.
			
			console.log( "User: " + uid, "Message: " + message );

			db.users.sms_users.find( { "name": uid }, function ( error, records ) {				
				
				var name;
				
				var state = "scene1";
			
				if ( records.length === 0 )
				{
					
					// User not found.
					// Send them scene one.
					
					db.users.sms_users.insert( { "name": uid, "state": state }, function ( ) { } );
					
					db.msgs.sms_messages.find( { "name": state }, function( error, records ) {
					
						if ( error ) 
						{
							
							console.log( "Database query error." );
							
							response.end( );
							
							return false;
							
						}
						
						if ( records.length != 0 )
						{
						
							// Should only be one record.
							
							response.write( records[ 0 ].message );
							
						}
						
						// Finish the server HTTP response.
						
						response.end( );
						
					} );
					
				}
				else
				{
					
					// User found.
					
					name  = records[ 0 ].name;
					state = records[ 0 ].state;
					
					var keywords = [ "scene1", "boys", "girls", "convo", "listen", "alex", "sam", "walk", "step", "talk" ];
					
					var state_graph = { 
						
						"scene1": [ "boys", "girls"         ],
						"boys":   [ "convo"                 ],
						"convo":  [ "alex", "sam",  "walk"  ],
						"girls":  [ "listen"                ],
						"listen": [ "step", "talk", "walk"  ],
						"alex":   [ null                    ],
						"sam":    [ null                    ],
						"walk":   [ null                    ],
						"step":   [ null                    ],
						"talk":   [ null                    ]
						
					};
	
					function check_input( message )
					{
						
						// Validate the input against the keywords.
						
						var i = keywords.length;
						
						var keyword = false;
						
						while ( i-- )
						{
							
							if ( message.toLowerCase( ).indexOf( keywords[ i ] ) !== -1 )
							{
								
								keyword = keywords[ i ];
								
								break;
								
							}
							
						}
						
						if ( keyword !== false )
						{
							
							return keyword;
							
						}
						else
						{
						
							return false;
							
						}
						
					}
					
					function next_state_valid( current_state, next_state )
					{
						
						// Validate that the input is the correct reponse to the user's current state.
						
						var next_states = state_graph[ current_state ];
						
						var i = next_states.length;
						
						var valid = false;
						
						while ( i-- )
						{
							
							if ( next_state === next_states[ i ] )
							{
								
								valid = true;
								
								break;
								
							}
							
						}
						
						return valid;
						
					}
					
					function send_message( name, message )
					{
						
						// Send the user their next-state's message.
						
						db.msgs.sms_messages.find( { "name": message }, function( error, records ) {
					
							if ( error ) 
							{
								
								console.log( "Database query error." );
								
								response.end( );
								
								return false;
								
							}
							
							if ( records.length != 0 )
							{
							
								// Should only be one record.
								
								response.write( records[ 0 ].message );
								
							}
							
							// Update the user's current state.
							
							db.users.sms_users.update( { "name": name }, { $set: { "state": message } }, function ( ) { } );
							
							// Finish the server HTTP response.
							
							response.end( );
							
						} );
						
					}
					
					message = check_input( message );
					
					if ( message === false )
					{
						
						console.log( "Message invalid." );
						
						// Resend the user their current state's message.
						
						send_message( name, state );
						
						return false;
						
					}
					
					if ( !next_state_valid( state, message ) )
					{
						
						console.log( "Next state invalid." );
						
						// Resend the user their current state's message.
						
						send_message( name, state );
						
						return false;
						
					}
					
					// Send the appropriate message and finish the reponse.
					
					send_message( name, message );
					
				}				
				
			} );			
			
		} );			
	
	}
	else
	{
		
		// GET request.
		
		response.end( );
		
	}
	
}

// Start the server without the frontend.

var sms_server = http.createServer( request_handler );

var port_number = 8881;

sms_server.listen( port_number, function( ) {
	
    console.log( "SMS server started and listening on port: " + port_number );

} );

module.exports.request_handler = request_handler; // For use in file_handler.js.
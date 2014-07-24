/*
 * David Lettier (C) 2014.
 * http://www.lettier.com/
 * 
*/

var http    = require( "http"        );
var mongojs = require( "mongojs"     );
var qs      = require( "querystring" );

// Connect to the bullytextsms database.

var uri = "mongodb://localhost:27017/bullytextsms";

// Select the two collections.

var db = { 

	users: mongojs.connect( uri, [ "sms_users"    ] ),
	msgs:  mongojs.connect( uri, [ "sms_messages" ] )

};

function request_handler( request, response ) 
{

	// An HTTP reponse.
	
	response.writeHead( 200, { "Content-Type": "text/html" } );
	
	// Responed to POST requests.
	
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
			
			db.msgs.sms_messages.find( { "name": message.toString( ).toLowerCase( ) }, function( error, records ) {
			
				if( error ) 
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
			
		});			
	
	}
	
}

// Start the server without the frontend.

var sms_server = http.createServer( request_handler );

var port_number = 8881;

sms_server.listen( port_number, function( ) {
	
    console.log( "SMS server started and listening on port: " + port_number );

} );

module.exports.request_handler = request_handler; // For use in file_handler.js.
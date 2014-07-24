/*
 * David Lettier (C) 2014.
 * http://www.lettier.com/
 * 
*/

var http    = require("http");
var mongojs = require("mongojs");
var qs      = require('querystring');

var uri = "mongodb://localhost:27017/bullytextsms";

var db = { 

	users: mongojs.connect( uri, [ "sms_users" ]    ),
	msgs:  mongojs.connect( uri, [ "sms_messages" ] )

};

function request_handler( request, response ) 
{

	response.writeHead( 200, { "Content-Type": "text/html" } );
	
	if ( request.method == "POST" ) 
	{
		
		var body = "";
		
		request.on( "data", function ( data ) {
			
			body += data;

			// Too much POST data, kill the connection!
			
			if ( body.length > 1e6 )
			{
				
				request.connection.destroy( );
				
			}
			
		} );
		
		request.on( "end", function ( ) {
			
			var post    = qs.parse( body );
			var uid     = post[ "uid"     ];
			var message = post[ "message" ];
			
			db.msgs.sms_messages.find( { "name": message.toString( ).toLowerCase( ) }, function( error, records ) {
			
				if( error ) 
				{
					
					console.log( "Database query error." );
					
					response.end( );
					
					return false;
					
				}
				
				if ( records.length != 0 )
				{
				
					response.write( records[ 0 ].message );
					
				}
				
				response.end( );
				
			} );
			
		});			
	
	}
	
}

var sms_server = http.createServer( request_handler );

var port_number = 8881;

sms_server.listen( port_number, function( ) {
	
    console.log( "SMS server started and listening on port: " + port_number );

} );

module.exports.request_handler = request_handler;
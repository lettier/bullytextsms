/*
 * David Lettier (C) 2014.
 * http://www.lettier.com/
 * 
*/

var http = require("http");

var   fs = require("fs");
var  url = require("url");
var path = require("path");

var sms_server = require("./sms_server");

var content_types = {
	
    ".html": "text/html",
    ".css":  "text/css",
    ".js":   "application/javascript",
    ".txt":  "text/plain"
};

function file_handler( request, response )
{
	
	if ( request.method == "POST" ) 
	{
		
		sms_server.request_handler( request, response );
		
		return;
		
	}
	
	
	var uri      = url.parse( request.url ).pathname;
	
	var filename = path.join( __dirname, uri );
	
	fs.exists( filename, function ( exists ) {
		
		// if root directory, append test.html
		if ( fs.statSync( filename ).isDirectory( ) ) 
		{
			
			filename += 'index.html';
			
		}
		
		// Get MIME type based on file extension.
		
		var content_type = content_types[ path.extname( filename ) ];
		
		fs.readFile( filename, function( error, file ) {
			

			if ( error ) 
			{
				
				response.writeHead( 404, {'Content-type:': 'text/plain'} );
				response.write( error + "\n" );
				response.end();
			
			} 
			else 
			{
				
				response.setHeader( 'Content-Type:', content_type );
				response.writeHead( 200 );
				response.write( file );
				response.end( );
				
			}
		});
	});
	
}

var file_server = http.createServer( file_handler );

var port_number = 8888;

file_server.listen( port_number, function( ) {
	
    console.log( "File server started and listening on port: " + port_number );

} );
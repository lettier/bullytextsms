/*
 * David Lettier (C) 2014.
 * http://www.lettier.com/
 * 
 * File server for the front-end simulator.
 * 
*/

var http    = require( "http"    );
var   fs    = require( "fs"      );
var  url    = require( "url"     );
var path    = require( "path"    );

var sms_server = require( "./sms_server" );

var content_types = {
	
    ".html": "text/html",
    ".css":  "text/css",
    ".js":   "application/javascript",
    ".txt":  "text/plain",
    ".ico":  "image/x-icon"
    
};

function file_handler( request, response )
{
	
	var cookie            = request.headers.cookie;
	
	var uri               = url.parse( request.url ).pathname;
	
	var filename_and_path = path.join( __dirname, uri );
	
	console.log( uri, filename_and_path )
	
	if ( request.method === "POST" && uri === "/sms_server.js" ) 
	{
		
		sms_server.request_handler( request, response );
		
		return true;
		
	}	
	
	fs.exists( filename_and_path, function ( exists ) {
		
		// Does the file exist?
		
		if ( !exists )
		{
			
			console.log( "File not found: ", filename_and_path );
			
			response.writeHead( 404, { "Content-type": "text/plain" } );
			response.write( "File not found." );
			response.end();
			
			return false;
			
		}
		
		// IF GET / add index.html to filepath.
		
		if ( fs.statSync( filename_and_path ).isDirectory( ) ) 
		{
			
			filename_and_path += 'index.html';
			
		}
		
		// Get the MIME type based on the file extension.
		
		var content_type = content_types[ path.extname( filename_and_path ) ];
		
		// Read in the file.
		
		fs.readFile( filename_and_path, function( error, file ) {
			

			if ( error ) 
			{
				
				response.writeHead( 404, { "Content-type": "text/plain" } );
				response.write( error + "\n" );
				response.end();
			
			} 
			else 
			{
				
				response.setHeader( "Content-Type", content_type );
				
				// Set a cookie to establish a session.
				
				if ( cookie === undefined )
				{
					
					// The session expires after one minute.
					// Once the session expires, they will be greeted with the beginning scene.
					// During the session, the server continues along the story line.
					
					var date = new Date( );
					date.setTime( date.getTime( ) + ( 1 * 60 * 1000 ) );
					date = date.toUTCString( );
					
					response.setHeader( "Set-Cookie", "session_id=" 
					+ Math.floor( Math.random( ) * 10000000000 ).toString( )
					+ "; path=/"
					+ "; domain="
					+ "; expires=" + date
					);
					
				}
				
				// Write the HTTP header, the file, and then end the response;
				
				response.writeHead( 200 );
				response.write( file );				
				response.end( );
				
			}
		});
	});
	
}

// Start the server.

var file_server = http.createServer( file_handler );

var port_number = 8888;

file_server.listen( port_number, function( ) {
	
    console.log( "File server started and listening on port: " + port_number );

} );
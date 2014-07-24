/*
 * David Lettier (C) 2014.
 * http://www.lettier.com/
 * 
 * The front-end simulator logic.
 * 
*/

$( document ).ready( function ( ) {
	
	var keywords = [ "BOYS", "GIRLS", "CONVO", "LISTEN", "ALEX", "SAM", "WALK", "STEP", "TALK" ];
	
	var cookie_data = document.cookie;
	
	function check_input( message )
	{
		
		// Validate user input against the keywords.
		
		var i = keywords.length;
		
		var keyword = false;
		
		while ( i-- )
		{
			
			if ( message.toUpperCase( ).indexOf( keywords[ i ] ) !== -1 )
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
	
	function update_input_elements( ) 
	{
		
		// Move the input text box and the button to the bottom of the phone screen.
		
		var response_box  = $( "#response_box" )[ 0 ].outerHTML;
			
		$( "#response_box" ).remove( );
		
		$( "#phone_screen" ).append( response_box );
		
		var submit_button = $( "#submit_button" );
		
		$( "#submit_button" ).remove( );
		
		$( "#phone_screen" ).append( submit_button );
		
	}
	
	function get_sms_message( message )
	{
		
		$.ajax( {
			
			type: "POST",
			url:  "http://localhost:8888/sms_server.js",
			data: { uid: cookie_data.split( "=" )[ 1 ], message: message.toLowerCase( ) },
			success: function( msg ) {
				
				if ( msg !== "" )
				{
				
					// Bold the keywords, the user needs to text back, in the messsage.
					
					var i = keywords.length;
					
					while( i-- )
					{
						
						var index = msg.indexOf( keywords[ i ] );
						
						if ( index !== -1 )
						{
						
							msg = msg.slice( 0, index ) + "<strong>" + keywords[ i ] + "</strong> " + msg.slice( index + keywords[ i ].length, msg.length  );
							
						}							
						
					}
					
					$( "#phone_screen" ).append( "<span class='text_message text_message_in'>" + msg + "</span>" );
					
					update_input_elements( );
					
					// Set the keyboard focus back to the input field.
					
					$( "#response_box" ).focus( );
					
				}
				
			}
			
		} );		
		
	}
	
	function click_callback( )
	{
		
		var user_input = $( "#response_box" ).val( );
		
		if ( user_input === "" )
		{
			
			return false;
			
		}
		
		$( "#phone_screen" ).append( "<span class='text_message text_message_out'>" + user_input + "</span>" );
		
		var message = check_input( user_input );
		
		if ( message === false )
		{
			
			update_input_elements( );
			
			return false;
			
		}

		get_sms_message( message );
		
		update_input_elements( );
		
		$( "#phone_screen" ).animate( { scrollTop: $( "#phone_screen")[ 0 ].scrollHeight }, 1000 );
		
	}
	
	$( "#phone_button" ).click( click_callback );
	
	$( "#submit_button" ).live( "click", click_callback );
	
	$( "#response_box" ).live( "focus", function ( ) {
		
		$( this ).val( "" );
		
	} );
	
	$( "#response_box" ).live( "keypress", function ( event ) {
		
		if( event.which == 13 ) 
		{
		
			click_callback( );
			
		}
		
	} );
	
	get_sms_message( "scene1" );	
	
} );
/*
 * David Lettier (C) 2014.
 * http://www.lettier.com/
 * 
*/

var mongojs = require( "mongojs" );

var db = mongojs.connect( "mongodb://localhost:27017/bullytextsms" ); 

sms_msgs = db.collection( "sms_messages" );

sms_msgs.remove( function ( ) { } );

sms_msgs.insert( {"name":"scene1","message":"You arrive at school and get ur schedule. AH! Gym first period! Head to the locker room to get ready. Do you use the BOYS or GIRLS locker room?" }, function ( ) { } );

sms_msgs.insert( {"name":"boys","message":'You\'re changing & you overhear Alex say "Sam is in this class, he\'s so gay, bet he\'s going to be checking us out. Gross." Text CONVO to see what happens' }, function ( ) { }  );

sms_msgs.insert( {"name":"girls","message":'You\'re changing for gym & you overhear Alex say, "OMG Sam is in this class? She\'s so gay. Bet she\'s checking us out. Gross." Text LISTEN to see what happens' }, function ( ) { }  );

sms_msgs.insert( {"name":"convo","message":"You see that Sam overheard & looks upset. Do you say something to ALEX, knowing he might come after you, to SAM knowing you may get made fun of, or WALK away?" }, function ( ) { }  );

sms_msgs.insert( {"name":"listen","message":"You see that Sam overheard and looks upset. Do you say something to Alex and STEP in, TALK to Sam, or do you WALK away?" }, function ( ) { }  );

sms_msgs.insert( {"name":"alex","message":'"Hey man, chill." Alex makes a dig at you, but stops. During gym, Sam thanks you for your help. You\'re feeling pretty good and move to the CAFE.(Text CAFE)' }, function ( ) { }  );

sms_msgs.insert( {"name":"sam","message":'"Hey man, dont listen to him, he\'s just being a jerk. Ignore him." Sam thanks you & asks if you want to hang out.You say yes & move to CAFE. (Text CAFE)' }, function ( ) { }  );

sms_msgs.insert( {"name":"walk","message":"Alex keeps ragging on Sam. Later in class you see Sam's nowhere to be found. Text CLASS to get gym over with and head to your next period." }, function ( ) { }  );

sms_msgs.insert( {"name":"talk","message":'"Hey girl, don\'t listen to her, she\'s just insecure. Wanna be in my group for warmups?" Text GYM to get class over with and move on to your next period.' }, function ( ) { }  );

sms_msgs.insert( {"name":"step","message":'You say "Seriously Alex? who cares anyways?" Alex makes a dig at you but shuts up about Sam. You finish GYM (text GYM) and go to your next class.' }, function ( ) { process.exit( ) }  );
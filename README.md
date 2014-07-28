![Screenshot](http://raw.github.com/lettier/bullytextsms/master/screenshot.jpg)

# Bully Text SMS

A [DoSomething.org](https://www.dosomething.org) code screen.  

**Playable at [http://bullytextsms-lettier.rhcloud.com/](http://bullytextsms-lettier.rhcloud.com/).**

Dependencies include Node.js and MongoDB.

Notes:  

* Once the user visits the front-end simulator, a session is created for one minute via a cookie. The session ID becomes the user's identification.
* The user can send the SMS server text messages. If the input is valid, the user will receive the next appropriate SMS text message from the SMS server. 
* The input can be in all caps, lowercase, and/or some combination containing the keyword. For instance: _BOYS_, _boYs_, or _bOysZz_ would be accepted as valid input. 
* If a user sends the wrong keyword, not listed in the current scene, the user is sent the current scene text message again.

To run:  
```
$ node ./src/populate_db_sms_msgs.js
$ node ./src/file_server.js
```

Browser: `http://localhost:8888`

For just the SMS server:
```
$ node ./src/sms_server.js
$ telnet localhost 8881
POST / HTTP/1.0
Content-Length: 20
  
uid=<some_number>&message=<some_message>
```

Test:  
```
$ node src/sms_server.js
SMS server started and listening on port: 8881
$ curl --data "uid=003&message=HeLl0" localhost:8881
You arrive at school and get ur schedule. AH! Gym first period! Head to the locker room to get ready. Do you use the BOYS or GIRLS locker room?
$ curl --data "uid=003&message=boysaboys" localhost:8881
You're changing & you overhear Alex say "Sam is in this class, he's so gay, bet he's going to be checking us out. Gross." Text CONVO to see what happens
$ curl --data "uid=003&message=girls" localhost:8881
You're changing & you overhear Alex say "Sam is in this class, he's so gay, bet he's going to be checking us out. Gross." Text CONVO to see what happens
$ curl --data "uid=003&message=CONVO" localhost:8881
You see that Sam overheard & looks upset. Do you say something to ALEX, knowing he might come after you, to SAM knowing you may get made fun of, or WALK away?
$ curl --data "uid=003&message=boys" localhost:8881
You see that Sam overheard & looks upset. Do you say something to ALEX, knowing he might come after you, to SAM knowing you may get made fun of, or WALK away?
$ curl --data "uid=003&message=Alex" localhost:8881
"Hey man, chill." Alex makes a dig at you, but stops. During gym, Sam thanks you for your help. You're feeling pretty good and move to the CAFE.(Text CAFE)
$ curl --data "uid=003&message=CAFe" localhost:8881
"Hey man, chill." Alex makes a dig at you, but stops. During gym, Sam thanks you for your help. You're feeling pretty good and move to the CAFE.(Text CAFE)
```

(C) 2014 David Lettier.  
http://www.lettier.com/
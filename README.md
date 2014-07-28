![Screenshot](http://raw.github.com/lettier/bullytextsms/master/screenshot.jpg)

# Bully Text SMS

A [DoSomething.org](https://www.dosomething.org) code screen.  

**Playable at [http://bullytextsms-lettier.rhcloud.com/](http://bullytextsms-lettier.rhcloud.com/).**

Dependencies include Node.js and MongoDB.  

Once the user visits the front-end simulator, a session is created for one minute via a cookie. The user can send the SMS server text messages. If the input is valid, the user will receive the next appropriate SMS text message from the SMS server. The input can be in all caps, lowercase, and/or some combination of the keyword. For instance: _BOYS_, _boYs_, or _bOysZz_ would be accepted as valid input.

To run:  
```$ node ./src/populate_db_sms_msgs.js
$ node ./src/file_server.js```
Browser: `http://localhost:8888`  

For just the SMS server:  
```$ node ./src/sms_server.js
$ telnet localhost 8881
POST / HTTP/1.0
Content-Length: 20

uid=<some_number>&message=<some_message>```

(C) 2014 David Lettier.  
http://www.lettier.com/
![Screenshot](http://raw.github.com/lettier/bullytextsms/master/screenshot.jpg)

# Bully Text SMS

A [DoSomething.org](https://www.dosomething.org) code screen.  

Dependencies includes Node.js and MongoDB.  

To test:  
`$ node ./src/file_server.js`  
Browser: `http://localhost:8888`  

For just the SMS server:  
`$ node ./src/sms_server.js`  
`$ telnet localhost 8888`  
`POST / HTTP/1.0`  
`Content-Length: 20`  

uid=<some_number>&message=<some_message>

(C) 2014 David Lettier.  
http://www.lettier.com/
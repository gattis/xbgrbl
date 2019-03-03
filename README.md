GBRL controller written for linux in javascript.  It talks to an XBOX One S wireless controller, supported by the xpadneo driver.   

Run xbgrbl with -p and -b for port and baud rate of your controller.  It also creates a fake /dev/tty666 that acts as a fake passthrough grbl controller, so you can still use your existing controller interface by connecting it to /dev/ttyS666, as commands will be forwarded through and responses sent back.  

The code uses the new GRBL v1.1 jog mode commands and is quite smooth / usable.  The curve applied to the analog joystick throw allows for both rapid movement across the machine and super fine positioning.

I run it on a nanopi neo4 (you could get away with a raspberry pi fine), which connects to the grbl ontroller over usb serial, to the controller over bluetooth, and to my network over wifi / ethernet.  I run cncjs on the same neo4 so I can run my jobs from any browser and also can use the xbox controller whenever the machine is in the idle state.

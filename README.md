GBRL controller written for linux in javascript.  It talks to an XBOX One S wireless controller, supported by the xpadneo driver.   Run xbgrbl with -p and -b for port and baud rate of your controller.  It also creates a fake /dev/tty666 that acts as a fake passthrough grbl controller, so you can still use your existing controller interface by connecting it to /dev/ttyS666, as commands will be forwarded through and responses sent back.  
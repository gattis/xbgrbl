var serialport = require('serialport');
const events = require('events');
var dbg = (msg) => {}

module.exports = class GRBL extends events {
    constructor(options) {
	super();
	const self = this;

	if (options.debug) dbg = (msg) => { console.log(msg) }

	self.grblctrl = new serialport(options.port, { baudRate: 115200 });
	self.grblparse = new serialport.parsers.Readline();
	self.grblctrl.pipe(self.grblparse);

	self.swctrl = new serialport("/dev/grblpipe");
	self.swctrl.pipe(self.grblctrl);
	self.grblctrl.pipe(self.swctrl);
	
	self.grblparse.on('data', (line) => {
	    dbg('<machine>: '+line);
	    if (line.startsWith('ok') || line.startsWith('error')) self.emit('ok');
	});
    }

    write(data) {
	dbg('we write:'+data); 
	this.grblctrl.write(data);
	this.grblctrl.drain();
    }

    writeln(line) {
	this.write(line + '\n');
    }
}

        


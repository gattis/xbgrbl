const HID = require('node-hid');
const events = require('events');


module.exports = class XBOX extends events {
    constructor() {
	super();

	const dev = new HID.HID(1118,765);
	var xb = this;
	
	xb.axes = {'lx':0, 'ly':0, 'rx':0, 'ry':0, 'lz':0, 'rz':0}
	xb.buttons = {'pu':false, 'pr':false, 'pd':false, 'pl':false,
			'a':false, 'b':false, 'x':false, 'y':false,
			'bl':false, 'br':false, 'st':false, 'sl':false}

	dev.on('data', (buf) => {
	    if(buf.readUInt8(0) != 1) return;

	    Object.entries({'lx': buf.readUInt16LE(1)-0x7FFF, 'ly': 0x7FFF-buf.readUInt16LE(3),
			    'rx': buf.readUInt16LE(5)-0x7FFF, 'ry': 0x7FFF-buf.readUInt16LE(7),
			    'lz': buf.readInt16LE(9), 'rz': buf.readInt16LE(11)})
		  .forEach(([axis,val]) => {
		      if (val != xb.axes[axis]) {
			  xb.emit(axis, val)
			  xb.emit('axis', [axis, val])
		      }
		      xb.axes[axis] = val;
		  });
	       
	    const A = buf.readUInt8(13), B = buf.readUInt8(14);
	    Object.entries({'pu':(A==1 || A==2 || A==8),
			    'pr':(A==2 || A==3 || A==4),
			    'pd':(A==4 || A==5 || A==6),
			    'pl':(A==6 || A==7 || A==8),
			    'a':(B & 0x01)>0, 'b':(B & 0x02)>0, 'x':(B & 0x04)>0, 'y':(B & 0x08)>0,
			    'bl':(B & 0x10)>0, 'br':(B & 0x20)>0, 'st':(B & 0x40)>0, 'sl':(B & 0x80)>0})
		.forEach(([button,val]) => {
		      if (val != xb.buttons[button]) {
			  xb.emit(button,val)
			  xb.emit("button",[button,val])
			  if (val) xb.emit(button+':down');
			  else xb.emit(button+':up');
		      }
		      xb.buttons[button] = val;
		  });
	    
	});
    }
}

        


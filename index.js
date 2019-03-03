#!/usr/bin/env node

const XBOX = require('./xbox.js');
const GRBL = require('./grbl.js');

const DT = .01; // s
const PLANBLOCKS = 15
const MAX_FEED = 6000/60 // mm/s

module.exports = (options) => {

    var dbg = (msg) => {}
    if (options.debug) dbg = (msg) => { console.log(msg)  }

    var xb,grbl;
    
    const linkXbox = () => {
	try {
	    xb = new XBOX()
	    if (grbl) run();
	} catch(e) {
	    dbg('waiting for xbox')
	    setTimeout(linkXbox,1000)
	}
    }

    const linkGrbl = () => {
	try {
	    grbl = new GRBL(options)
	    if (xb) run();
	} catch(e) {
	    dbg("waiting for ttys:"+e);
	    setTimeout(linkGrbl,1000)
	}
    }
	    
    const run = () => {
	dbg('running');
   
	xb.on('st:up', e => {
	    dbg('ST');
	    grbl.writeln('$X');
	});

	xb.on('bl:down', e => {
	    if (xb.buttons['br'])
		grbl.writeln('$H');
	});

	xb.on('br:down', e => {
	    if (xb.buttons['bl'])
		grbl.writeln('$H');
	});

	xb.on('x:up', e => {
	    dbg('X');
	    grbl.writeln('G10 L20 P1 X0');
	});

	xb.on('y:up', e => {
	    dbg('Y');
	    grbl.writeln('G10 L20 P1 Y0');
	});
    
	xb.on('b:up', e => {
	    dbg('B');
	    grbl.writeln('G10 L20 P1 Z0');
	});

	const calcthrow = (hidval) => { // joystick throw function from -1 to 1
	    const adj = (Math.max(0,Math.abs(hidval) - 5000) / 27768) ** 2;
	    return adj ? (adj * Math.sign(hidval)) : 0;
	}
	
	const gstr = (name,val) => {
	    const rounded = Math.round(val * 10000) / 10000;
	    return rounded ? (' ' + name + rounded) : '';
	}

	var isMoving = false

	const step = () => {
	    const xfree = xb.axes.lz > 500;
	    const yfree = xb.axes.rz > 500;
	    const zfree = xfree && yfree;
	    const xfeed = xfree ? (calcthrow(xb.axes.rx) * MAX_FEED) : 0;
	    const yfeed = yfree ? (calcthrow(xb.axes.ry) * MAX_FEED) : 0;
	    const zfeed = zfree ? (calcthrow(xb.axes.ly) * MAX_FEED): 0;
	    const feedrate = Math.sqrt(xfeed**2 + yfeed**2 + zfeed**2);
	    const fstr = gstr('F',Math.round(feedrate * 60))
	    const mstr = gstr('X',xfeed*DT) + gstr('Y',yfeed*DT) + gstr('Z',zfeed*DT);
	    if (mstr && fstr) {
		isMoving = true;
		grbl.writeln('$J=G91 G21' + fstr + mstr);
		grbl.prependOnceListener('ok', ()=> {
		    setTimeout(step, Math.round((DT+0.001)*1000));
		});
	    } else {
		if (isMoving) {
		    grbl.write("\x85\n")
		    
		    isMoving = false
		}
		setTimeout(step, 100);
	    }
	}
		
	setTimeout(step,0);
	

	
    }

    linkXbox();
    linkGrbl();
}

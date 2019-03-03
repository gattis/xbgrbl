#!/usr/bin/env node

var program = require('commander');
var main = require('../index');
var options = {};

program
    .option('-d, --debug', 'enable debug logging to stdout', false)
    .option('-p, --port <port>', 'path or name of serial port', "/dev/ttyACM0")
    .option('-b, --baudrate <baudrate>', 'baud rate (default: 115200)', 115200)
    .parse(process.argv);

main(program);



				    


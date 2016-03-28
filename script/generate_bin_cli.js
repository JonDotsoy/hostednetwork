var os = require("os");
var fs = require("fs");
var path = require("path");
var async = require("async");

var file = path.normalize(__dirname + "/../bin/cli.js");
var dirbin = path.normalize(__dirname + "/../bin");
var fp = null;
var existsDirectoryBin = false; 

async
.series([
	// Check directory and create
	function (next) {
		fs.stat(dirbin, function (err, statDir) {
			if (err) {
				fs.mkdir(dirbin, function (err) {
					next(err);
				});
			} else {
				next();
			}
		});
	},
	// Open file
	function(next) {
		fs.open(file, 'w', 766, function(err, id) {
			fp = id;
			next(err, id);
		});
	},

	// Write file
	function(next) {
		fs
			.write(fp, [
					"#!/usr/bin/env node",
					"",
					"require(\"../lib/cli\").cli(process.argv.slice(2));",
					"",
				].join("\n"),
				null,
				'utf8',
				function(err, written, buffer) {
					next(err, written);
				});
	},

	// Close file
	function(next) {
		fs.close(fp, function(err) {
			next(err);
			console.log(`File Create ${file}.`);
		});
	}
], function (err) {
	if (err) {
		console.log(err.stack);
		process.exit(1);
	}
});

var os = require("os");
var fs = require("fs");
var path = require("path");
var async = require("async");

var file = path.normalize(__dirname + "/../bin/cli.js");

fs.open(file, 'w+', 766, function(e, id) {
	async
	.series([
		function(next) {
			fs
				.write(id, [
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
	], function() {
		fs.close(id, function() {
			console.log(`File Create ${file}.`);
		});
	});

});

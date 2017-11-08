var FS = require("fs");
var PATH = require("path");
var parseArgs = require('minimist');
var md5File = require('md5-file')

function getFilesizeInBytes(filename) {
	var stats = FS.statSync(filename)
	var fileSizeInBytes = stats["size"]
	return fileSizeInBytes
}

var argv = parseArgs(process.argv.slice(2));

if (argv._.length == 2) {
	var dirname = argv._[0];
	var outfile = PATH.resolve(argv._[1]);
	var now = Math.floor(new Date().getTime() / 1000);
	console.log('Current time: ' + now);
	console.log('folder: ' + dirname + '...');
	FS.readdir(dirname, function (err, files) {
		var filesToProcess = [];
		files.forEach(f => {
			var p = PATH.join(dirname, f);
			if (FS.lstatSync(p).isFile() && PATH.resolve(p) != outfile) {
				filesToProcess.push(f);
			}
		});

		var totalFileSize = 0;
		var files = {};
		filesToProcess.forEach(f => {
			var p = PATH.join(dirname, f);
			const hash = md5File.sync(p);
			const filesize = getFilesizeInBytes(p);
			files[f] = {
				hash: hash,
				filesize: filesize
			};
			totalFileSize += filesize;
		});

		FS.writeFile(outfile, JSON.stringify({
			version: now,
			files: files, 
			totalFileSize: totalFileSize
		}), function (err) {
			if (err) {
				return console.error(err);
			}	

			console.log('DONE: ' + outfile);
		})
	});
}

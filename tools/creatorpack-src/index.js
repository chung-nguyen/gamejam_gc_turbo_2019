var FS = require("fs");
var FSE = require('fs-extra');
var PATH = require("path");
var parseArgs = require('minimist');

var argv = parseArgs(process.argv.slice(2));

var outdir = argv.outdir || '';
var resdirs = {};

for (var k in argv) {
	if (k.endsWith('dir')) {
		FSE.mkdirpSync(argv[k]);
		resdirs[k.substring(0, k.length - 3)] = argv[k];
	}
}

function scanForFiles(dirname, list) {
	console.log('folder: ' + dirname + '...');
	var files = FS.readdirSync(dirname);
		
	files.forEach(fn => {
		var pathString = PATH.join(dirname, fn);
		if (FS.lstatSync(pathString).isDirectory()) {
			scanForFiles(pathString, list);
		} else {
			list.push(pathString);
		}
	});			
}

function copyFile(source, dest) {
	var destPath = PATH.join(dest, PATH.basename(source));
	console.log('Copy to: ' + destPath);
	FS.createReadStream(source).pipe(FS.createWriteStream(destPath));
}

function copyRes(source, uuid, dest) {
	var destPath = PATH.join(dest, uuid) + PATH.extname(source);
	console.log('Copy to: ' + destPath);
	FS.createReadStream(source).pipe(FS.createWriteStream(destPath));	
}

function readMeta(path, cb) {
	FS.readFile(path, 'utf8', (err, str) => {
		if (err) {
			console.error(err);
		} else {
			try {
				cb(JSON.parse(str));
			} catch (e) {
				console.error(e);
			}
		}
	});
}

if (argv._.length > 0) {
	var dirname = argv._[0];	
	var allFiles = [];
	scanForFiles(dirname, allFiles);

	allFiles.forEach(pathString => {
		if (PATH.extname(pathString) === '.meta') {
			var baseDirName = PATH.dirname(pathString);
			var baseFileName = PATH.basename(pathString, '.meta');
			var baseFilePath = PATH.join(baseDirName, baseFileName);

			FS.stat(baseFilePath, function(err, stat) {
			    if (err == null) {
			    	if (stat.isFile()) {
			    		if (PATH.extname(baseFileName) === '.fire') {
				        	copyFile(baseFilePath, outdir);
				        } else {
				        	readMeta(pathString, meta => {
				        		var outpath = resdirs[meta.type];
				        		var uuid = meta.uuid;
				        		var subMeta = meta.subMetas[PATH.basename(baseFileName, '.png')];				        		
				        		if (subMeta) {
				        			uuid = subMeta.uuid;
				        		}
		        				copyRes(baseFilePath, uuid, outpath || outdir);				        		
				        	});
				        }
			    	}			        
			    } else {
			    	console.error(err);
			    }
			});
		}
	});	
}

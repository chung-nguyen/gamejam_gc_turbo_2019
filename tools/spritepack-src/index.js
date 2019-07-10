var FS = require("fs");
var MIME = require("mime");
var PATH = require("path");
var parseArgs = require('minimist');
var spriter = require('./devkit-spriter');

var genplist = require('./genplist');
var genfnt = require('./genfnt');

// spritepack --outdir dir [directories]
var argv = parseArgs(process.argv.slice(2));

global.outdir = argv.outdir || '';
global.keepMargin = argv.keepMargin || false;
global.prefix = argv.prefix || '';
global.maxSheetSize = argv.maxSheetSize || 1024;
global.spritePadding = argv.padding || 2;
global.isBitmapFont = argv.bitmapfont || false;

argv._.forEach(function (dirname) {
	console.log('folder: ' + dirname + '...');
	FS.readdir(dirname, function (err, files) {
		if (err) {
			console.error(err);
		} else {
			var scale = {};
			var list = files.map(function (f) {
				var t = MIME.lookup(f);
				if (t.startsWith('image')) {
					var p = PATH.join(dirname, f);
					scale[p] = 1;					
					return p;
				}			
				return null;		
			});	
			list = list.filter((it) => it !== null);

			spriter.loadImages(list, scale).then(function (res) {				
				if (keepMargin) {
					res.images.forEach(image => {
						image.margin = {top: 0, right: 0, bottom: 0, left: 0};
						image.contentWidth = image.width;
						image.contentHeight = image.height;
						image.contentArea = image.area;
					});
				}				

				if (!isBitmapFont) 
				{					
					genplist(res.images, dirname);
				} else {
					genfnt(res.images, dirname);
				}				
			});
		}		
	});
});

global.nextPowerOfTwo = function(n) {
  if (n === 0) return 1
  n--
  n |= n >> 1
  n |= n >> 2
  n |= n >> 4
  n |= n >> 8
  n |= n >> 16
  return n+1
}
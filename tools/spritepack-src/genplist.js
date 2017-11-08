var FS = require("fs");
var MIME = require("mime");
var PATH = require("path");
var plist = require("plist");
var spriter = require('./devkit-spriter');

function plistV2(x, y) {
	return "{" + x + "," + y + "}";
}

function getOldHashes(outdir, dirname) {
	var oldHashes = {};
	var index = 0;

	dirname = PATH.basename(dirname);

	while (index < 100) {
		var plistFile = PATH.join(outdir, dirname + '_' + index + '.plist');	
		if (FS.existsSync(plistFile)) {
			var oldData = FS.readFileSync(plistFile, 'utf8');
			if (oldData) {
				var oldPlist = plist.parse(oldData);
				var hashes = oldPlist.metadata && oldPlist.metadata.hashes;

				// merge
				for (var k in hashes) {
					oldHashes[k] = hashes[k];
				}
			} else {
				break;
			}

			++index;
		} else {
			break;
		}		
	}	

	return oldHashes;
}

function checkRework(oldHashes, images) {
	var needRework = false;	
	var len = images.length;

	if (oldHashes) {
		if (Object.keys(oldHashes).length != len) {
			needRework = true;
		} else {
			for (var i = 0; i < len; ++i) {
				var img = images[i];
				var name = prefix + PATH.basename(img.filename);
				if (oldHashes[name] != img.hash) {
					needRework = true;
					break;
				}
			}
		}
	} else {
		needRework = true;
	}

	return needRework;
}

function findBiggestSize(images) {
	var biggestSize = 1;
	images.forEach(image => {
		biggestSize = Math.max(biggestSize, image.contentWidth);
		biggestSize = Math.max(biggestSize, image.contentHeight);
	});

	biggestSize = nextPowerOfTwo(biggestSize);
	return biggestSize;
}

function packSpritesheets(images, biggestSize, maxSize) {
	var spritesheets;					  		
	do {
		spritesheets = spriter.sprite(images, {maxSize: biggestSize, padding: spritePadding, powerOfTwoSheets: true});
		biggestSize = nextPowerOfTwo(biggestSize + 1);
	} while (spritesheets && spritesheets.length > 1 && biggestSize <= maxSize);
	return spritesheets;
}

function writeSpriteSheet(sheet, index, outdir, dirname) {
	dirname = PATH.basename(dirname);
	sheet.composite();

	var hashes = {};
	var frames = {};
	sheet.sprites.forEach(function (spr) {
		var sprFileName = PATH.basename(spr.filename);
		var name = prefix + sprFileName;
		hashes[name] = spr.hash;

		var margin = spr.margin;
		var originalCenter = {x: spr.width / 2, y: spr.height / 2};
		var trimmedCenter = {x: margin.left +  spr.contentWidth / 2, y: margin.top + spr.contentHeight / 2};		

		frames[name] = {
			offset: plistV2(trimmedCenter.x - originalCenter.x, originalCenter.y - trimmedCenter.y),
			sourceSize: plistV2(spr.width, spr.height),
			frame: plistV2(plistV2(spr.x, spr.y), plistV2(spr.contentWidth, spr.contentHeight)),
			sourceColorRect: plistV2(plistV2(margin.left, margin.top), plistV2(spr.contentWidth, spr.contentHeight)),
			textureRotated: false							
		};
	});						

	var plistFile = PATH.join(outdir, dirname + '_' + index + '.plist');	
	var imageSheetFile = PATH.join(outdir, dirname + '_' + index + '.png');
	sheet.buffer.getBuffer(MIME.lookup(imageSheetFile))
		.then(function (buffer) {
			var stream = FS.createWriteStream(imageSheetFile);
	        stream.on("open", function(fh) {
	            stream.write(buffer);
	            stream.end();	            

	            console.log('wrote: ' + imageSheetFile);

	            var json = {
	              "frames": frames,
				  "metadata": {
			  		"format": 2,
				    "size": plistV2(sheet._width, sheet._height),
				    "realTextureFileName": PATH.basename(imageSheetFile),
				    "textureFileName": PATH.basename(imageSheetFile),
				    "hashes": hashes
				  }
				};

				FS.writeFile(plistFile, plist.build(json), function (err) {
					if (err) {
						return console.error(err);
					}

					console.log('wrote: ' + plistFile);
				});							
	        });				        
		},
		function (err) {
			console.error(err);
		});		
}

function genplist(images, dirname) {
	var oldHashes = getOldHashes(outdir, dirname);					
	var needRework = checkRework(oldHashes, images);	
	
	if (needRework) {
		var biggestSize = findBiggestSize(images);
		var spritesheets = packSpritesheets(images, biggestSize, maxSheetSize);
			
		spritesheets.forEach((sheet, index) => {
			writeSpriteSheet(sheet, index, outdir, dirname);
		});
	}
	else {
		console.log('No need to rework: ' + dirname);
	}
}

module.exports = genplist;
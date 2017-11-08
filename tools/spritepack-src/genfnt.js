var OS = require("os");
var FS = require("fs");
var MIME = require("mime");
var PATH = require("path");
var UTIL = require("util");

var spriter = require('./devkit-spriter');

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

function writeSpriteSheet(sheet, outdir, filename) {
	var imageSheetFile = PATH.join(outdir, filename);
	sheet.buffer.getBuffer(MIME.lookup(imageSheetFile))
		.then(function (buffer) {
			var stream = FS.createWriteStream(imageSheetFile);
	        stream.on("open", function(fh) {
	            stream.write(buffer);
	            stream.end();	            

	            console.log('wrote: ' + imageSheetFile);
	        });				        
		},
		function (err) {
			console.error(err);
		});		
}

function createFontCommonData(fontData, sheet) {
	var info = fontData.info;
	var common = fontData.common;

	common.lineHeight = 0;
	common.base = 75;

	sheet.sprites.forEach(function (spr) {
		info.size = Math.max(info.size, spr.contentHeight);		

		var lh;		
		var b;
		if (spr.margin.top + spr.contentHeight >= spr.height * 0.75) {			
			lh = spr.contentHeight;		
			b = spr.height * 0.75 - spr.margin.top;
		} else {
			lh = spr.height * 0.75 - spr.margin.top;
			b = lh;
		}

		if (lh > common.lineHeight) {
			common.lineHeight = lh;
			common.base = b;
		}
	});
}

function getSpriteSheetFontData(dirname, fontData, sheet, index) {	
	var info = fontData.info;
	var common = fontData.common;

	var char = [];
	sheet.sprites.forEach(function (spr) {
		var sprFileName = PATH.basename(spr.filename, PATH.extname(spr.filename));
		var letter; 
		var id;
		if (sprFileName.startsWith('u')) {
			id = Number.parseInt(sprFileName.slice(1));
			letter = String.fromCharCode(id);
		} else {
			letter = sprFileName.charAt(0);
			id = letter.charCodeAt(0);
		}
		
		var margin = spr.margin;
		var originalCenter = {x: spr.width / 2, y: spr.height / 2};
		var trimmedCenter = {x: margin.left +  spr.contentWidth / 2, y: margin.top + spr.contentHeight / 2};				

		var ch = {
			id,
			letter,
			x: spr.x,
			y: spr.y,
			width: spr.contentWidth, 
			height: spr.contentHeight,
			xoffset: Math.round(trimmedCenter.x - originalCenter.x),
			yoffset: margin.top - (spr.height * 0.75 - common.lineHeight),
			xadvance: spr.contentWidth + 1,
			page: index,
			chnl: 0
		};		

		char.push(ch);
	});		

	var imageSheetFile = dirname + '_' + index + '.png';
	var page = {
		char,		
		id: index,
		file: imageSheetFile,		
		kerning: []
	};

	fontData.page.push(page);
	return page;
}

function fontEntryToString(name, entry) {
	var res = name + " ";
	for (var k in entry) {
		var v = entry[k];
		if (!Array.isArray(v)) {
			if (Number.isInteger(v)) {
				res += k + "=" + v.toString() + " ";
			} else {
				res += k + "=" + '"' + v.toString() + '"' + " ";
			}			
		} else if (v.length > 0 && typeof(v[0]) !== 'object') {
			res += k + "=" + v.join() + " ";
		}
	}
	res += OS.EOL;

	for (var k in entry) {
		var v = entry[k];
		if (Array.isArray(v) && (typeof(v[0]) === 'object' || v.length === 0)) {
			res += k + "s" + " " + "count=" + v.length + OS.EOL;
			v.forEach(e => {
				res += fontEntryToString(k, e);
			});			
		}
	}
	return res;
}

function writeFont(fontData, outdir, dirname) {
	var info = fontData.info;
	var common = fontData.common;
	common.pages = fontData.page.length;

	var fntFile = PATH.join(outdir, dirname + '.fnt');
	var data = "";

	for (var k in fontData) {
		var v = fontData[k];
		if (Array.isArray(v)) {
			v.forEach(e => {
				data += fontEntryToString(k, e);
			});
		} else {
			data += fontEntryToString(k, v);
		}		
	}

	FS.writeFile(fntFile, data, function (err) {
		if (err) {
			return console.error(err);
		}		
		console.log('wrote: ' + fntFile);
	});
}

function genfnt(images, dirname) {
	dirname = PATH.basename(dirname);
	
	var biggestSize = findBiggestSize(images);
	var spritesheets = packSpritesheets(images, biggestSize, maxSheetSize);

	var biggestW = 0;
	var biggestH = 0;
	spritesheets.forEach(sheet => {
		biggestW = Math.max(sheet.width, biggestW);
		biggestH = Math.max(sheet.height, biggestH);
	});
		
	var fontData = {
		info: {
			face: dirname,
			size: 0,
			bold: 0,
			italic: 0,
			charset: "",
			unicode: 0,
			stretchH: 100,
			smooth: 1,
			aa: 1,
			padding: [0,0,0,0],
			spacing: [spritePadding, spritePadding]
		},
		common: {
			lineHeight: 0,
			base: 0,
			scaleW: biggestW,
			scaleH: biggestH,
			pages: 0,
			packed: 0
		},
		page: []
	};

	spritesheets.forEach((sheet, index) => {
		createFontCommonData(fontData, sheet);
	});

	spritesheets.forEach((sheet, index) => {
		sheet.composite(biggestW, biggestH);
		var page = getSpriteSheetFontData(dirname, fontData, sheet, index);
		writeSpriteSheet(sheet, outdir, page.file);
	});

	writeFont(fontData, outdir, dirname);
}

module.exports = genfnt;

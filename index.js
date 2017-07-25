module.exports = function(o, cb) {
    /**
     * @param {object} o - Options object.
     * @param {requestCallback} cb - The callback that is run once complete.
     */
	var fs = require('fs'),
		GIFEncoder = require('gifencoder'),
		getPixels = require("get-pixels"),
		plucker = require('image-plucker'),
		spawn = require('child_process').spawn;

	// Options
	var o = {
		phantomExecutable: o.phantomExecutable ? o.phantomExecutable : './node_modules/.bin/phantomjs',
		dimensions: {
			width: o.dimensions.width ? o.dimensions.width : 800,
			height: o.dimensions.height ? o.dimensions.height : 650,
		},
		url: o.url ? o.url : '',
		duration: o.duration ? o.duration : 5000,
		repeat: o.repeat ? 0 : -1,
		delay: o.delay ? o.delay : 60,
		quality: o.quality ? o.quality : 3,
	};

	// Options to be passed into the child process
	var phantomOptions = {
		url: o.url,
		dimensions: o.dimensions,
		duration: o.duration,
		delay: o.delay
	}
	var args = [__dirname+'/scripts/phantom-script.js', Buffer.from(JSON.stringify(phantomOptions)).toString('base64')];

	// Init the Gif
	var encoder = new GIFEncoder(o.dimensions.width, o.dimensions.height);
	var s = encoder.createReadStream();
	 
	encoder.start();
	encoder.setRepeat(o.repeat);
	encoder.setDelay(o.delay);
	encoder.setQuality(o.quality);

	// Init the Phantom process
	var child = spawn(o.phantomExecutable, args, {});

	// Add frames to the GIF
	plucker(child.stdout, 'png', function (error, image) {
		getPixels(image, 'image/png', function(error, pixels) {
			if(error) {
				throw new Error('There was an error!');
			} else {
				encoder.addFrame(pixels.data);
			}
		})
	});

	// End the animation
	child.stdout.on('end', function() {
		encoder.finish();
		cb && cb();
	});

	return(s);
}
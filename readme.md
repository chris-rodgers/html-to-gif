## Install
npm install html-to-gif --save

## Description
HTML to animated gif generator for NodeJS using PhantomJS and Gifencoder.
Returns a stream of GIF data.

## Options
| Value             | Type   | Description                                                      |
|-------------------|--------|------------------------------------------------------------------|
| phantomExecutable | String | Location of phantomjs. Defaults to ./node_modules/.bin/phantomjs |
| dimensions        | Object | dimensions: {width: 800, height: 650}                            |
| url               | String | Target URL                                                       |
| duration          | Int    | Duration in ms                                                   |
| repeat            | Bool   | Animation repeats when finished - true / false                   |
| delay             | Int    | Time between each frame in ms                                    |
| quality           | Int    | Image quality 1-10                                               |

## Example 1
Saving the gif to a file
```
var htmlToGif = require('html-to-gif'),
	fs = require('fs');

var options = {
	dimensions:{
		width: 800,
		height: 650,
	},
	url: 'http://www.goodboydigital.com/pixijs/examples/12-2/',
	duration: 3000,
	repeat: true,
	delay:  30,
	quality: 3,
};

var filePath = __dirname + '/myanimated.gif';

htmlToGif(options, () => {
	console.log('finished');
}).pipe(fs.createWriteStream(filePath));
```

## Example 2
Taking the gif stream and serving it with ExpressJS
```
var htmlToGif = require('html-to-gif'),
    express = require('express'),
    app = express(),
    options = {
        dimensions:{
            width: 800,
            height: 650,
        },
        url: 'http://www.goodboydigital.com/pixijs/examples/12-2/',
        duration: 3000,
        repeat: true,
        delay:  30,
        quality: 3,
    };

app.get('/', function(req, res) {
    var gifStream = htmlToGif(options),
        animatedGif = '';

    // Capture the streaming output
    gifStream.on('data', function(data) {
        animatedGif += data.toString('binary');
    });

    // Once complete, write it out to the browser
    gifStream.on('end', function() {
        res.set('Content-Type', 'image/gif');
        res.end(animatedGif, 'binary');
    });
});

app.listen(3000);
console.log('http://localhost:3000')
```
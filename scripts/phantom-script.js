var page = require('webpage').create(),
	system = require('system'),
	args = system.args,
	o = JSON.parse(atob(args[1])),
	i = 0;

// phantom options
page.viewportSize = { width: o.dimensions.width, height: o.dimensions.height };

// screenshot every 25ms
page.open(o.url, function () {
  setInterval(function() {
    page.render('/dev/stdout', { format: "png" });

    i = i + o.delay

    // exit when finished
    if (i >= o.duration){
    	phantom.exit(0)
    }
  }, o.delay);
});
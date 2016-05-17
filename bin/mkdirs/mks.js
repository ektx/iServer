var args = process.argv.splice(2);
var mk = require('./mkdirs');

args.forEach(function(i) {
	mk(i)
})
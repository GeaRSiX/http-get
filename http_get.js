/*
	===============
	http_request.js
	===============
	Author: Alex Collins
	Description:	A simple node script that makes a http GET request to a specified target.
					Allows you to pass
	Arguments:
		'-h' = print help
		'--help' = print help
		'<target>' = target to make request to
	Notes:	??/12/2016 - Started development
			??/01/2017 - Finished (v1.0)
			??/01/2017 - Updated to v1.1
			21/01/2017 - Updated to v1.2
			??/02/2017 - Updated to v1.3
			05/04/2017 - Created git repo so I don't have to have this shit
	Legacy Update Log:
		v1.0 - Call the cmdline with a specified URL to make a http GET request.
		v1.1 - Can now be used as a module in other Node scrips (configured module.exports).
				Added in a rush for use in another project, could be improved.
		v1.2 - Now works with https & http requests.
				Need to rename to http(s)_get? haha
		v1.3 - Tidied up the module.exports (made constructor for module.export).
				Created resolveURL function (moved the resolve block from initOptions here)
				Created get function (moved code from module.exports.get)
*/

/*modules*/
const _fs = require('fs');
const _http = require('http');
const _https = require('https');

/*globals*/
const isNumeric = function(string) {
    return !isNaN(parseFloat(string)) && isFinite(string);
}
var Options = {
	base_url: null,
	protocol: null,
	host: null,
	port: null,
	path: null
}

/*exports*/
module.exports = http_get;
module.exports.get = get;

/*main*/
if (process.argv.length > 2) {
	get(process.argv[2], console.log);
}
function get(target, callback) {
	initOptions(target);
		
	if (callback)
		makeRequest(callback);
	else
		makeRequest();
}

/*functions*/
//main export function, acts as a constructor of this module
function http_get(baseURL) {
	if (this instanceof http_get) {
		this.Options = Options;
		this.Options.base_url = baseURL;
		this.get = get;
	}
	else
		return new http_get(baseURL);
};
//initialises Options
function initOptions(target) {
        switch (target) {
			case '-h':
			case '--help':
				printHelp();
				break;
			default:
				if(Options.base_url != null)
					Options = resolveURL(Options.base_url + target);
				else
					Options = resolveURL(target);
				break;
        }
		
}
function makeRequest(callback) {
	switch (Options.protocol) {
		case 'http:':
			_http.request(Options, handleResponse).end();
			break;
		case 'https:':
			_https.request(Options, handleResponse).end();
			break;
		default:
			throw (new Error('Invalid protocol specified ('+Options.protocol+')'));
			break;
	}
	
	function handleResponse(response) {
		var string = '';

		response.on('data', function(data) {
			string += data;
		});
		response.on('error', function(error) {
			if (callback)
				callback(error, string);
		});
		response.on('end', function () {
			Options.protocol = null,
			Options.host = null,
			Options.port = null,
			Options.path = null

			if (callback)
				callback(null, string);	
		});
	}
}
function resolveURL(url) {
	var target = url;
	var resolve = Options;
	
	//extract protocol
	if (target.indexOf('://') != -1) {
		resolve.protocol = target.substring(0, target.indexOf(':')+1);
		target = target.slice(target.indexOf(':')+3, target.length);
	}
	//extract path
	if (target.indexOf('/') != -1) {
		resolve.path = target.substring(target.indexOf('/'), target.length);
		target = target.slice(0, target.indexOf('/'));
	}
	//extract port
	if (target.indexOf(':') != -1 && isNumeric(target[target.indexOf(':')+1])) {
		var i = target.indexOf(':')+1;
		while (isNumeric(target[i])) {
			i++;
		}
		resolve.port = target.substring(target.indexOf(':')+1, i);
		target = target.slice(0, target.indexOf(':'));
	}
	//leftover = host
	resolve.host = target;
	
	return resolve;
}
function printHelp() {
	const package = JSON.parse(_fs.readFileSync(__dirname + "/package.json"));
	console.log(package.name + "\t\tv" + package.version);
	console.log(package.author);
	console.log(package.description);

	console.log("\nnode " + package.main + " <target>");
	console.log("\nIf no target is specified default target is used.");
	console.log("To change the default target, edit 'var Options' in http_get.js");

	process.exit();
}


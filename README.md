# http-get
_Really_ simple GET requests for http & https

## Contents
1. [Overview](##Overview)
2. [Usage](##Usage)
3. [Examples](##Examples)
4. [Authors](##Authors)
5. [Changelog](##Changelog)

## Overview
This is a **really** simple NodeJS module for making http/https GET requests.
A few already exist but I wanted try creating my own module as if it was going to be published.

You can use http & https urls.
All this does is make the request and return the response (even if it's 404).

## Usage
##### Like I said, really simple:
* Call the .get function from the module
```
    const http_get = require('http(s)_get');

    http_get.get('URL', callback);
```
The GET response is sent to the callback: ```callback (error, response)```
URL is passed as a string


* To make multiple requests to the same URL, just use the constructor. This sets the base request URL of that object.
	* These objects use the same .get function as above, however the base URL is already set.
	* Strings passed in the URL parameter will be added to the end of the base URL.
	* If you just want to make a request to the base URL, just pass null.
```
    const http_get = require('https_get');

    var url = http_get('url');
    url.get(null, callback);    //makes a request to 'url'
    url.get('page', callback);  //makes a request to 'url/page'
```

* Or just run it from the cmdline
```
    node http(s)_get.js URL
```
The GET response is printed in the console.

## Examples
```
const http_get = require('./http_get');

//makes a request to BASE_URL and prints the response
http_get.get('https://www.bing.co.uk/', console.log);

//create an http_get object with the base URL set as https://www.google.co.uk/
var google = http_get('https://www.google.co.uk/');
//make a get request to https://www.google.co.uk/, print the response
google.get(null , console.log);
//make a get request to https://www.google.co.uk/test, print the response
google.get('test', console.log);
```

## Authors
* [Alexander Collins](https://www.github.com/GeaRSiX)

## Changelog
I initially didn't bother creating a git repo for this, so all my notes are ripped from the main src file.

**04/09/2017**
* Created git repo so I don't need these.
* Look at the git log from now on.

**??/02/2017 - _v1.3_**
* Tidied up the module.exports (made constructor for module.export).
	* Created resolveURL function (moved the resolve block from initOptions here)
	* Created get function (moved code from module.exports.get)

**21/01/2017 - _v1.2_**
* Now works with https & http requests.
* Need to rename to http(s)_get? haha

**??/01/2017 - _v1.1_**
* Can now be used as a module in other Node scrips (configured module.exports).
* Added in a rush for use in another project, could be improved.

**??/01/2017 - _v1.0_**
* Call the cmdline with a specified URL to make a http GET request.
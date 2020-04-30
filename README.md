<div style="text-align: center;">
<h1>Sandgate</h1>
<a href="https://nodei.co/npm/sandgate/">
	<img src="https://nodei.co/npm/sandgate.png?downloads=true&stars=true"/>
</a>
<br>
<a href="https://www.npmjs.com/package/sandgate">
	<img src="https://img.shields.io/npm/v/sandgate.svg?maxAge=3600"/>
</a>
<a href="https://www.npmjs.com/package/sandgate">
    <img src="https://img.shields.io/npm/dt/sandgate.svg?maxAge=3600"/>
</a>
<a href="https://david-dm.org/LandonScripts/sandgate">
<img src="https://img.shields.io/david/LandonScripts/sandgate.svg?maxAge=3600"/>
</a>
<br>
<b>Make sure to request ideas on the <a href="https://github.com/LandonScripts/Sandgate/issues">issues page</a>!</b>
</div>

## 💽 Installation
To install Sandgate, run the code below in a terminal
```sh
npm i sandgate
```
You can start your app once you are finished coding
```sh
npm start
```
or
```sh
node server.js
```

Make sure to require Sandgate in your code
```js
const sandgate = require("sandgate") // Use "sandgate" to refrence later
```

<small>Latest Update: v1.2.3, CORS, Addon Support, and Request Parameters</small>

## 📄 Documentation

#### 📋 Table of Contents
- [Constructing a Gate](#%EF%B8%8F-constructing-a-gate)
  * [Gate Options](#%EF%B8%8F-gate-options)
- [Listening for Requests](#-listening-for-requests)
  * [Callbacks whilst Listening](#%EF%B8%8F-callbacks-whilst-listening)
- [Request Handling](#%EF%B8%8F-request-handling)
  * [GET Requests](#-get-requests)
  * [POST Requests](#%EF%B8%8F-post-requests)
  * [PUT Requests](#%EF%B8%8F-put-requests)
  * [DELETE Requests](#-delete-requests)
- [Addons](#-addons)
	* [Included Addons](#%EF%B8%8F-included-addons)
		 + [Public Directories](#-public-directories)


### 🛠️ Constructing a Gate

To begin, you must construct your first gate
```js
const sandgate = require("sandgate");

let gate = new sandgate(); // This is the constructor
``` 
Your gate can be created with options. The options are stored as a JSON in the constructor. Here is the format for options

#### ⚙️ Gate Options

```json
{
"404": "./path/to/html"
}
```
Note that there are currently only `1` variable in options, but there will be more fairly soon. The options can be used like so
```js
let opts = {
"404": "./my/404/page.html"
};

let gate = new sandgate(opts); // Creates a client with our options
```

### 👂 Listening for Requests
To listen on a port in Sandgate, you just have to call `listen` on your gate. The inputs are `(port, callback)`. Listening goes as follows
```js
gate.listen(process.env.PORT); // This could be a number as well
```
If you are running Node locally on your computer you can see your application whilst its listening by typing `localhost:3000` in your browser. Make sure to replace `3000` with whatever port you are using.

#### 🗣️ Callbacks whilst Listening
The format for the listener is just `port`. The callback grabs the port that the app is listening on and allows you to use it.

You can have your app let you know what port it is serving on. You can use the callback to do this. A callback is like a function inside of a function. Here is a simple listener with a callback.
```js
gate.listen(process.env.PORT, (port) => {
	console.log("My app is on " + port + "!");
	// Port is just a variable provided by the callback function
});
```

### 🖥️ Request handling
The most important part of a webserver *(depends who you ask)* is the request handling. This is how websites interact with the server and how files are served.

There are a few methods, these decide how an HTTP request will act. Some of these methods will give information, files, text, such as `GET` and `HEAD`, while others send information and instructions to and from such as `POST`, `PUT`, `DELETE`, and `PATCH`. *(Note that there are more methods in existance)*

Currently, Sandgate only supports `GET`, `POST`, `PUT`, and `DELETE` requests. This will change in the future because Sandgate is quite new.

#### 📥 GET Requests
The `GET` handler in Sandgate is just the function `gate.get()`. The first input is the URL path, and the second input is the callback. The callback has two inputs in this order: `request` to handle the inputs from the request, and `response` to send data back to the client. So it would look like this
```js
gate.get("/home", (req, res) => {
	console.log("Somebody visited my site at " + req.url + "!");
});

gate.listen(3000);
```

#### ➡️ POST Requests
The `POST` handler in Sandgate is similar to that of get. It is just `gate.get()`. The inputs are the same, and the callback is the same, except for an extra parameter: `body`. The callback also returns `req.body` which is the same as `body`. Here is some code
```js
gate.post("/api/login", (req, res, body) => {
	console.log(body == req.body); // returns 'true'

	res.send("Logged in!")
})
```

#### ☁️ PUT Requests
Similar to `POST` and `GET` the PUT request uses `gate.put()`. The `PUT` method is used to update data. Much like `POST` it uses `body` and `req.body` in the callback. Here is a sample
```js
gate.put("/update/file.js", (req, res) => {
	fs.writeFileSync("file.js", req.body)

	res.send("Saved!", 200)
})
```

#### ❌ DELETE Requests
`DELETE` and `PUT` requests are nearly identical. The `DELETE` method is used to delete data. It again has `body` in the callback. Here is how it might work
```js
gate.delete("api/removeUser", (req, res) => {
	myDB.user.find(JSON.parse(req.body).id).delete()

	res.send("Deleted user!", 200)
})
```

### ➕ Addons
Addons are functions added to the class structure for use in servers. Community addons are currently available! The documentation will come very soon. You can request addons in the [issues page](https://github.com/LandonScripts/SandGate/issues) of the Sandgate repository.

#### ✔️ Included addons
These addons come included with Sandgate, and are already ready for use in your server. Included addons will be added into this section of the documentation for your use. You can scroll back up to the [Table of Contents](#-table-of-contents) for easy access to the list of included addons.

----

### 🏠 CORS
This addon will allow you to make `GET` and `POST` requests across different domains. It is very simple to setup and comes preinstalled with SandGate.
```js
gate.use(sandgate.cors());

gate.listen(3000);
```
And thats it!

### 🌠 Public Directories
This addon allows you to use a directory to serve files as opposed to creating many `GET` listeners. It automatically adds a `GET` listener to all files in the specified directory. All you have to do is call `gate.public()`. It would look like as follows
```js
gate.public("./files");

gate.listen(3000);
```
So if the directory looks like this
```
app
└── public
      ├── style.css
      └── client.js
```
If you requested `localhost:3000/style.css` or `localhost:3000/client.js` it would send said file. Note that you only need one public per directory.


*( ﾟヮﾟ) Doesn't look like there are anymore addons... [Suggest one!](https://github.com/LandonScripts/SandGate/issues)*

## 🚀 Examples
Want to quickly check if you have installed Sandgate correctly? Then just setup quick-listen!

### ⚡ Quick Listen
Quick-listen is whenever there are no active request handlers, so Sandgate will default to a placeholder HTML file. It is quite easy to setup, the code goes as follows
```js
const sandgate = require("sandgate");
const gate = new sandgate();

gate.listen(3000);
```
And thats it!

### ✉️ Sending some Text
Sending text over Sandgate is extremely simple. All you have to do is create a `GET` listener, and use `res.send()`. The only input is a text input to be show to the browser. Here is the code
```js
const sandgate = require("sandgate");
const gate = new sandgate();

gate.get("/", (req, res) => {
	res.send("Hello, Sandgate!");
});

gate.listen(3000);
```
You can use send to create APIs and to send data from your webserver.

### 📦 Sending HTML
Much like sending text, sending HTML is also fairly easy. This time, we are using `res.sendFile()`. The only input is a text input that is used for the path of the file. This will read the file and send it along with the correct `mime type`. Here is some HTML
```html
<!DOCTYPE html>
<html>
	<head>
		<title>Hello, HTML!</title>
		<style>
			body {
				font-family: sans-serif;
			}
		</style>
	</head>
	<body>
		<h1>Hello Sandgate and HTML!</h1>
	</body>
</html>
```
And we will send it to the client with this code
```js
const sandgate = require("sandgate");
const gate = new sandgate();

gate.get("/", (req, res) => {
	res.sendFile("./index.html");
});

gate.listen(3000);
```
Which will appear like this!

----

<h4 style="font-family: sans-serif;">Hello Sandgate  and HTML!</h4>

----
*(Not to scale)*

### 📰 Sending a File
Sending a file is actually the exact same as [Sending HTML](#-sending-html), Again, we use `res.sendFile()`.  Here is the code
```js
const sandgate = require("sandgate");
const gate = new sandgate();

gate.get("/", (req, res) => {
	res.sendFile("./placeholder.png");
});

gate.listen(3000);
```
This works with almost any file type because of the fantastic NPM package called [`mime-types`](https://npmjs.com/mime-types).  This will allow the browser to properly display the file!

### ⚙️ Using Options
As stated previously in [Gate Options](#-gate-options), you can use options to control how your server works. Here is an example
```js
const sandgate = require("sandgate");

let options = {
	"404": "./404.html"
}

const gate = new sandgate(options);

gate.get("/", (req, res) => {
	res.send("Options! Yeah!");
});

gate.listen(3000);
```
This will make the server send the `404.html` file to the client whenever a page is requested that does not exist. You can see the other options in [Gate Options](#-gate-options).

### 🔌 Using Multiple Ports
With Sandgate, you can quickly create and listen on multiple different ports. The setup is much like a normal server, but duplicated.
```js
const sandgate = require("sandgate");

const publicGate = new sandgate();
const secretGate = new sandgate();

publicGate.get("/", (req, res) => {
	res.send("Just a normal webpage :)")
})

secretGate.get("/", (req, res) => {
	res.send("Shhhh... It's a secret!")
})


publicGate.listen(3000);
secretGate.listen(8787);
```
This is great for creating admin ports and special ports for storing more information.

### 🗄️ Addon Examples
As stated above in [Addons](#➕-addons) section, Sandgate has addons that you can use in your webserver. This is the section where every addon will have an example.

#### 🌠 Public Directories
This addon automatically creates `GET` handlers for every file in a specified directory. He is some example code
```js
const sandgate = require("sandgate");
const gate = new sandgate();

gate.public("./pictures")

gate.get("/", (req, res) => {
	res.send("My cool website, with all my cool pictures!");
});

gate.listen(3000);
```
Easy as that! All your files are available!

*( ﾟヮﾟ) Doesn't look like there are anymore addons... [Suggest one!](https://github.com/LandonScripts/SandGate/issues)*

## License
[MIT](https://github.com/LandonScripts/SandGate/blob/master/LICENSE.md)